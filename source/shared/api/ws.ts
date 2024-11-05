import { localHost, serverHost } from "@/app/config";

class wsConnection {
  handlers: ((payload: any) => Promise<void>)[];
  status;
  ws: WebSocket | null;
  url;
  constructor(url: string) {
    this.handlers = [];
    this.status = false;
    this.ws = null;
    this.url = url;
  }

  start() {
    if (this.status) {
      console.log("WebSocket уже открыт");
      return;
    }

    this.ws = new WebSocket(this.url + "/chat/startwebsocket");

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const res = JSON.parse(event.data);

        if (res.messageType === "error") {
          console.log("Ошибка на стороне сервера:", res.payload);
          return;
        }

        for (const handler of this.handlers) {
          handler(res.payload);
        }
      } catch (error) {
        console.log("Ошибка парсинга JSON:", error);
      }
    };

    this.ws.onopen = () => {
      this.status = true;
      console.log("WebSocket подключен");
    };

    this.ws.onclose = () => {
      this.status = false;
      console.log("WebSocket отключен");
    };

    this.ws.onerror = (error: Event) => {
      console.error("WebSocket ошибка:", error);
    };
  }

  close() {
    if (!this.ws) {
      return;
    }
    this.ws.close();
    this.status = false;
    this.handlers = [];
    this.ws = null;

    console.log("WebSocket начал процесс отключения");
  }

  subscribe(handler: (payload: any) => Promise<void>) {
    this.handlers.push(handler);
  }

  unsubscribe(handler: (payload: any) => Promise<void>) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }
}

export const wsConn = new wsConnection(localHost);
