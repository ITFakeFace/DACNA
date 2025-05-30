using EVOLEC_Server.Models;
using System;
using System.Collections.Generic;

namespace EVOLEC_Server.Dtos
{
    public class ShiftSchedule
    {
        public static List<Shift> _shiftList = new List<Shift>()
        {
            new Shift(1, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(8, 0), new TimeOnly(9, 30)),
            new Shift(2, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(9, 30), new TimeOnly(11, 0)),
            new Shift(3, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(11, 0), new TimeOnly(12, 30)),
            new Shift(4, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(13, 0), new TimeOnly(14, 30)),
            new Shift(5, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(14, 30), new TimeOnly(16, 0)),
            new Shift(6, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(16, 0), new TimeOnly(17, 30)),
            new Shift(7, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(17, 30), new TimeOnly(19, 0)),
            new Shift(8, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(19, 0), new TimeOnly(20, 30)),
            new Shift(9, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(20, 30), new TimeOnly(22, 0)),
            new Shift(10, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(8, 0), new TimeOnly(10, 00)),
            new Shift(11, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(10, 0), new TimeOnly(12, 00)),
            new Shift(12, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(13, 0), new TimeOnly(15, 00)),
            new Shift(13, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(15, 0), new TimeOnly(17, 00)),
            new Shift(14, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(17, 0), new TimeOnly(19, 00)),
            new Shift(15, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(8, 0), new TimeOnly(9, 30)),
            new Shift(16, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(9, 30), new TimeOnly(11, 0)),
            new Shift(17, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(11, 0), new TimeOnly(12, 30)),
            new Shift(18, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(13, 0), new TimeOnly(14, 30)),
            new Shift(19, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(14, 30), new TimeOnly(16, 0)),
            new Shift(20, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(16, 0), new TimeOnly(17, 30)),
            new Shift(21, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(17, 30), new TimeOnly(19, 0)),
            new Shift(22, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(19, 0), new TimeOnly(20, 30)),
            new Shift(23, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(20, 30), new TimeOnly(22, 0)),
            
        public static List<DateOnly> GetDateFromShift(DateOnly FromDate, int shiftId, int DateNumber)
        {
            List<DateOnly> resultDates = new List<DateOnly>();
            DateOnly currentDate = FromDate;
            Shift shift = GetShiftById(shiftId);
            for (; resultDates.Count() < DateNumber; currentDate = currentDate.AddDays(1))
            {
                // Kiểm tra ngày trong tuần có nằm trong _days_of_week
                if (!Array.Exists(shift.DayOfWeeks, day => (DayOfWeek)currentDate.DayOfWeek == day))
                {
                    continue;
                }

                resultDates.Add(currentDate);
            }

            return resultDates;
        }

        public static List<Shift> GetAllShifts()
        {
            return _shiftList;
        }
        public static Shift GetShiftById(int id)
        {
            return _shiftList[id - 1];
        }
    }
}