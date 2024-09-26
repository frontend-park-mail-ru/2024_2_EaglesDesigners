(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['signUpForm.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<form class=\"signupForm\">\n    <p>Регистрация</p>\n    <div><span></span></div>\n    <input type=\"text\" placeholder=\"Имя пользователя\" name=\"text\">\n    <div><span></span></div>\n    <input type=\"text\" placeholder=\"Логин\" name=\"text\">\n    <div><span></span></div>\n    <input type=\"password\" placeholder=\"Пароль\" name=\"password\">\n    <div><span></span></div>\n    <input type=\"password\" placeholder=\"Пароль\" name=\"password\">\n    <a href=\"/signin\">Уже есть аккаунт? Войти</a>\n    <button type=\"submit\" class=\"btn\">Создать аккаунт</button> \n</form>";
},"useData":true});
})();