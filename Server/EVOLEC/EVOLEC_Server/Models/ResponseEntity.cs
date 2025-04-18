namespace EVOLEC_Server.Models
{
    public class ResponseEntity<T>
    {
        public bool Status { get; set; }
        public int ResponseCode { get; set; }
        public string? StatusMessage { get; set; }
        public T? Data { get; set; }
    }
}
