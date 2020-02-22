import { UserSource, UserModel } from 'src/app/user/shared/user.model';

export interface AdSource {
  id: string,
  description: string,
  eventId: string,
  eventTitle: string,
  userId: string,
  user: UserSource,
  createdAt: string,
  updatedAt: string,
}

export class AdModel {
  public id: string;
  public description: string;
  public eventId: string;
  public eventTitle: string;
  public userId: string;
  public user: UserModel;
  public createdAt: string;
  public updatedAt: string;

  constructor (source: AdSource) {
    this.id = source.id;
    this.description = source.description;
    this.eventId = source.eventId;
    this.eventTitle = source.eventTitle;
    this.userId = source.userId;
    this.user = source.user ? new UserModel(source.user) : null;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
