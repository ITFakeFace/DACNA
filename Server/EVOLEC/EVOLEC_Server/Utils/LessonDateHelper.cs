using EVOLEC_Server.Dtos;
using EVOLEC_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace EVOLEC_Server.Utils
{
    public static class LessonDateHelper
    {
        public static async Task<List<LessonDate>?> HandleDateOff(EVOLECDbContext _ctx, List<LessonDate> lessonDates, int ShiftId)
        {
            if (lessonDates == null || ShiftId == null)
                return null;

            var minDate = lessonDates.Min(ld => ld.Date);
            var maxDate = lessonDates.Max(ld => ld.Date);

            var offDatesInRange = await _ctx.OffDates
                .Where(offDate => offDate.FromDate > minDate && offDate.FromDate < maxDate &&
                                  DateOnly.FromDateTime(offDate.ToDate) > minDate &&
                                  DateOnly.FromDateTime(offDate.ToDate) < maxDate)
                .ToListAsync();

            int count = 0;

            for (int i = 0; i < lessonDates.Count; i++)
            {
                var lessonDate = lessonDates[i];

                foreach (var offDate in offDatesInRange)
                {
                    if (lessonDate.Date >= offDate.FromDate && lessonDate.Date <= DateOnly.FromDateTime(offDate.ToDate))
                    {
                        offDate.LessonDates.Add(lessonDate);
                        DateOnly lastLessonDate = (DateOnly)lessonDates[lessonDates.Count - 1].Date;
                        List<DateOnly> dates = ShiftSchedule.GetDateFromShift(lastLessonDate.AddDays(1), ShiftId, 1);
                        count += dates.Count();

                        LessonDate tempLessonDate = new LessonDate()
                        {
                            TeacherId = lessonDate.TeacherId,
                            ClassRoomId = lessonDate.ClassRoomId,
                            Note = lessonDate.Note,
                            StartTime = lessonDate.StartTime,
                            EndTime = lessonDate.EndTime,
                            Date = dates[0]
                        };

                        lessonDates.Add(tempLessonDate);
                        break;
                    }
                }
            }

            var originalLessonDates = lessonDates
                .Select(ld => new { ld.LessonId, ld.Date })
                .OrderBy(ld => ld.Date)
                .ToList();

            int ptrOriginal = 0;
            int ptrUpdated = 0;

            while (ptrUpdated < lessonDates.Count && ptrOriginal < originalLessonDates.Count - count)
            {
                var currentDate = lessonDates[ptrUpdated].Date;

                bool isOff = offDatesInRange.Any(off =>
                    currentDate >= off.FromDate && currentDate <= DateOnly.FromDateTime(off.ToDate));

                lessonDates[ptrUpdated].LessonId = originalLessonDates[ptrOriginal].LessonId;

                if (!isOff)
                {
                    ptrOriginal++;
                }

                ptrUpdated++;
            }

            return lessonDates;
        }

        public static async Task<List<LessonDate>>? CreateLessonDates(ClassRoom classRoom)
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

            return lessonDates;
        }

        public static int CheckTeacher(ClassRoom classRoom)
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
    }
}
