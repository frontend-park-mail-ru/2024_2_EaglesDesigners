(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['ChatList'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

      return (
        '          <div class="chat-card">\n            <img class="chat-card-img" src="' +
        alias2(
          alias1(
            depth0 != null ? lookupProperty(depth0, "avatarURL") : depth0,
            depth0,
          ),
        ) +
        '" />\n\n            <div class="chat-card-upper-row">\n              <div class="main-text-container">\n                <span class="chat-name">\n                  ' +
        alias2(
          alias1(
            depth0 != null ? lookupProperty(depth0, "chatName") : depth0,
            depth0,
          ),
        ) +
        '\n                </span>\n              </div>\n              <div class="side-text-container">\n                <span class="last-message-date">\n                  Sep 30\n                </span>\n              </div>\n            </div>\n            <div class="chat-card-lower-row">\n              <div class="main-text-container-lower">\n                <span class="last-messanger-name">\n                  ' +
        alias2(
          alias1(
            depth0 != null ? lookupProperty(depth0, "chatName") : depth0,
            depth0,
          ),
        ) +
        '\n                </span>\n                <span class="split-column">:&nbsp;</span>\n                <span class="last-message">\n                  ' +
        alias2(
          alias1(
            depth0 != null ? lookupProperty(depth0, "lastMessage") : depth0,
            depth0,
          ),
        ) +
        '\n                </span>\n\n              </div>\n              <div class="side-text-container-lower">\n                <span class="last-message-date">\n                </span>\n              </div>\n\n            </div>\n          </div>\n'
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (container, depth0, helpers, partials, data) {
      var stack1,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        '<div class="chat-list-container">\n\n  <div class="chat-list-box">\n    <div class="search-box">\n      <div class="input-field">\n\n      </div>\n    </div>\n\n    <div class="chat-list">\n      <a class="chat-card-href" href=' +
        container.escapeExpression(
          container.lambda(
            depth0 != null ? lookupProperty(depth0, "chatId") : depth0,
            depth0,
          ),
        ) +
        ">\n" +
        ((stack1 = lookupProperty(helpers, "each").call(
          depth0 != null ? depth0 : container.nullContext || {},
          depth0 != null ? lookupProperty(depth0, "chats") : depth0,
          {
            name: "each",
            hash: {},
            fn: container.program(1, data, 0),
            inverse: container.noop,
            data: data,
            loc: {
              start: { line: 12, column: 8 },
              end: { line: 46, column: 17 },
            },
          },
        )) != null
          ? stack1
          : "") +
        "\n      </a>\n    </div>\n  </div>\n</div>"
      );
    },
    useData: true,
  });
})();
