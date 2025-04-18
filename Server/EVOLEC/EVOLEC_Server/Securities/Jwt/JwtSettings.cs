namespace EVOLEC_Server.Securities.Jwt
{
    public class JwtSettings
    {
        public bool Enable { get; set; }
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
        public int TokenValidityInMinutes { get; set; } = 60;
    }
}
