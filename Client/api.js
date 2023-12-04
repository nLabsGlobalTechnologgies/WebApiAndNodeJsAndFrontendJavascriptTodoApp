//kütüphanelerin eklenmesi
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { log } = require("console");

// express uygulamasını başlatıyoruz.
const app = express(); // 'express' doğru yazım.

// CORS ve JSON middleware'ini ekliyoruz.
app.use(cors());
app.use(express.json());

// MongoDB veritabanına bağlanıyoruz.
const url = "mongodb://127.0.0.1:27017/tododb";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        log("Database bağlantısı başarılı.");
    })
    .catch(err => {
        log(err);
    });

// MongoDB için bir şema oluşturuyoruz.
const todoSchema = new mongoose.Schema({
    name: String,
    priority: String,
    created_date: Date,
    updated_date: Date
});

// Oluşturduğumuz şemayı kullanarak bir model oluşturuyoruz.
const Todo = mongoose.model("Todo", todoSchema);

// Temel bir API endpoint'i oluşturuyoruz.
app.get("/api", (req, res) => {
    res.json({ message: "API çalışıyor." });
});

// Tüm görevleri getiren bir endpoint oluşturuyoruz.
app.get("/api/getAll", async (req, res) => {
    const todos = await Todo.find().sort({ created_date: -1 });
    res.json(todos);
});

// Yeni bir görev ekleyen bir endpoint oluşturuyoruz.
app.post("/api/save", async (req, res) => {
    const { name, priority } = req.body;

    // Yeni bir Todo öğesi oluşturuyoruz.
    const todo = new Todo({
        name: name,
        priority: priority,
        created_date: new Date().setHours(new Date().getHours() + 15)
    });

    // MongoDB'ye kaydediyoruz.
    await todo.save();

    res.json({ message: `${todo.name} eklendi` });
});

// Bir görevi güncelleyen bir endpoint oluşturuyoruz.
app.post("/api/update", async (req, res) => {
    const { _id, name, priority } = req.body;

    // Belirtilen ID'ye sahip Todo öğesini güncelliyoruz.
    await Todo.findByIdAndUpdate(_id, {
        name: name,
        priority: priority,
        updated_date: new Date().setHours(new Date().getHours() + 15)
    });

    res.json({ message: `${name} güncellendi` });
});

// Uygulamayı belirtilen port üzerinden dinlemeye başlıyoruz.
app.listen(7000, () => {
    log("API localhost:7000 üzerinden ayakta...");
});
