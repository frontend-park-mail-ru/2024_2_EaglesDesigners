import { json } from "body-parser";

import express, { static } from "express";

let app = express();

app.use(static(require("path").join(__dirname, "..", "/dist")));
app.use(static(require("path").join(__dirname, "..", "/public")));
app.use(static(require("path").join(__dirname, "..", "/source")));
app.use(static(require("path").resolve(__dirname, "..", "node_modules")));
app.use(json());

const port = 80;

// Создаём HTTP-сервер
app.get("*", (req, res) => {
  // Устанавливаем HTTP-заголовок ответа с HTTP статусом и Content type
  res.sendFile(require("path").join(__dirname, "..", "/dist/index.html"));
});

// Выводим лог как только сервер будет запущен
app.listen(port, () => {});
console.log("Server start");
