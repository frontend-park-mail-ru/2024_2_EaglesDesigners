(function () {
  var template = Handlebars.template,
    templates = (Handlebars.templates = Handlebars.templates || {});
  templates["loginForm.hbs"] = template({
    compiler: [8, ">= 4.3.0"],
    main: function (container, depth0, helpers, partials, data) {
      return '<div id="left" class="left"></div>\n<div id="right" class="right">\n  <form class="LoginForm" method="post">\n    <p>Войдите в Patefon</p>\n    <div class="errorDiv">\n      <span class="errorLogin" id="errorLogin"></span>\n    </div>\n    <input\n      id="login"\n      class="login not_error"\n      type="text"\n      placeholder="Логин"\n      name="text"\n    />\n    <div class="errorDiv">\n      <span class="errorPassword" id="errorPassword"></span>\n    </div>\n    <div style="position: relative;">\n      <input\n        id="password"\n        class="password not_error"\n        type="password"\n        placeholder="Пароль"\n        name="password"\n      />\n      <img id="password-visibility-toggle" style="width: 20px; height: 20px;position: absolute; right: 20px; top: 50%;transform: translateY(-50%);" src="/assets/image/eye.svg">\n    </div>\n    <button class="btn Enter" type="submit" id="Enter">Войти</button>\n\n  </form>\n  <button class="btn Create" type="submit" id="Create">Создать аккаунт</button>\n</div>';
    },
    useData: true,
  });
})();
