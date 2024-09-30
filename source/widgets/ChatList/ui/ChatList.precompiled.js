(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['ChatList'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <a class=\"chat-card-href\" href="
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"chatId") : depth0), depth0))
    + ">\r\n        \r\n          <div class=\"chat-card\">\r\n            <img class=\"chat-card-img\" src=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"avatarURL") : depth0), depth0))
    + "\" />\r\n\r\n            <div class=\"chat-card-upper-row\">\r\n              <div class=\"main-text-container\">\r\n                <span class=\"chat-name\">\r\n                  "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"chatName") : depth0), depth0))
    + "\r\n                </span>\r\n              </div>\r\n              <div class=\"side-text-container\">\r\n                <span class=\"last-message-date\">\r\n                  Sep 30\r\n                </span>\r\n              </div>\r\n            </div>\r\n            <div class=\"chat-card-lower-row\">\r\n              <div class=\"main-text-container-lower\">\r\n                <span class=\"last-messanger-name\">\r\n                  "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"chatName") : depth0), depth0))
    + "\r\n                </span>\r\n                <span class=\"split-column\">:&nbsp;</span>\r\n                <span class=\"last-message\">\r\n                  "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"lastMessage") : depth0), depth0))
    + "\r\n                </span>\r\n\r\n              </div>\r\n              <div class=\"side-text-container-lower\">\r\n                <span class=\"last-message-date\">\r\n                </span>\r\n              </div>\r\n\r\n            </div>\r\n          </div>\r\n      </a>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "        <div class=\"empty-chat-list-notice-container\">\r\n          <p class=\"empty-chat-list-notice\">У вас нет чатов</p>\r\n        </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"chat-list-container\">\r\n\r\n  <div class=\"chat-list-box\">\r\n    <div class=\"search-box\">\r\n      <div class=\"input-field\">\r\n\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"chat-list\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"chats") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":11,"column":6},"end":{"line":52,"column":15}}})) != null ? stack1 : "")
    + "    </div>\r\n  </div>\r\n</div>";
},"useData":true});
})();