const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Добавляем cookie-parser
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к MongoDB
mongoose.connect('mongodb+srv://mooki007bhek:xhjackmrphy@cluster0.k0pfg.mongodb.net/');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Подключаем cookie-parser
app.use(express.static('views'));

// Маршруты
app.use('/auth', authRoutes); // Сначала регистрируем маршруты аутентификации

// Главный маршрут
app.get('/', (req, res) => { // Меняем на app.get для конкретного пути
    if (req.cookies.token) {
        res.sendFile(__dirname + '/views/login.html');
    } else {
        res.sendFile(__dirname + '/views/register.html');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
