(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['signUpForm.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<form class=\"signupForm\">\r\n    <p>Регистрация</p>\r\n    <div><span></span></div>\r\n    <input type=\"text\" placeholder=\"Имя пользователя\" name=\"text\">\r\n    <div><span></span></div>\r\n    <input type=\"text\" placeholder=\"Логин\" name=\"text\">\r\n    <div><span></span></div>\r\n    <input type=\"password\" placeholder=\"Пароль\" name=\"password\">\r\n    <div><span></span></div>\r\n    <input type=\"password\" placeholder=\"Пароль\" name=\"password\">\r\n    <a href=\"/signin\">Уже есть аккаунт? Войти</a>\r\n    <button type=\"submit\" class=\"btn\">Создать аккаунт</button> \r\n</form>";
},"useData":true});
})();