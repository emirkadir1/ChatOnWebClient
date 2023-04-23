namespace ChatOnWebClient.Models
{
    public class EditProfile
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; } = DateTime.MinValue;
        public string ImageUrl { get; set; } = string.Empty;
    }
}
