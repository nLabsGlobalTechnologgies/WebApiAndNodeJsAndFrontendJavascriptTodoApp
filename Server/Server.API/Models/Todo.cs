using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Server.API.Models
{
    // MongoDB'deki belirli koleksiyonlara karşılık gelen "Todo" sınıfı tanımlanır.
    public sealed class Todo
    {
        // MongoDB için belirtilmiş "_id" alanı, nesnenin benzersiz kimliğini temsil eder.
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        // "Name" alanı, yapının adını temsil eder ve MongoDB'deki belgelerde "name" olarak adlandırılır.
        [BsonElement("name")]
        public string Name { get; set; }

        // "Priority" alanı, yapının önceliğini temsil eder ve MongoDB'deki belgelerde "priority" olarak adlandırılır.
        [BsonElement("priority")]
        public string Priority { get; set; }

        // "CreatedDate" alanı, yapının oluşturulma tarihini temsil eder ve MongoDB'deki belgelerde "created_date" olarak adlandırılır.
        [BsonElement("created_date")]
        public DateTime CreatedDate { get; set; }

        // "UpdatedDate" alanı, yapının güncellenme tarihini temsil eder (opsiyonel) ve MongoDB'deki belgelerde "updated_date" olarak adlandırılır.
        [BsonElement("updated_date")]
        public DateTime? UpdatedDate { get; set; }

        // "__v" alanı, MongoDB'nin sürüm kontrolü için kullanılır ve MongoDB'deki belgelerde "__v" olarak adlandırılır.
        [BsonElement("__v")]
        public int Version { get; set; }
    }
}
