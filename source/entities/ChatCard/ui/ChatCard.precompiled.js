(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['ChatCard'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a class=\"chat-card-href\" href="
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"chat") : depth0)) != null ? lookupProperty(stack1,"chatId") : stack1), depth0))
    + ">\n\n    <div class=\"chat-card\">\n    <img class=\"chat-card-img\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"chat") : depth0)) != null ? lookupProperty(stack1,"avatarURL") : stack1), depth0))
    + "\" />\n\n    <div class=\"chat-card-upper-row\">\n        <div class=\"main-text-container\">\n        <span class=\"chat-name\">\n            "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"chat") : depth0)) != null ? lookupProperty(stack1,"chatName") : stack1), depth0))
    + "\n        </span>\n        </div>\n        <div class=\"side-text-container\">\n        <span class=\"last-message-date\">\n            Окт 10\n        </span>\n        </div>\n    </div>\n    <div class=\"chat-card-lower-row\">\n        <div class=\"main-text-container-lower\">\n        <span class=\"last-messanger-name\">\n            "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"chat") : depth0)) != null ? lookupProperty(stack1,"chatName") : stack1), depth0))
    + "\n        </span>\n        <span class=\"split-column\">:&nbsp;</span>\n        <span class=\"last-message\">\n            "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"chat") : depth0)) != null ? lookupProperty(stack1,"lastMessage") : stack1), depth0))
    + "\n        </span>\n\n        </div>\n        <div class=\"side-text-container-lower\">\n        <span class=\"last-message-date\">\n        </span>\n        </div>\n\n    </div>\n    </div>\n</a>";
},"useData":true});
})();