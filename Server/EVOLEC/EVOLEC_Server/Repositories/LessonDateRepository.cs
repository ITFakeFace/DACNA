using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Threading.Tasks;

namespace EVOLEC_Server.Repositories
{
    public class LessonDateRepository : ILessonDateRepository
    {
        private readonly EVOLECDbContext _ctx;
        private readonly IOffDateRepository _offDateRepository;
        private readonly IRoomRepository _roomRepository;

        public LessonDateRepository(EVOLECDbContext context, IOffDateRepository offDateRepository,IRoomRepository roomRepository)
        {
            _ctx = context;
            _offDateRepository = offDateRepository;
            _roomRepository = roomRepository;
        }

        public async Task<LessonDate?> GetLessonDateByIdAsync(int id)
        {
            return await _ctx.LessonDates
                              .Where(lsd => lsd.Id == id)
                              .Include(lsd => lsd.ClassRoom)
                              .Include(lsd => lsd.Teacher)
                              .Include(lsd => lsd.Lesson)
                              .FirstOrDefaultAsync(); // Dùng FirstOrDefaultAsync thay vì FirstOrDefault
        }


        public async Task<LessonDate> AddLessonDateAsync(LessonDate lessonDate)
        {
            var matchedOffDates = _ctx.OffDates
                        .Where(od => lessonDate.Date >= od.FromDate && lessonDate.Date <= od.ToDate)
                        .ToList();
            if (matchedOffDates.Count > 0)
            {
                return null!;
            }
            _ctx.LessonDates.Add(lessonDate);
            await _ctx.SaveChangesAsync();
            return lessonDate;
        }

        public async Task<int> UpdateLessonDateAsync(LessonDate lessonDate)
        {
            _ctx.LessonDates.Update(lessonDate);
            return await _ctx.SaveChangesAsync();
        }

        public async Task<bool> DeleteLessonDateAsync(int id)
        {
            var lessonDate = await GetLessonDateByIdAsync(id);
            if (lessonDate == null) return false;

            _ctx.LessonDates.Remove(lessonDate);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<LessonDate>> GetLessonDatesAsyncByClassId(int classId)
        {
            return await _ctx.LessonDates
                .Where(ld => ld.ClassRoomId == classId)
                .Include(ld => ld.Teacher)
                .Include(ld => ld.Lesson)
                .OrderBy(ld => ld.Date)
                .ToListAsync();
        }

        public async Task<List<LessonDate>>? AddLessonDateByClassRoom(ClassRoom classRoom)
        {
            if (classRoom.Course.Lessons.Count == 0)
                return null!;

            List<Lesson> lessons = classRoom.Course.Lessons.ToList();
            List<LessonDate> lessonDates = new List<LessonDate>();
            List<string> teacherIds = new List<string>();
            List<DateOnly> LessonDates = null!;
            Shift? shift = ShiftSchedule.GetShiftById((int)classRoom.Shift!);
            LessonDates = ShiftSchedule.GetDateFromShift((DateOnly)classRoom.StartDate!, (int)classRoom.Shift!, classRoom.Course.Lessons.Count);
            int temp = 0;

            for (int i = 0; i < lessons.Count(); i++)
            {
                int assignedRoomId = classRoom.RoomId;
                var lesson = lessons[i];
                bool isRoomAvailable = CheckCanAssignRoom(LessonDates[i],shift!.FromTime,shift!.ToTime,assignedRoomId);
                if (!isRoomAvailable)
                {
                    var tempRooms = await GetAvailableRoomInTime(lessonDates[i]);
                    if (tempRooms.Count == 0)
                        return null!; // No available rooms found
                    assignedRoomId = tempRooms[0].ID;
                
                }
                var lessonDate = new LessonDate
                {
                    ClassRoomId = classRoom.Id,
                    LessonId = lesson.Id,
                    Date = LessonDates[i],
                    TeacherId = classRoom.Teacher1Id ?? classRoom.Teacher2Id,// assign temp data for avoiding constraint TeacherID is not null
                    StartTime = shift!.FromTime,
                    EndTime = shift!.ToTime,
                    RoomId = assignedRoomId
                };

                lessonDates.Add(lessonDate);
            }
            _ctx.LessonDates.AddRange(lessonDates);
            await _ctx.SaveChangesAsync();
            return lessonDates;
        }
        public async Task<List<LessonDate>?> AssignTeacherToLessonDateInitFunc(List<LessonDate> lessonDates, int ShiftId, ClassRoom classRoom)
        {
            if (lessonDates == null || ShiftId == 0 || classRoom == null)
                return null;


            List<string> TeacherIDs = new List<string>();
            var teacher1TeachingTime = new Dictionary<DateOnly, double>();
            var teacher2TeachingTime = new Dictionary<DateOnly, double>();

            List<(DateTime, DateTime, int)> teachers1NotAvailableTime = new();
            List<(DateTime, DateTime, int)> teachers2NotAvailableTime = new();

            if (!string.IsNullOrEmpty(classRoom.Teacher1Id))
            {
                TeacherIDs.Add(classRoom.Teacher1Id);
                teachers1NotAvailableTime = await GetTeacherScheduleOnTIme(classRoom.Teacher1Id, (DateOnly)classRoom.StartDate!, DateOnly.MaxValue, lessonDates[0].ClassRoomId);
            }
            if (!string.IsNullOrEmpty(classRoom.Teacher2Id))
            {
                TeacherIDs.Add(classRoom.Teacher2Id);
                teachers2NotAvailableTime = await GetTeacherScheduleOnTIme(classRoom.Teacher2Id, (DateOnly)classRoom.StartDate!, DateOnly.MaxValue, lessonDates[0].ClassRoomId);
            }

            if (TeacherIDs.Count == 0)
                return null;

            bool isFullyAssigned = await BacktrackAssignTeachers(
                TeacherIDs,
                teachers1NotAvailableTime,
                teachers2NotAvailableTime,
                teacher1TeachingTime,
                teacher2TeachingTime,
                lessonDates,
                0
            );

            if (!isFullyAssigned)
            {
                _ctx.LessonDates.RemoveRange(lessonDates);
                return null;
            }
            foreach (var lessonDate in lessonDates)
            {
                await UpdateLessonDateAsync(lessonDate);
            }
            await _ctx.SaveChangesAsync();
            return lessonDates;
        }


        private async Task<bool> BacktrackAssignTeachers(List<string> listTeacherIDs,
                                      List<(DateTime, DateTime, int)> teachers1NotAvailableTime,
                                      List<(DateTime, DateTime, int)> teachers2NotAvailableTime,
                                      Dictionary<DateOnly, double> teacher1TeachingTime,
                                      Dictionary<DateOnly, double> teacher2TeachingTime,
                                      List<LessonDate> lessonDates,
                                      int index)
        {
            if (lessonDates.Count == index+1)
                return await Task.FromResult(true) ;

            var currentLesson = lessonDates[index];
            DateOnly date = currentLesson.Date!.Value;

            bool canAssignT1 = listTeacherIDs.Count > 0 &&
                               CanAssignTeacher(currentLesson, teacher1TeachingTime, teachers1NotAvailableTime.Select(t => (t.Item1, t.Item2)).ToList());

            bool canAssignT2 = listTeacherIDs.Count > 1 && listTeacherIDs[1] == currentLesson.ClassRoom?.Teacher2Id &&
                               CanAssignTeacher(currentLesson, teacher2TeachingTime, teachers2NotAvailableTime.Select(t => (t.Item1, t.Item2)).ToList());

            if (!canAssignT1 && !canAssignT2)
            {
                Console.WriteLine($"False at index {index}");
                Console.WriteLine($"Date {lessonDates[index].Date}");
                return false;
            }
                

            double currentDateTeacher1TeachingTime = 0;
            double currentDateTeacher2TeachingTime = 0;
            if (canAssignT1 && canAssignT2)
            {
                currentDateTeacher1TeachingTime = await GetTeachingHoursForTeacherOnDate(date, listTeacherIDs[0],currentLesson.ClassRoomId);
                currentDateTeacher2TeachingTime = await GetTeachingHoursForTeacherOnDate(date, listTeacherIDs[1],currentLesson.ClassRoomId);
                int prevIndex = index - 1;
                int tempTeacherIDIdx = 0;
                if (currentDateTeacher1TeachingTime == currentDateTeacher2TeachingTime)
                {
                    if (lessonDates[Math.Max(prevIndex,0)].TeacherId == listTeacherIDs[0])
                    {
                        tempTeacherIDIdx = 1;
                        currentLesson.TeacherId = listTeacherIDs[1] ;
                    }
                    else
                    {
                        tempTeacherIDIdx = 0;
                        currentLesson.TeacherId = listTeacherIDs[0];
                    }
                }
                else if(currentDateTeacher1TeachingTime < currentDateTeacher2TeachingTime)
                {
                    tempTeacherIDIdx = 0;
                    currentLesson.TeacherId = listTeacherIDs[0];
                }
                else
                {
                    tempTeacherIDIdx = 1;
                    currentLesson.TeacherId = listTeacherIDs[1];
                }
                if( !(await BacktrackAssignTeachers(listTeacherIDs, teachers1NotAvailableTime, teachers2NotAvailableTime,
                                               teacher1TeachingTime, teacher2TeachingTime, lessonDates, ++index)))
                {
                    currentLesson.TeacherId = listTeacherIDs[tempTeacherIDIdx = tempTeacherIDIdx ^1];
                    return !(await BacktrackAssignTeachers(listTeacherIDs, teachers1NotAvailableTime, teachers2NotAvailableTime,
                                               teacher1TeachingTime, teacher2TeachingTime, lessonDates, ++index));
                }
                else
                {
                    return true;
                }
            }
            if (canAssignT1 && (!canAssignT2 || (currentDateTeacher1TeachingTime <= currentDateTeacher2TeachingTime)))
            {
                int prevIndex = index - 1;
                if (currentDateTeacher1TeachingTime == currentDateTeacher2TeachingTime)
                {
                    if (lessonDates[prevIndex].TeacherId == listTeacherIDs[0])
                    {
                        currentLesson.TeacherId = listTeacherIDs[1] ?? listTeacherIDs[0];
                    }
                    else
                    {
                        currentLesson.TeacherId = listTeacherIDs[0];
                    }
                }
                else
                {
                    currentLesson.TeacherId = listTeacherIDs[0];
                }
                return !(await BacktrackAssignTeachers(listTeacherIDs, teachers1NotAvailableTime, teachers2NotAvailableTime,
                                               teacher1TeachingTime, teacher2TeachingTime, lessonDates, ++index));
            }

            if (canAssignT2)
            {
                currentLesson.TeacherId = listTeacherIDs[1];

                return !(await BacktrackAssignTeachers(listTeacherIDs, teachers1NotAvailableTime, teachers2NotAvailableTime,
                                               teacher1TeachingTime, teacher2TeachingTime, lessonDates, ++index));
            }

            return true;
        }



        private bool CanAssignTeacher(LessonDate lessonDate, Dictionary<DateOnly, double> teachingTime, List<(DateTime, DateTime)> teacherNotAvailableTimes)
        {
            var lessonStart = lessonDate.Date!.Value.ToDateTime(lessonDate.StartTime!.Value);
            var lessonEnd = lessonDate.Date.Value.ToDateTime(lessonDate.EndTime!.Value);

            foreach (var (unavailableStart, unavailableEnd) in teacherNotAvailableTimes)
            {
                if (lessonStart < unavailableEnd && lessonEnd > unavailableStart)
                    return false;
            }

            return true;
        }


        public Task<int> AddLessonDates(IEnumerable<LessonDate> lessonDates)
        {
            List<LessonDate> lessonDateList = lessonDates.ToList();
            _ctx.LessonDates.AddRangeAsync(lessonDateList);
            return _ctx.SaveChangesAsync();
        }

        // Lấy số giờ giảng dạy của một lớp học
        private double GetLessonDuration(TimeOnly StartTime, TimeOnly EndTime)
        {
            // Tính sự chênh lệch thời gian và ép kiểu về giờ (TotalHours) hoặc phút (TotalMinutes)
            TimeSpan duration = EndTime - StartTime;
            return duration.TotalHours;
        }



        public async Task<List<(DateTime, DateTime, int)>> GetTeacherScheduleOnTIme(string UID, DateOnly startDate, DateOnly endDate, int classroomID)
        {

            List<LessonDate> lessonDates = await _ctx.LessonDates
                                .Where(ld => ld.TeacherId == UID &&
                                             ld.Date >= startDate &&
                                             ld.Date <= endDate &&
                                             ld.ClassRoomId != classroomID
                                             )
                                .ToListAsync();
            var lessonDateTimeRanges = lessonDates
                    .Where(ld => ld.Date.HasValue && ld.StartTime.HasValue && ld.EndTime.HasValue)
                    .Select(ld => (
                        Start: ld.Date!.Value.ToDateTime(ld.StartTime!.Value),
                        End: ld.Date.Value.ToDateTime(ld.EndTime!.Value),
                        IsOff: -1 // -1 indicates normal teaching time, 1 indicates off date
                    ))
                    .ToList();
            var teacherOffDatesInrange = await _offDateRepository.GetTeacherOffDatesInRangeAsync(startDate, DateOnly.MaxValue, UID);
            foreach (var offDates in teacherOffDatesInrange)
            {
                lessonDateTimeRanges.Add((
                    Start: offDates.FromDate.ToDateTime(TimeOnly.MinValue),
                    End: offDates.ToDate.ToDateTime(TimeOnly.MaxValue),
                    IsOff: offDates.Id
                ));
            }
            return lessonDateTimeRanges;
        }

        public async Task<double> GetTeachingHoursForTeacherOnDate(DateOnly date, string TeacherID,int classRoomID)
        {
            // Lọc các lớp học của Teacher2 trong ngày cụ thể
            var teachingSessions = await _ctx.LessonDates
                .Where(ld => ld.TeacherId == TeacherID && ld.Date.HasValue
                             && ld.Date == date
                             && ld.ClassRoomId != classRoomID
                             )  // Lọc lớp học theo ngày
                .ToListAsync();

            // Tính tổng số giờ giảng dạy
            double totalHours = 0;

            foreach (var session in teachingSessions)
            {
                // Kiểm tra nếu cả StartTime và EndTime đều có giá trị
                if (session.StartTime.HasValue && session.EndTime.HasValue)
                {
                    // Tính số giờ giữa StartTime và EndTime
                    var duration = session.EndTime.Value - session.StartTime.Value;
                    totalHours += duration.TotalHours; // Thêm vào tổng số giờ
                }
            }
            
            return totalHours;
        }

        private bool CheckCanAssignRoom(DateOnly date , TimeOnly startTime, TimeOnly endTime, int roomID)
        {
            // Kiểm tra phòng học có đc đăng ký trước khi tạo lớp học
            var existingLessonDates = _ctx.LessonDates
                .Where(ld => ld.Date ==date &&
                             ld.EndTime <  startTime &&
                             ld.EndTime > endTime &&
                             ld.RoomId == roomID
                             )
                .ToList();
            return existingLessonDates.Count() == 0 || existingLessonDates.IsNullOrEmpty();
        }

        private async Task<List<Room>> GetAvailableRoomInTime(LessonDate lessonDate)
        {
           return await _roomRepository.GetAvailableRoomsInTime(lessonDate.Date!.Value, lessonDate.StartTime!.Value, lessonDate.EndTime!.Value);
        }

        public async Task<bool> DeleteLessonDatesAsync(IEnumerable<LessonDate> lessonDates)
        {
            _ctx.LessonDates.RemoveRange(lessonDates);
            return await _ctx.SaveChangesAsync() > 0;
        }
    }
}
