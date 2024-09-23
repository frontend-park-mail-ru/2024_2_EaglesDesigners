const body = require('body-parser');
const uuid = require('uuid').v4;

const express = require('express');

let app = express();

app.use(express.static(require('path').join(__dirname, '..', '/public')))
app.use(express.static(require('path').join(__dirname, '..', '/source')))
app.use(body.json());

const users = {
    'staskriger72@gmail.com': {
        email: 'staskriger72@gmail.com',
        password: 'password',
    },
    'stas_kriger@mail.ru': {
        email: 'stas_kriger@mail.ru',
        password: 'password',
    },
    'aleksandr.tsvetkov@corp.mail.ru': {
        email: 'aleksandr.tsvetkov@corp.mail.ru',
        password: 'password',
        age: 30,
        images: [4, 5]
    },
    'a.ostapenko@corp.mail.ru': {
        email: 'a.ostapenko@corp.mail.ru',
        password: 'password',
        age: 21
    }
};

const ids = {};

app.post('/', (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    if (!password || !email) {
        return res.status(400).json({ error: 'Не указан E-Mail или пароль' });
    }
    if (!users[email] || users[email].password !== password) {
        return res.status(400).json({ error: 'Не верный E-Mail и/или пароль' });
    }

    const id = uuid();
    ids[id] = email;

    res.cookie('podvorot', id, {
        expires: new Date(Date.now() + 1000 * 60 * 10)
    });
    res.status(200).json({ id });
});

const port = 3001
const hostname = '127.0.0.1'

// Создаём HTTP-сервер
app.get('/', (req, res) => {
  // Устанавливаем HTTP-заголовок ответа с HTTP статусом и Content type
  res.sendFile(require('path').join(__dirname, '..', '/source/index.html'))
});

// Выводим лог как только сервер будет запущен
app.listen(port, hostname, () => {

});
console.log("Server start");