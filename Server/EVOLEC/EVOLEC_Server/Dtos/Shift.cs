namespace EVOLEC_Server.Dtos
{
    public class Shift
    {
        public int Id { get; set; } // Thêm ID cho mỗi Shift
        public DayOfWeek[] DayOfWeeks { get; set; }
        public TimeOnly FromTime { get; set; }
        public TimeOnly ToTime { get; set; }
        public Shift(int Id,DayOfWeek[] days_of_week,TimeOnly fromTime, TimeOnly toTime) 
        {

            DayOfWeeks = days_of_week;
            FromTime = fromTime;
            ToTime = toTime;
        } 


    }
}
