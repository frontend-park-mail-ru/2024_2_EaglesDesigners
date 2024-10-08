(function () {
  var template = Handlebars.template,
    templates = (Handlebars.templates = Handlebars.templates || {});
  templates["MainPage"] = template({
    compiler: [8, ">= 4.3.0"],
    main: function (container, depth0, helpers, partials, data) {
      return '<body>\n  <div id="root">\n    <div class="main-container">\n      <div class="sidebar-container">\n        <div class="logo-container">\n          <img src="/assets/image/Patefon.svg" />\n\n        </div>\n        <div class="buttons-container">\n          <button type="button" class="exit-btn">\n            <div class="exit-btn-svg-container">\n              <img src="/assets/image/IconLogout.svg" />\n\n            </div>\n          </button>\n        </div>\n\n      </div>\n\n      <div id="chat-list-import">\n\n      </div>\n\n      <div class="chat-window">\n        <div class="chat-container">\n          <div class="chat-box">\n            <div class="chat-feed">\n              <p class="placeholder-text">\n                Пока здесь ничего нет\n              </p>\n            </div>\n            <div class="input-row">\n\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class="chat-info-container">\n\n      </div>\n    </div>\n  </div>\n\n  <script type="module" src="MainPage.js"></script>\n</body>';
    },
    useData: true,
  });
})();
