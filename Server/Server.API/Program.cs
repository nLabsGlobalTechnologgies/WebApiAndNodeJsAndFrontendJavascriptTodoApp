// 1. Web uygulama olu�turma: WebApplication s�n�f� kullan�larak ASP.NET Core uygulamas�n�n temeli at�l�r.
var builder = WebApplication.CreateBuilder(args);

// 2. CORS (Cross-Origin Resource Sharing) Ayarlar� Ekleme: Farkl� k�kenlerden gelen isteklere izin veren CORS ayarlar� eklenir.
builder.Services.AddCors(configure =>
{
    configure.AddDefaultPolicy(policy =>
    {
        // Herhangi bir k�kene, herhangi bir ba�l�k ve herhangi bir metoda izin veren bir politika tan�mlan�r.
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// 3. Controller ve API Explorer Eklemek: Controller'lar�, API explorer'� ve Swagger belgeleme �zelliklerini ekleyerek servisler konfig�re edilir.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. Uygulama Olu�turma: Servislerin kullan�ld��� bir uygulama nesnesi olu�turulur.
var app = builder.Build();

// 5. Geli�tirme Ortam�nda Swagger Kullan�m�: Uygulama geli�tirme ortam�nda Swagger ve Swagger UI etkinle�tirilir.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 6. CORS Kullan�m�: CORS ayarlar�n� uygular, farkl� k�kenlerden gelen isteklere izin verilmesini sa�lar.
app.UseCors();

// 7. HTTPS Y�nlendirmesi Kullan�m�: HTTP �zerinden gelen istekleri HTTPS'e y�nlendirir.
app.UseHttpsRedirection();

// 8. Yetkilendirme Kullan�m�: Yetkilendirme i�lemlerini etkinle�tirir.
app.UseAuthorization();

// 9. Controller Haritalama: Controller'lar�n haritalanmas�, istekleri do�ru controller'a y�nlendirir.
app.MapControllers();

// 10. Uygulama �al��t�rma: Uygulamay� ba�lat�r ve �al��t�r�r.
app.Run();
