const express = require('express');

let app = express();

app.use(express.static(require('path').join(__dirname, '..', '/public')))
app.use(express.static(require('path').join(__dirname, '..', '/source')))



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