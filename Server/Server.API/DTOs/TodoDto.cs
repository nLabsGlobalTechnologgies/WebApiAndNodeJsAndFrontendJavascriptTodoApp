namespace Server.API.DTOs
{
    // Belirli bir sayıda sahte veri eklemek için kullanılan DTO.
    public sealed record InsertFakeDataDto(int number);

    // Yeni bir Todo öğesi eklemek için kullanılan DTO.
    public sealed record AddTodoDto(string Name, string Priority);

    // Bir Todo öğesini güncellemek için kullanılan DTO.
    public sealed record UpdateTodoDto(string _Id, string Name, string Priority);

    // Bir Todo öğesini silmek için kullanılan DTO.
    public sealed record DeleteTodoDto(string _Id);
}
