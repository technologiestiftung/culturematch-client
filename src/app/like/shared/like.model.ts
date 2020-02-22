import { EventModel } from 'src/app/event/shared/event.model';
import { LocationModel } from 'src/app/location/shared/location.model';

export interface LikeSource {
  id: string,
  userId: string,
  entityId: string,
  type: string,
  createdAt: string,
  updatedAt: string,
}

export class LikeModel {
  public id: string;
  public userId: string;
  public entityId: string;
  public entity?: LocationModel | EventModel;
  public type: string;
  public isSkeleton: boolean;
  public createdAt: string;
  public updatedAt: string;

  constructor (source: LikeSource) {
    this.id = source.id;
    this.userId = source.userId;
    this.entityId = source.entityId;
    this.type = source.type;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}

export const LIKE_DUMMY_DATA: LikeModel[] = [
  {
    id: '',
    userId: '',
    entityId: '',
    isSkeleton: true,
    type: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '',
    userId: '',
    entityId: '',
    isSkeleton: true,
    type: '',
    createdAt: '',
    updatedAt: '',
  }, {
    id: '',
    userId: '',
    entityId: '',
    isSkeleton: true,
    type: '',
    createdAt: '',
    updatedAt: '',
  }, {
    id: '',
    userId: '',
    entityId: '',
    isSkeleton: true,
    type: '',
    createdAt: '',
    updatedAt: '',
  }, {
    id: '',
    userId: '',
    entityId: '',
    isSkeleton: true,
    type: '',
    createdAt: '',
    updatedAt: '',
  }, {
    id: '',
    userId: '',
    entityId: '',
    isSkeleton: true,
    type: '',
    createdAt: '',
    updatedAt: '',
  },
];