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
            new Shift(2, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(8, 30), new TimeOnly(10, 0)),
            new Shift(3, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(9, 0), new TimeOnly(10, 30)),
            new Shift(4, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(9, 30), new TimeOnly(11, 0)),
            new Shift(5, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(10, 0), new TimeOnly(11, 30)),
            new Shift(6, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(10, 30), new TimeOnly(12, 0)),
            new Shift(7, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(11, 0), new TimeOnly(12, 30)),
            new Shift(8, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(11, 30), new TimeOnly(13, 0)),
            new Shift(9, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(12, 0), new TimeOnly(13, 30)),
            new Shift(10, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(12, 30), new TimeOnly(14, 0)),
            new Shift(11, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(13, 0), new TimeOnly(14, 30)),
            new Shift(12, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(13, 30), new TimeOnly(15, 0)),
            new Shift(13, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(14, 0), new TimeOnly(15, 30)),
            new Shift(14, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(14, 30), new TimeOnly(16, 0)),
            new Shift(15, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(15, 0), new TimeOnly(16, 30)),
            new Shift(16, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(15, 30), new TimeOnly(17, 0)),
            new Shift(17, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(16, 0), new TimeOnly(17, 30)),
            new Shift(18, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(16, 30), new TimeOnly(18, 0)),
            new Shift(19, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(17, 0), new TimeOnly(18, 30)),
            new Shift(20, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(17, 30), new TimeOnly(19, 0)),
            new Shift(21, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(18, 0), new TimeOnly(19, 30)),
            new Shift(22, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(18, 30), new TimeOnly(20, 0)),
            new Shift(23, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(19, 0), new TimeOnly(20, 30)),
            new Shift(24, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(19, 30), new TimeOnly(21, 0)),
            new Shift(25, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(20, 0), new TimeOnly(21, 30)),
            new Shift(26, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(20, 30), new TimeOnly(22, 0)),
            new Shift(27, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(21, 0), new TimeOnly(22, 30)),
            new Shift(28, [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday], new TimeOnly(21, 30), new TimeOnly(23, 0)),
            new Shift(29, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(8, 0), new TimeOnly(10, 30)),
            new Shift(30, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(10, 0), new TimeOnly(12, 30)),
            new Shift(31, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(12, 0), new TimeOnly(14, 30)),
            new Shift(32, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(14, 0), new TimeOnly(16, 30)),
            new Shift(33, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(16, 0), new TimeOnly(17, 30)),
            new Shift(34, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(18, 0), new TimeOnly(19, 30)),
            new Shift(35, [DayOfWeek.Saturday, DayOfWeek.Sunday], new TimeOnly(20, 0), new TimeOnly(21, 30)),
            new Shift(36, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(8, 0), new TimeOnly(9, 30)),
            new Shift(37, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(8, 30), new TimeOnly(10, 0)),
            new Shift(38, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(9, 0), new TimeOnly(10, 30)),
            new Shift(39, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(9, 30), new TimeOnly(11, 0)),
            new Shift(40, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(10, 0), new TimeOnly(11, 30)),
            new Shift(41, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(10, 30), new TimeOnly(12, 0)),
            new Shift(42, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(11, 0), new TimeOnly(12, 30)),
            new Shift(43, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(11, 30), new TimeOnly(13, 0)),
            new Shift(44, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(12, 0), new TimeOnly(13, 30)),
            new Shift(45, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(12, 30), new TimeOnly(14, 0)),
            new Shift(46, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(13, 0), new TimeOnly(14, 30)),
            new Shift(47, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(13, 30), new TimeOnly(15, 0)),
            new Shift(48, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(14, 0), new TimeOnly(15, 30)),
            new Shift(49, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(14, 30), new TimeOnly(16, 0)),
            new Shift(50, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(15, 0), new TimeOnly(16, 30)),
            new Shift(51, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(15, 30), new TimeOnly(17, 0)),
            new Shift(52, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(16, 0), new TimeOnly(17, 30)),
            new Shift(53, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(16, 30), new TimeOnly(18, 0)),
            new Shift(54, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(17, 0), new TimeOnly(18, 30)),
            new Shift(55, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(17, 30), new TimeOnly(19, 0)),
            new Shift(56, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(18, 0), new TimeOnly(19, 30)),
            new Shift(57, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(18, 30), new TimeOnly(20, 0)),
            new Shift(58, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(19, 0), new TimeOnly(20, 30)),
            new Shift(59, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(19, 30), new TimeOnly(21, 0)),
            new Shift(60, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(20, 0), new TimeOnly(21, 30)),
            new Shift(61, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(20, 30), new TimeOnly(22, 0)),
            new Shift(62, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(21, 0), new TimeOnly(22, 30)),
            new Shift(63, [DayOfWeek.Tuesday, DayOfWeek.Thursday, DayOfWeek.Saturday], new TimeOnly(21, 30), new TimeOnly(23, 0))
        };
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


        public static Shift GetShiftById(int id)
        {
            return _shiftList[id-1];
        }
    }
}