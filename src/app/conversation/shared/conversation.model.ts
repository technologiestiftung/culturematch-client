import { AdSource, AdModel } from 'src/app/ad/shared/ad.model';
import { MessageSource, MessageModel } from 'src/app/conversation/shared/message.model';
import { UserModel, UserSource } from 'src/app/user/shared/user.model';

export interface ConversationSource {
  id: string,
  adId: string,
  ownerId: string,
  prospectId: string,
  lastMessageAt: string,
  lastMessageId: string,
  lastMessage?: MessageSource,
  ad?: AdSource,
  prospect: UserSource,
  owner: UserSource,
  createdAt: string,
  updatedAt: string,
}

export class ConversationModel {
  public id: string;
  public adId: string;
  public ownerId: string;
  public prospectId: string;
  public lastMessageAt: string;
  public lastMessageId: string;
  public lastMessage: MessageModel;
  public ad: AdModel;
  public counterpart: UserModel;
  public createdAt: string;
  public updatedAt: string;

  constructor (source: ConversationSource, currentUserId = null) {
    this.id = source.id;
    this.adId = source.adId;
    this.ownerId = source.ownerId;
    this.prospectId = source.prospectId;
    this.lastMessageAt = source.lastMessageAt;
    this.lastMessageId = source.lastMessageId;
    this.lastMessage = source.lastMessage ? new MessageModel(source.lastMessage) : null;
    this.ad = source.ad ? new AdModel(source.ad) : null;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;

    if (currentUserId) {
      this.counterpart = this.ownerId === currentUserId ? new UserModel(source.prospect) : new UserModel(source.owner);
    }
  }
}
