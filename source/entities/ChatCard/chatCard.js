export class ChatCard {
    /**
     * Render ChatList widget
     * @function render
     * @async
     */
    async render(chat) {
      
  
      const template = Handlebars.templates.ChatList;
      console.log(template({ chat }));
    }
  }