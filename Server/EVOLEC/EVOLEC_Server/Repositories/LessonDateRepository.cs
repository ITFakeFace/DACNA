using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EVOLEC_Server.Repositories
{
    public class LessonDateRepository : ILessonDateRepository
    {
        private readonly EVOLECDbContext _ctx;

        public LessonDateRepository(EVOLECDbContext context)
        {
            _ctx = context;
        }

        public async Task<LessonDate?> GetLessonDateByIdAsync(int id)
        {
            return await _ctx.LessonDates
                              .Where(lsd => lsd.Id == id)
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
            return await _ctx.SaveChangesAsync() ;
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
                .Include(ld=>ld.Teacher)
                .Include(ld=>ld.Lesson)
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

            switch (CheckTeacher(classRoom))
            {
                case 1:
                    teacherIds.Add(classRoom.Teacher1Id ?? classRoom.Teacher2Id!);
                    break;
                case 2:
                    teacherIds.Add(classRoom.Teacher1Id!);
                    teacherIds.Add(classRoom.Teacher2Id!);
                    break;
            }

            int temp = 0;

            for (int i = 0; i < lessons.Count(); i++)
            {
                var lesson = lessons[i];

                var lessonDate = new LessonDate
                {
                    ClassRoomId = classRoom.Id,
                    LessonId = lesson.Id,
                    Date = LessonDates[i],
                    StartTime = shift!.FromTime,
                    EndTime = shift!.ToTime
                };

                if (teacherIds.Count == 1)
                {
                    lessonDate.TeacherId = teacherIds[0];
                }
                else if (teacherIds.Count == 2)
                {
                    lessonDate.TeacherId = temp == 0 ? teacherIds[0] : teacherIds[1];
                    temp ^= 1;
                }

                lessonDates.Add(lessonDate);
            }
            _ctx.LessonDates.AddRange(lessonDates);
            await _ctx.SaveChangesAsync();
            return lessonDates;
        }
        public int CheckTeacher(ClassRoom classRoom)
        {
            int hasTeacher = 0;
            if (!string.IsNullOrEmpty(classRoom.Teacher1Id))
            {
                hasTeacher++;
            }
            if (!string.IsNullOrEmpty(classRoom.Teacher2Id))
            {
                hasTeacher++;
            }
            return hasTeacher;
        }

        public async Task<List<LessonDate>?> HandleLessonDateOff( List<LessonDate> lessonDates, int ShiftId)
        {
            if (lessonDates == null || ShiftId == null)
                return null;

            var minDate = lessonDates.Min(ld => ld.Date);
            var maxDate = lessonDates.Max(ld => ld.Date);

            var offDatesInRange = await _ctx.OffDates
                .Where(offDate => offDate.FromDate > minDate && offDate.FromDate < maxDate &&
                                  offDate.ToDate > minDate &&
                                  offDate.ToDate < maxDate)
                .ToListAsync();

            for (int i = 0; i < lessonDates.Count; i++)
            {
                var lessonDate = lessonDates[i];

                foreach (var offDate in offDatesInRange)
                {
                    while (lessonDate.Date >= offDate.FromDate && lessonDate.Date <= offDate.ToDate)
                    {
                        DateOnly lastLessonDate = (DateOnly)lessonDates[lessonDates.Count - 1].Date;
                        lessonDate.Date = lastLessonDate;
                        LessonOffDate lessonOffDate = new LessonOffDate()
                        {
                            LessonDateId = lessonDate.Id,
                            OffDateId = offDate.Id,
                            InitDate = (DateOnly)lessonDate.Date
                        };
                    }

                }
            }
            return lessonDates;
        }
    }
}
