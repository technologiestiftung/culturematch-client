export interface MessageSource {
  id: string,
  conversationId: string,
  senderId: string,
  content: string,
  createdAt: string,
  updatedAt: string,
}

export class MessageModel {
  public id: string;
  public conversationId: string;
  public senderId: string;
  public content: string;
  public createdAt: string;
  public updatedAt: string;

  constructor (source: MessageSource) {
    this.id = source.id;
    this.conversationId = source.conversationId;
    this.senderId = source.senderId;
    this.content = source.content;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
