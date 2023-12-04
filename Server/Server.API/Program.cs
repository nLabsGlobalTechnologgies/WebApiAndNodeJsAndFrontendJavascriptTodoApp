// 1. Web uygulama oluþturma: WebApplication sýnýfý kullanýlarak ASP.NET Core uygulamasýnýn temeli atýlýr.
var builder = WebApplication.CreateBuilder(args);

// 2. CORS (Cross-Origin Resource Sharing) Ayarlarý Ekleme: Farklý kökenlerden gelen isteklere izin veren CORS ayarlarý eklenir.
builder.Services.AddCors(configure =>
{
    configure.AddDefaultPolicy(policy =>
    {
        // Herhangi bir kökene, herhangi bir baþlýk ve herhangi bir metoda izin veren bir politika tanýmlanýr.
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// 3. Controller ve API Explorer Eklemek: Controller'larý, API explorer'ý ve Swagger belgeleme özelliklerini ekleyerek servisler konfigüre edilir.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. Uygulama Oluþturma: Servislerin kullanýldýðý bir uygulama nesnesi oluþturulur.
var app = builder.Build();

// 5. Geliþtirme Ortamýnda Swagger Kullanýmý: Uygulama geliþtirme ortamýnda Swagger ve Swagger UI etkinleþtirilir.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 6. CORS Kullanýmý: CORS ayarlarýný uygular, farklý kökenlerden gelen isteklere izin verilmesini saðlar.
app.UseCors();

// 7. HTTPS Yönlendirmesi Kullanýmý: HTTP üzerinden gelen istekleri HTTPS'e yönlendirir.
app.UseHttpsRedirection();

// 8. Yetkilendirme Kullanýmý: Yetkilendirme iþlemlerini etkinleþtirir.
app.UseAuthorization();

// 9. Controller Haritalama: Controller'larýn haritalanmasý, istekleri doðru controller'a yönlendirir.
app.MapControllers();

// 10. Uygulama Çalýþtýrma: Uygulamayý baþlatýr ve çalýþtýrýr.
app.Run();
