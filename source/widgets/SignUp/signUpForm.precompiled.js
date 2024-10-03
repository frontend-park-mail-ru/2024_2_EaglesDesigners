(function () {
  var template = Handlebars.template,
    templates = (Handlebars.templates = Handlebars.templates || {});
  templates["signUpForm.hbs"] = template({
    compiler: [8, ">= 4.3.0"],
    main: function (container, depth0, helpers, partials, data) {
      return '<div id="left" class="left"></div>\n<div id="right" class="right">\n  <form class="signupForm">\n    <p>Зарегистрируйтесь в Patefon</p>\n    <div class="errorDiv"><span id="errorNickname"></span></div>\n    <input\n      id="nickname"\n      class="nickname not_error"\n      type="text"\n      placeholder="Имя пользователя"\n      name="text"\n    />\n    <div class="errorDiv"><span id="errorLogin"></span></div>\n    <input\n      id="login"\n      class="login not_error"\n      type="text"\n      placeholder="Логин"\n      name="text"\n    />\n    <div class="errorDiv"><span id="errorPassword"></span></div>\n    <div style="position: relative;">\n      <input\n        id="password"\n        class="password not_error"\n        type="password"\n        placeholder="Пароль"\n        name="password"\n      />\n      <img id="password-visibility-toggle" style="width: 20px; height: 20px;position: absolute; right: 30px; top: 50%;transform: translateY(-50%);" src="/assets/image/eye.svg">\n    </div>\n    <div class="errorDiv"><span id="errorPassword2"></span></div>\n    <input\n      id="password2"\n      class="password2 not_error"\n      type="password"\n      placeholder="Повторите пароль"\n      name="password"\n    />\n    <a href="/login">Уже есть аккаунт? Войти</a>\n    <button type="submit" class="btn signupForm__button">Создать аккаунт</button>\n  </form>\n</div>';
    },
    useData: true,
  });
})();
