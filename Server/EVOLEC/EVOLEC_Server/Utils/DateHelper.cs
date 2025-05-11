using System;
using System.Collections.Generic;

public class DateHelper
{
    public static List<DateOnly> GetDatesInRange(DateOnly startDate, DateOnly endDate)
    {
        List<DateOnly> dates = new List<DateOnly>();
        for (DateOnly date = startDate; date <= endDate; date = date.AddDays(1))
        {
            dates.Add(date);
        }
        return dates;
    }
}
