import { websocketHost } from "@/app/config";
import { TMessageWS } from "./types";

type THandler = (payload: TMessageWS) => Promise<void>;

class wsConnection {
  handlers: Record<string, THandler[]>;
  status;
  ws: WebSocket | null;
  url;
  constructor(url: string) {
    this.handlers = {};
    this.status = false;
    this.ws = null;
    this.url = url;
  }

  start() {
    if (this.status) {
      return;
    }

    this.ws = new WebSocket(this.url + "/startwebsocket");

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const res = JSON.parse(event.data);
        
        if (res.messageType === "error") {
          return;
        }

        const handlersForType = this.handlers[res.action] || [];
        for (const handler of handlersForType) {
          handler(res.payload);
        }
      } catch (error) {
        console.log("Ошибка обработки сообщения Websocket:", error);
      }
    };

    this.ws.onopen = () => {
      this.status = true;
    };

    this.ws.onclose = () => {
      this.status = false;
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
    this.handlers = {};
    this.ws = null;

  }

  subscribe(messageType: string, handler: THandler) {
    if (!this.handlers[messageType]) {
      this.handlers[messageType] = [];
    }
    this.handlers[messageType].push(handler);
  }

  unsubscribe(messageType: string, handler: THandler) {
    if (!this.handlers[messageType]) return;
    this.handlers[messageType] = this.handlers[messageType].filter(
      (h) => h !== handler,
    );
  }
}

export const wsConn = new wsConnection(websocketHost);
