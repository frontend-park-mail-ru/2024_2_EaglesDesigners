(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['signUpForm.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"left\" class=\"left\"></div>\n<div id=\"right\" class=\"right\">\n    <form class=\"signupForm\">\n        <p>Зарегистрируйтесь в Patefon</p>\n        <div class=\"errorDiv\"><span id=\"errorNickname\"></span></div>\n        <input id=\"nickname\" class=\"nickname not_error\" type=\"text\" placeholder=\"Имя пользователя\" name=\"text\">\n        <div class=\"errorDiv\"><span id=\"errorLogin\"></span></div>\n        <input id=\"login\" class=\"login not_error\" type=\"text\" placeholder=\"Логин\" name=\"text\">\n        <div class=\"errorDiv\"><span id=\"errorPassword\"></span></div>\n        <input id=\"password\" class=\"password not_error\" type=\"password\" placeholder=\"Пароль\" name=\"password\">\n        <div class=\"errorDiv\"><span id=\"errorPassword2\"></span></div>\n        <input id=\"password2\" class=\"password2 not_error\" type=\"password\" placeholder=\"Повторите пароль\" name=\"password\">\n        <a href=\"/login\">Уже есть аккаунт? Войти</a>\n        <button type=\"submit\" class=\"btn signupForm__button\">Создать аккаунт</button> \n    </form>\n</div>";

},"useData":true});
})();