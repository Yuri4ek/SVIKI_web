import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "./api-url";
import { authService } from "./authService";
import { api } from "./axiosClient";

const BASE_URL = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;
const HUB_URL = BASE_URL + "/chathub";

export interface AttachmentModel {
  id: number;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  url: string;
}

export interface MessageModel {
  id: number;
  content?: string;
  senderId: number;
  receiverId: number;
  sentAt: string;
  isRead: boolean;
  attachment?: AttachmentModel;
  isMy?: boolean;
  senderName?: string;
}

export interface ChatContact {
  receiverId: number;
  name: string;
  dialogId: number;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
  avatar?: string;
  role: "Client" | "Agent" | "Lawyer" | "Admin" | "Manager";
}

export interface ChatModel {
  dialogId: number;
  receiverId: number;
  receiverName: string;
  messages: MessageModel[];
}

class SignalRService {
  private connection: HubConnection | null = null;
  private messageCallbacks: ((message: MessageModel) => void)[] = [];

  public async startConnection() {
    if (this.connection && this.connection.state === "Connected") return;

    const accessTokenFactory = async () => {
      // Web: localStorage
      let token = localStorage.getItem("token");
      if (!token) return "";

      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000 + 10) {
          const newToken = await authService.refreshToken();
          token = newToken || "";
        }
      } catch {
        return "";
      }
      return token;
    };

    this.connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on("ReceiveMessage", (message: any) => {
      // ... (логика маппинга остается прежней)
      const rawAttachment = message.attachment || message.Attachment;
      const mapped: MessageModel = {
        id: message.id || message.Id,
        content: message.content || message.Content,
        senderId: message.senderId || message.SenderId,
        receiverId: message.receiverId || message.ReceiverId,
        sentAt: message.sentAt || message.SentAt,
        isRead: false,
        isMy: false,
        senderName: message.senderName || message.SenderName,
        attachment: rawAttachment
          ? {
              id: rawAttachment.id || rawAttachment.Id,
              originalFileName:
                rawAttachment.originalFileName ||
                rawAttachment.OriginalFileName,
              contentType:
                rawAttachment.contentType || rawAttachment.ContentType,
              fileSize: rawAttachment.fileSize || rawAttachment.FileSize,
              url: rawAttachment.url || rawAttachment.Url,
            }
          : undefined,
      };
      this.messageCallbacks.forEach((cb) => cb(mapped));
    });

    try {
      await this.connection.start();
    } catch (err) {
      console.error("SignalR Connection Error:", err);
    }
  }

  public onMessageReceived(cb: (msg: MessageModel) => void) {
    this.messageCallbacks.push(cb);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter((c) => c !== cb);
    };
  }
}

export const signalRService = new SignalRService();

export const chatService = {
  getContacts: async () => {
    const endpoint = "";
    const response = await api.get(endpoint);
    return response.data;
  },

  getChatHistory: async (receiverId: number) => {
    const response = await api.get<ChatModel>(
      `/chat/user-chat-message/${receiverId}`,
    );
    return response.data;
  },

  sendMessage: async (
    receiverId: number,
    content?: string,
    file?: File | Blob,
    dialogId?: number,
  ) => {
    if (!dialogId) {
      try {
        const chat = await chatService.getChatHistory(receiverId);
        dialogId = chat?.dialogId;
      } catch (e) {
        console.log("Проблема с отправкой сообщения", e);
      }
    }

    const formData = new FormData();
    formData.append("ReceiverId", String(receiverId));
    formData.append("Content", content || "");
    if (dialogId) formData.append("DialogId", String(dialogId));

    if (file) {
      let finalFile = file;
      if (file instanceof File && file.name.endsWith(".m4a")) {
        finalFile = new File([file], file.name.replace(".m4a", ".webm"), {
          type: "audio/webm",
        });
      }
      formData.append("File", finalFile);
    }

    const response = await api.post(`/chat/send`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data as MessageModel;
  },
};
