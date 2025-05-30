namespace EVOLEC_Server.Dtos
{
    public class OffDateCreateDto
    {
        public string Name { get; set; }
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
        public int Status { get; set; }

        //public bool ApplyAllRecentClass { get; set; }
        //public List<int> ClassRoomIds { get; set; }
    }
}
