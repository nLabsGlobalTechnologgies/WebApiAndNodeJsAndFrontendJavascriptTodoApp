// Sahte veri oluşturmak için Bogus kütüphanesini kullanır.
using Bogus;
// ASP.NET Core MVC uygulamaları için temel controller sınıfını içerir.
using Microsoft.AspNetCore.Mvc;
// MongoDB işlemleri için gerekli sınıfları içerir.
using MongoDB.Driver;
// DTO (Data Transfer Object) sınıflarını içeren namespace.
using Server.API.DTOs;
// Veritabanı model sınıflarını içeren namespace.
using Server.API.Models;
// Zaman ölçümü yapmak için Stopwatch sınıfını içeren namespace.
using System.Diagnostics;


namespace Server.API.Controllers
{
    // TodosController sınıfı, MongoDB'deki "todos" koleksiyonu üzerinde CRUD işlemlerini gerçekleştiren bir Web API kontrolcüsünü temsil eder.
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TodosController : ControllerBase
    {
        // MongoDB koleksiyonunu temsil eden IMongoCollection nesnesi.
        private readonly IMongoCollection<Todo> context;

        // TodosController sınıfının constructor'ı, MongoDB bağlantısını ve koleksiyonunu yapılandırır.
        public TodosController()
        {
            var client = new MongoClient("mongodb://127.0.0.1:27017");
            var database = client.GetDatabase("tododb");
            context = database.GetCollection<Todo>("todos");
        }

        // Sahte veri eklemek için kullanılan HTTP POST endpoint'i.
        [HttpPost]
        public async Task<IActionResult> AddTodosToDatabaseInsert(InsertFakeDataDto request)
        {
            // HTTP isteğinden gelen sayı kadar sahte Todo öğesi oluşturulur.
            int totalTodoCount = request.number;
            List<Todo> tList = new();
            for (int i = 0; i < totalTodoCount; i++)
            {
                Faker faker = new();
                Todo todo = new()
                {
                    Name = faker.Name.FullName(),
                    Priority = "Normal",
                    CreatedDate = DateTime.Now.AddHours(3)
                };
                tList.Add(todo);
            }

            // Oluşturulan Todo öğeleri MongoDB'ye eklenir.
            await context.InsertManyAsync(tList);

            // Zaman ölçümü başlatılır.
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            // MongoDB'den belirli bir sayıda Todo öğesi çekilir.
            var todos = context.Find(todo => true).SortByDescending(t => t.CreatedDate).Limit(100).ToListAsync();
            stopwatch.Stop();

            // Zaman ölçümü sona erer.
            var result = stopwatch.Elapsed.TotalMilliseconds;

            // Kullanıcıya bilgi mesajıyla birlikte HTTP OK döner.
            return Ok(new { Message = $"Toplam: {totalTodoCount} adet Todo Eklendi. İşlem: {result} milisaniye sürdü" });
        }

        // Tüm Todo öğelerini getiren ve zaman ölçen HTTP GET endpoint'i.
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Zaman ölçümü başlatılır.
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            // MongoDB'den belirli bir sayıda Todo öğesi çekilir.
            var todos = context.Find(todo => true).SortByDescending(t => t.CreatedDate).Limit(20).ToListAsync();
            stopwatch.Stop();

            // Zaman ölçümü sona erer.
            var result = stopwatch.Elapsed.TotalMilliseconds;

            // Kullanıcıya çekilen Todo öğeleriyle birlikte HTTP OK döner.
            return Ok(todos.Result);
        }

        // Yeni bir Todo öğesi eklemek için kullanılan HTTP POST endpoint'i.
        [HttpPost]
        public async Task<IActionResult> Save(AddTodoDto request)
        {
            // Yeni bir Todo öğesi oluşturulur ve MongoDB'ye eklenir.
            Todo todo = new()
            {
                Name = request.Name,
                Priority = request.Priority,
                CreatedDate = DateTime.Now.AddHours(3)
            };
            await context.InsertOneAsync(todo);

            // Kullanıcıya bilgi mesajıyla birlikte HTTP OK döner.
            return Ok(new { Message = $"{todo.Name} Eklendi" });
        }

        // Bir Todo öğesini güncellemek için kullanılan HTTP POST endpoint'i.
        [HttpPost]
        public async Task<IActionResult> Update(UpdateTodoDto request)
        {
            // Güncellenecek Todo öğesinin bilgileri alınır ve MongoDB'de güncellenir.
            var todo = Builders<Todo>.Update.Set(t => t.Name, request.Name).Set(t => t.Priority, request.Priority).Set(t => t.UpdatedDate, DateTime.Now.AddHours(3));
            await context.FindOneAndUpdateAsync(t => t._id == request._Id, todo);

            // Kullanıcıya bilgi mesajıyla birlikte HTTP OK döner.
            return Ok(new { Message = $"Update {request.Name}" });
        }

        // Bir Todo öğesini silmek için kullanılan HTTP POST endpoint'i.
        [HttpPost]
        public async Task<IActionResult> Delete(DeleteTodoDto request)
        {
            // Silinecek Todo öğesi MongoDB'den bulunur ve silinir.
            await context.FindOneAndDeleteAsync(t => t._id == request._Id);

            // Kullanıcıya bilgi mesajıyla birlikte HTTP No Content döner.
            return NoContent();
        }
    }
}
