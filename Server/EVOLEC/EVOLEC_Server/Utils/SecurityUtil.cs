namespace EVOLEC_Server.Utils
{
    public class SecurityUtil
    {
        public static string GenerateCode()
        {
            Random random = new Random();
            int code = random.Next(100000, 1000000); // Tạo số ngẫu nhiên từ 100000 đến 999999
            return code.ToString();
        }
    }
}
