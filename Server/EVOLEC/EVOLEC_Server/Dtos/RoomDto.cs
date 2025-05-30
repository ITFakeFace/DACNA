namespace EVOLEC_Server.Dtos
{
    public class RoomDto
    {
        public int ID { get; set; }
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public int Status { get; set; }
    }
}
