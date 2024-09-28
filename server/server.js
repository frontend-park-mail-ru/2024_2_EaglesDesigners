const body = require('body-parser');

const express = require('express');

let app = express();


app.use(express.static(require('path').join(__dirname, '..', '/public')));
app.use(express.static(require('path').join(__dirname, '..', '/source')));
app.use(express.static(require('path').resolve(__dirname, '..', 'node_modules')));
app.use(body.json());



const port = 8001

// Создаём HTTP-сервер
app.get('/', (req, res) => {
  // Устанавливаем HTTP-заголовок ответа с HTTP статусом и Content type
  res.sendFile(require('path').join(__dirname, '..', '/source/index.html'))
});





// Выводим лог как только сервер будет запущен
app.listen(port, () => {

});
console.log("Server start");