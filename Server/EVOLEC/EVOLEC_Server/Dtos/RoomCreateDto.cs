namespace EVOLEC_Server.Dtos
{
    public class RoomCreateDto
    {
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public int Status { get; set; } = 1;
    }
}
