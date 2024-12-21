import { API } from "@/shared/api/api";
import ChatTemplate from "./Chat.handlebars";
import "./Chat.scss";
import {
  ChatResponse,
  ProfileResponse,
  searchMessagesResponse,
  StickerPacksResponse,
  StickersResponse,
} from "@/shared/api/types";
import { ChatMessage, TChatMessage } from "@/entities/ChatMessage";
import { TChat } from "@/entities/Chat";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { getChatLabel } from "@/shared/helpers/getChatLabel";
import { ChatInfo } from "@/widgets/ChatInfo";
import { GroupChatInfo } from "@/widgets/GroupChatInfo";
import { serverHost } from "@/app/config";
import { UserType } from "@/widgets/AddChannelForm/lib/types";
import { debounce } from "@/shared/helpers/debounce";
import { SearchedMessageCard } from "@/entities/SearchedMessageCard/ui/SearchedMessageCard";
import { ChatList } from "@/widgets/ChatList";
import { Router } from "@/shared/Router/Router";
import { AttachmentCard } from "@/entities/AttachmentCard";
import { SendMessage } from "../api/SendMessage";
import { SendSticker } from "../api/SendSticker";

export class Chat {
  #parent;
  #chatInfo;
  #photos: File[];
  #files: File[];
  constructor(parent: Element, chatInfo: HTMLElement) {
    this.#parent = parent;
    this.#chatInfo = chatInfo;
    this.#photos = [];
    this.#files = [];
  }
  /**
   * Render ChatList widget
   * @function render
   * @async
   */
  async render(chat: TChat) {
    this.#chatInfo.innerHTML = "";

    if (ChatStorage.getChat().chatId) {
      const currentChat = document.querySelector(`[id='${ChatStorage.getChat().chatId}']`)!;
      if (currentChat) {
        currentChat.classList.remove('active');
      }
    }

    ChatStorage.setChat(chat);
    ChatStorage.setCurrentBranchId("");
    const avatar = chat.avatarPath
        ? serverHost + chat.avatarPath
        : "/assets/image/default-avatar.svg";

    const responseInfo = await API.get<ChatResponse>(`/chat/${chat.chatId}`);
    const userType : UserType = {owner: false, user: false, admin: false, not_in_chat: false};
    if (responseInfo.role === "owner") {
      userType.owner = true;
    } else if (responseInfo.role === "admin") {
      userType.admin = true;
    } else if (responseInfo.role === "none") {
      userType.user = true;
    } else{
      userType.not_in_chat = true;
    }
    const chatType = {channel: false, group: false, personal: false};
    if (chat.chatType == "group") {
      chatType.group = true;
    } else if (chat.chatType === "channel"){
      chatType.channel = true;
    } else{
      chatType.personal = true;
    }
    this.#parent.innerHTML = ChatTemplate({
      chat: {
        ...chat,
        chatType: getChatLabel(chat.chatType),
      },
      avatar,
      userType,
      chatType
    });

    const attachFilePopup = this.#parent.querySelector<HTMLElement>('#attachPopUp')!;
      if (attachFilePopup) {
        const emojiCarousel = this.#parent.querySelector<HTMLElement>('#emojiCarousel')!;
        const emojiPopup = this.#parent.querySelector<HTMLElement>('#emojiPopup')!;
        const emojiTabBtn = this.#parent.querySelector<HTMLElement>('#emojiTabBtn')!;
        const stickersTabBtn = this.#parent.querySelector<HTMLElement>('#stickersTabBtn')!;
    
        emojiTabBtn.addEventListener("click", () => {
          emojiCarousel.style.transform = `translateX(0%)`;
        })
        stickersTabBtn.addEventListener("click", () => {
          emojiCarousel.style.transform = `translateX(-100%)`;
        })
    
        const emojiList = this.#parent.querySelector<HTMLElement>('.emoji-list')!;
        
        this.#parent.querySelector('#emojiBtn')!.addEventListener("click", (event) => {
          event.stopPropagation();
          emojiPopup.style.display = emojiPopup.style.display === "none" ? "flex" : "none";
        });
    
        document.addEventListener("click", () => {
          if (emojiPopup.style.display !== "none") {
            emojiPopup.style.display = "none";
          }
        });
        emojiPopup.addEventListener("click", (event) => {
          event.stopPropagation();
        });
    
        const emojiString = [..."⌚⌛⌨⏏⏩⏪⏫⏬⏭⏮⏰⏱⏲⏳⏸⏹⏺Ⓜ▪▶◀◼◽◾☀☁☂☃☄☎☑☔☕☘☝☠☢☣☦☪☮☯☸☹☺♀♂♈♉♊♋♌♍♎♏♐♑♒♓♟♠♣♥♦♨♻♾♿⚒⚓⚔⚕⚖⚗⚙⚛⚜⚠⚡⚧⚪⚫⚰⚱⚽⚾⛄⛅⛈⛎⛏⛑⛔⛩⛪⛱⛲⛳⛴⛵⛷⛸⛹⛺⛽✂✅✈✊✋✌✍✏✒✔✖✝✡✨✳✴❄❇❌❎❓❔❕❗❣❤➕➖➗➡➰➿⤴⤵⬅⬆⬇⬛⭐⭕〰〽㊗㊙️🀄🃏🅰🅱🅾🅿🆎🆑🆒🆓🆔🆕🆖🆗🆘🆙🆚🇦🇧🇨🇩🇪🇫🇬🇭🇮🇯🇰🇱🇲🇳🇴🇵🇶🇷🇸🇹🇺🇻🇼🇽🇾🇿🈁🈂🈚🈯🈲🈳🈴🈵🈶🈷🈸🈹🈺🉐🉑🌀🌁🌂🌃🌄🌅🌆🌇🌈🌉🌊🌋🌌🌍🌎🌏🌐🌑🌒🌓🌔🌕🌖🌗🌘🌙🌚🌛🌜🌝🌞🌟🌠🌤🌥🌦🌧🌨🌩🌪🌫🌬🌭🌮🌯🌰🌱🌲🌳🌴🌵🌶🌷🌸🌹🌺🌻🌼🌽🌾🌿🍀🍁🍂🍃🍄🍅🍆🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑🍒🍓🍔🍕🍖🍗🍘🍙🍚🍛🍜🍝🍞🍟🍠🍡🍢🍣🍤🍥🍦🍧🍨🍩🍪🍫🍬🍭🍮🍯🍰🍱🍲🍳🍴🍵🍶🍷🍸🍹🍺🍻🍼🍽🍾🍿🎀🎁🎂🎃🎄🎅🎆🎇🎈🎉🎊🎋🎌🎍🎎🎏🎐🎑🎒🎓🎖🎗🎙🎚🎛🎞🎟🎠🎡🎢🎣🎤🎥🎦🎧🎨🎩🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏳🏴🏵🏷🏸🏹🏺🏻🏼🏽🏾🏿🐀🐁🐂🐃🐄🐅🐆🐇🐈🐉🐊🐋🐌🐍🐎🐏🐐🐑🐒🐓🐔🐕🐖🐗🐘🐙🐚🐛🐜🐝🐞🐟🐠🐡🐢🐣🐤🐥🐦🐧🐨🐩🐪🐫🐬🐭🐮🐯🐰🐱🐲🐳🐴🐵🐶🐷🐸🐹🐺🐻🐼🐽🐾🐿👀👁👂👃👄👅👆👇👈👉👊👋👌👍👎👏👐👑👒👓👔👕👖👗👘👙👚👛👜👝👞👟👠👡👢👣👤👥👦👧👨👩👪👫👬👭👮👯👰👱👲👳👴👵👶👷👸👹👺👻👼👽👾👿💀💁💂💃💄💅💆💇💈💉💊💋💌💍💎💏💐💑💒💓💔💕💖💗💘💙💚💛💜💝💞💟💠💡💢💣💤💥💦💧💨💩💪💫💬💭💮💯💰💱💲💳💴💵💶💷💸💹💺💻💼💽💾💿📀📁📂📃📄📅📆📇📈📉📊📋📌📍📎📏📐📑📒📓📔📕📖📗📘📙📚📛📜📝📞📟📠📡📢📣📤📥📦📧📨📩📪📫📬📭📮📯📰📱📲📳📴📵📶📷📸📹📺📻📼📽📿🔀🔁🔂🔃🔄🔅🔆🔇🔈🔉🔊🔋🔌🔍🔎🔏🔐🔑🔒🔓🔔🔕🔖🔗🔘🔙🔚🔛🔜🔝🔞🔟🔠🔡🔢🔣🔤🔥🔦🔧🔨🔩🔪🔫🔬🔭🔮🔯🔰🔱🔲🔳🔴🔵🔶🔷🔸🔹🔺🔻🔼🔽🕉🕊🕋🕌🕍🕎🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦🕧🕯🕰🕳🕴🕵🕶🕷🕸🕹🕺🖇🖊🖋🖌🖍🖐🖕🖖🖤🖥🖨🖱🖲🖼🗂🗃🗄🗑🗒🗓🗜🗝🗡🗣🗨🗯🗳🗺🗻🗼🗽🗾🗿😀😁😂😃😄😅😆😇😈😉😊😋😌😍😎😏😐😑😒😓😔😕😖😗😘😙😚😛😜😝😞😟😠😡😢😣😤😥😦😧😨😩😪😫😬😭😮😯😰😱😲😳😴😵😶😷😸😹😺😻😼😽😾😿🙀🙁🙂🙃🙄🙅🙆🙇🙈🙉🙊🙋🙌🙍🙎🙏🚀🚁🚂🚃🚄🚅🚆🚇🚈🚉🚊🚋🚌🚍🚎🚏🚐🚑🚒🚓🚔🚕🚖🚗🚘🚙🚚🚛🚜🚝🚞🚟🚠🚡🚢🚣🚤🚥🚦🚧🚨🚩🚪🚫🚬🚭🚮🚯🚰🚱🚲🚳🚴🚵🚶🚷🚸🚹🚺🚻🚼🚽🚾🚿🛀🛁🛂🛃🛄🛅🛋🛌🛍🛎🛏🛐🛑🛒🛕🛠🛡🛢🛣🛤🛥🛩🛫🛬🛰🛳🛴🛵🛶🛷🛸🛹🛺🛼🟠🟡🟢🟣🟤🟥🟦🟧🟨🟩🟪🟫🤍🤎🤏🤐🤑🤒🤓🤔🤕🤖🤗🤘🤙🤚🤛🤜🤝🤞🤟🤠🤡🤢🤣🤤🤥🤦🤧🤨🤩🤪🤫🤬🤭🤮🤯🤰🤱🤲🤳🤴🤵🤶🤷🤸🤹🤺🤼🤽🤾🤿🥀🥁🥂🥃🥄🥅🥇🥈🥉🥊🥋🥌🥍🥎🥏🥐🥑🥒🥓🥔🥕🥖🥗🥘🥙🥚🥛🥜🥝🥞🥟🥠🥡🥢🥣🥤🥥🥦🥧🥨🥩🥪🥫🥬🥭🥮🥯🥰🥱🥳🥴🥵🥶🥺🥻🥼🥽🥾🥿🦀🦁🦂🦃🦄🦅🦆🦇🦈🦉🦊🦋🦌🦍🦎🦏🦐🦑🦒🦓🦔🦕🦖🦗🦘🦙🦚🦛🦜🦝🦞🦟🦠🦡🦢🦥🦦🦧🦨🦩🦪🦫🦮🦯🦰🦱🦲🦳🦴🦵🦶🦷🦸🦹🦺🦻🦼🦽🦾🦿🧀🧁🧂🧃🧄🧅🧆🧇🧈🧉🧊🧋🧍🧎🧏🧐🧑🧒🧓🧔🧕🧖🧗🧘🧙🧚🧛🧜🧝🧞🧟🧠🧡🧢🧣🧤🧥🧦🧧🧨🧩🧪🧫🧬🧭🧮🧯🧰🧱🧲🧳🧴🧵🧶🧷🧸🧹🧺🧻🧼🧽🧾🧿🩰🩱🩲🩳🩴🩸🩹🩺🪀🪁🪂🪐🪑🪒🪓🪔🪕"];
        emojiString.map((emoji) => {
          emojiList.insertAdjacentHTML("beforeend", `<div class="emoji-list__item">${emoji}</div>`);
          emojiList.lastElementChild?.addEventListener('click', () => {
            textArea.value = textArea.value + emoji;
          })
        })
    
        const stickersList = this.#parent.querySelector<HTMLElement>('#stickers-list')!;
        const packsList = this.#parent.querySelector<HTMLElement>('#packs-list')!;
    
        const response = await API.get<StickerPacksResponse>('/stickerpacks');
        const packs = response.packs;
        packs.map((pack) => {
          packsList.insertAdjacentHTML("beforeend", `<img class="sticker-list__packs__item" src="${serverHost}${pack.photo}" alt=""/>`);
          packsList.lastElementChild?.addEventListener('click', async () => {
            const response = await API.get<StickersResponse>(`/stickerpacks/${pack.id}`); 
            const stickers = response.stickers;
            stickersList.innerHTML = '';
            stickers.map((sticker) => {
              stickersList.insertAdjacentHTML("beforeend", `<img class="sticker-list__stickers__item" src="${serverHost}${sticker}" alt="">`);
              stickersList.lastElementChild?.addEventListener('click', () => {
                SendSticker(chat.chatId, sticker);
                emojiPopup.style.display = 'none';
              });
            });
          });
        });
      this.#parent.querySelector('#attachBtn')!.addEventListener("click", (event) => {
        event.stopPropagation();
        attachFilePopup.style.display = attachFilePopup.style.display === "none" ? "flex" : "none";
      });

      document.addEventListener("click", () => {
        if (attachFilePopup.style.display !== "none") {
          attachFilePopup.style.display = "none";
        }
      });

      const filesCarousel = this.#parent.querySelector<HTMLElement>('#filesWrapper')!;
      const filesContainer = document.querySelector<HTMLElement>('#filesContainer')!;

      const attachmentCard = new AttachmentCard(filesContainer);
      
      const photoInput = this.#parent.querySelector<HTMLInputElement>("#attach-photo")!;
      const handlePhotoAttachment = () => {
        if (photoInput.files) {
          const file = photoInput.files[0];
          if (file) {
            this.#photos.push(file);
            attachmentCard.renderPhoto(file);
            
            filesCarousel.style.display = 'block';
            updateButtonsVisibility();
          }
        }
      };
      photoInput.addEventListener("change", handlePhotoAttachment);

      const fileInput: HTMLInputElement = this.#parent.querySelector("#attach-file")!;
      const handleFileAttachment = () => {
        if (fileInput.files) {
          const file = fileInput.files[0];
          if (file) {
            this.#files.push(file);
            attachmentCard.renderFile(file);

            filesCarousel.style.display = 'block';
            updateButtonsVisibility();
          }
        }
      };
      fileInput.addEventListener("change", handleFileAttachment);

      const filesPrevBtn = document.querySelector<HTMLElement>('#inputPrevBtn')!;
      const filesNextBtn = document.querySelector<HTMLElement>('#inputNextBtn')!;
      const attachments = filesContainer!.children;

      let currentIndex = 0;
      const fileCardWidth = 100;
      const fileCardsGap = 10;

      const getVisibleCardsCount = () => {
        const containerWidth = filesContainer.parentElement!.clientWidth;
        return 1 + Math.floor((containerWidth - fileCardWidth)/(fileCardWidth + fileCardsGap));
      }

      const updateButtonsVisibility = () => {
        filesPrevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
        const visibleCardsCount = getVisibleCardsCount();
        filesNextBtn.style.display = attachments.length > visibleCardsCount && currentIndex !== attachments.length - 1 - attachments.length % visibleCardsCount ? 'block' : 'none';
      }

      const updateTransform = () => {
        const offset = currentIndex*(fileCardWidth + fileCardsGap);

        filesContainer.style.transform = `translateX(-${offset}px)`;
      }

      filesPrevBtn.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - getVisibleCardsCount(), 0);

        updateButtonsVisibility();
        updateTransform();
      });

      filesNextBtn.addEventListener('click', () => {
        const visibleCardsCount = getVisibleCardsCount();
        currentIndex = Math.min(currentIndex + visibleCardsCount, attachments.length - 1 - attachments.length % visibleCardsCount);
        
        updateButtonsVisibility();
        updateTransform();
      });
    }

    const chatCard : HTMLElement = document.querySelector(`[id='${chat.chatId}']`)!;
    if (chatCard) {
      chatCard.classList.add('active');
    }
    const subscribeButton : HTMLElement = this.#parent.querySelector("#subscribe-channel")!;
    const handleSubscribe = async () => {
      const responseSubscribe = await API.post(`/channel/${chat.chatId}/join`, {});
      
      if (!responseSubscribe.error) {
        subscribeButton.classList.add('hidden');
        Router.go(`/chat/${chat.chatId}`, false);
      }
    };
    if (chatType.channel && responseInfo.error) {

      if (subscribeButton) {
        subscribeButton.classList.remove('hidden');
        subscribeButton.addEventListener("click", handleSubscribe);
      }
      
    }

    const messagesImport : HTMLElement = this.#parent.querySelector("#chat__messages")!;
    const chatMessage = new ChatMessage(messagesImport);
    ChatStorage.setChatMessageInstance(chatMessage);

    
    const textArea : HTMLTextAreaElement = this.#parent.querySelector("#inputTextarea")!;
    if (textArea) {
      textArea.addEventListener("input", function () {
        this.style.height = "";
        this.style.height = this.scrollHeight + "px";
      });
    }
    

    const sendInputMessage = async (textArea : HTMLTextAreaElement, branch : boolean) => {
      const messageText = textArea.value.trim();
      textArea.value = "";

      if (messageText || this.#files.length || this.#photos.length) {
        
        if (textArea.classList.contains('edit')) {
          const messageId = textArea.classList[2]!;
          const initialMessageText = document.querySelector(`[id='${messageId}']`)!.querySelector("#message-text-content")!;
          if (messageText === initialMessageText.textContent?.trim()) {
            return;
          }
          const response = await API.put(
            `/messages/${messageId}`,
            {
              text: messageText,
            },
          );
          if (!response.error) {
            textArea.classList.remove('edit');
            textArea.classList.remove(messageId);
            const message = document.getElementById(messageId)!;
            const redactedMessage = message.querySelector("#redacted")!;
            const messageBody = message.querySelector("#message-text-content")!;
            messageBody.textContent = messageText;
            redactedMessage.classList.remove("hidden");
          
          }
          
          return;
        }
        if (!branch) {
          SendMessage( chat.chatId, messageText, this.#files, this.#photos);
        }else {
          SendMessage(ChatStorage.getCurrentBranchId(), messageText, this.#files, this.#photos);
        }
        this.#files = [];
        this.#photos = [];
        const filesCarousel = this.#parent.querySelector<HTMLElement>('#filesWrapper')!;
        const filesContainer = document.querySelector<HTMLElement>('#filesContainer')!;
        if(filesCarousel){
          filesCarousel.style.display = 'none';
          filesContainer.innerHTML = '';
        }
      }

      textArea.style.height = "";
    };

    const KeyPressHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (event.target instanceof HTMLTextAreaElement) {
          sendInputMessage(event.target, false);
        }
        
      }
    };

    if (textArea) {
      textArea.addEventListener("keypress", KeyPressHandler);
    }
    
    const handleSendChatMessage = () => {
      sendInputMessage(textArea, false);
    };

    if (document.querySelector("#chat__input-send-btn")!) {
        document
        .querySelector("#chat__input-send-btn")!
        .addEventListener("click", handleSendChatMessage);
    }
    

    const responseChat = await API.get<ChatResponse>(
      `/chat/${chat.chatId}`,
    );
    ChatStorage.setRole(responseChat.role ?? "");
    ChatStorage.setUsers(responseChat.users ?? []);

    const messages: TChatMessage[] = responseChat.messages ?? [];
    if (messages.length > 0) {
      chatMessage.renderMessages(messages);
    }

    const chatHeader = this.#parent.querySelector("#header-chat")!;

    const handleChatHeader = async () => {
      if (this.#chatInfo.innerHTML !== "") {
        this.#chatInfo.innerHTML = "";
      } else if (chat.chatType === "personal") {
        const chatInfo = new ChatInfo(this.#chatInfo, chat);
        chatInfo.render();
      } else if (chat.chatType === "group" || chat.chatType === "channel") {
        const chatInfo = new GroupChatInfo(this.#chatInfo, chat, userType);
        chatInfo.render();
      }
    };
    chatHeader.addEventListener("click", handleChatHeader);

    const searchMessagesButton : HTMLElement = this.#parent.querySelector("#search-messages")!;
    const messagesSearch : HTMLElement = this.#parent.querySelector("#message-search-input")!;
    const searchInput : HTMLInputElement = messagesSearch.querySelector("#input-search")!;
    const chatInfoHeader : HTMLElement = this.#parent.querySelector("#chat-info")!;
    const searchImageContainer : HTMLElement = this.#parent.querySelector("#search-messages")!;


    const handleSearchMessages = async (event : Event) => {
      event.stopPropagation();
      messagesSearch.classList.remove('hidden');
      chatInfoHeader.classList.add('hidden');
      searchImageContainer.classList.add('hidden');
      const messagesSearchResult : HTMLElement = this.#parent.querySelector('#search-results-messages')!;

      const messageText = searchInput.value;
      if (messageText !== "") {
        const response = await API.get<searchMessagesResponse>(`/chat/${chat.chatId}/messages/search?search_query=${messageText}`);
        messagesSearchResult.innerHTML = '';
        if (!response.error) {
          if (response.messages) {
            const searchMessages = new SearchedMessageCard(messagesSearchResult);
            response.messages.forEach(async (element) => {
              const profileUser = ChatStorage.getUsers();
              const profile = profileUser.find((elem) => {
                return element.authorID === elem.id;
              });
              if (profile) {
                searchMessages.render(element, profile.avatarURL, profile.name, messagesImport, chatMessage);
              }
              else {
                API.get<ProfileResponse>(`/profile/${element.authorID}`)
                  .then((res) => {
                    searchMessages.render(element, res.avatarURL, res.name, messagesImport, chatMessage);
                  });
              }
            });
          }
        }
      }
      else {
        messagesSearchResult.innerHTML = '';
      }
    };
    searchMessagesButton.addEventListener('click', handleSearchMessages);

    const debouncedHandler = debounce(handleSearchMessages, 250);
    searchInput.addEventListener("input", debouncedHandler);
    searchInput.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    const cancelSearchButton = this.#parent.querySelector("#cancel-search")!;
    const handleCancelSearch = (event : Event) => {
      event.stopPropagation();
      messagesSearch.classList.add("hidden");
      chatInfoHeader.classList.remove("hidden");
      searchImageContainer.classList.remove("hidden");
    };
    cancelSearchButton.addEventListener('click', handleCancelSearch);

    chatHeader.querySelector('#chat-back-button')?.addEventListener('click', (e) => {
      e.stopPropagation();

      history.pushState({ url: "/" }, "", "/");

      const chatListImport : HTMLElement = document.querySelector('#widget-import')!;
      const chatList = new ChatList(chatListImport,this);
      chatList.render();
    });

    document.querySelector<HTMLElement>('#widget-import')!.style.left = '-100vw'; 
    document.querySelector<HTMLElement>('#chat-info-container')!.style.right = '-100vw';
    
    const cancelBranchBtn = this.#parent.querySelector("#cancel-branch")!;

    const chatWidget : HTMLElement = this.#parent.querySelector("#chat")!;
    const branchWidget : HTMLElement = this.#parent.querySelector("#chat-branch")!;
    const handleCancelBranch = () => {
      chatWidget.classList.remove("hidden");
      branchWidget.classList.add("hidden");

      ChatStorage.getChatMessageInstance()?.setParent(chatWidget.querySelector('#chat__messages')!);
      ChatStorage.setCurrentBranchId('');
    };

    cancelBranchBtn.addEventListener("click", handleCancelBranch);


    const branchImageMessageSearch = document.getElementById("branch-search-messages")!;
    const branchChatInfo = document.getElementById("branch-chat-info")!;
    const branchSearchContainer : HTMLInputElement = this.#parent.querySelector("#branch-search-input")!;

    const inputBranchSearch : HTMLInputElement = this.#parent.querySelector("#branch-input-search")!;
    const handleSearchInBranch = async (event : Event) => {
      event.stopPropagation();
      branchSearchContainer.classList.remove('hidden');
      branchChatInfo.classList.add('hidden');
      branchImageMessageSearch.classList.add('hidden');
      const messagesSearchResult : HTMLElement = this.#parent.querySelector('#branch-search-results-messages')!;
      messagesSearchResult.innerHTML = '';
      

      const messageText = inputBranchSearch.value;
      if (messageText !== "") {
        const response = await API.get<searchMessagesResponse>(`/chat/${ChatStorage.getCurrentBranchId()}/messages/search?search_query=${messageText}`);
        messagesSearchResult.innerHTML = '';
        if (!response.error) {
          if (response.messages) {
            const searchMessages = new SearchedMessageCard(messagesSearchResult);
            response.messages.forEach(async (element) => {
              const profileUser = ChatStorage.getUsers();
              const profile = profileUser.find((elem) => {
                return element.authorID === elem.id;
              });
              if (profile) {
                searchMessages.render(element, profile.avatarURL, profile.name, messagesImport, chatMessage);
              }
              else {
                API.get<ProfileResponse>(`/profile/${element.authorID}`)
                  .then((res) => {
                    searchMessages.render(element, res.avatarURL, res.name, messagesImport, chatMessage);
                  });
              }
            });
          }
        }
      }
      else {
        messagesSearchResult.innerHTML = '';
      }
    };

    const branchSearchMessage = this.#parent.querySelector("#branch-search-messages")!;
    branchSearchMessage.addEventListener("click", handleSearchInBranch);
    const debouncedBranchHandler = debounce(handleSearchInBranch, 250);
    inputBranchSearch.addEventListener("input", debouncedBranchHandler);
    inputBranchSearch.addEventListener('click', (event) => {
      event.stopPropagation();
    });


    const cancelBranchSearch = document.getElementById("branch-cancel-search")!;
    const handleCancelBranchSearch = () => {
      branchSearchContainer.classList.add('hidden');
      branchChatInfo.classList.remove('hidden');
      branchImageMessageSearch.classList.remove('hidden');
    };
    cancelBranchSearch.addEventListener("click", handleCancelBranchSearch);

    const KeyPressBranchHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (event.target instanceof HTMLTextAreaElement) {
          sendInputMessage(event.target, true);
        }
        
      }
    };

    const branchTextArea : HTMLElement = this.#parent.querySelector("#branch-textarea")!;
    if (branchTextArea) {
      branchTextArea.addEventListener("input", function () {
        this.style.height = "";
        this.style.height = this.scrollHeight + "px";
      });
    }
    if (branchTextArea) {
      branchTextArea.addEventListener("keypress", KeyPressBranchHandler);
    }
  }
}