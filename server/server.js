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

app.post('/signup', (req, res) => {
    console.log('я тут')
    const password = req.body.password;
    const email = req.body.login;
    const nickname = req.body.nickname;
    console.log(password, email, nickname)
    return res.status(200).json({ message: 'Окей' });
    
    
})





// Выводим лог как только сервер будет запущен
app.listen(port, () => {

});
console.log("Server start");