export interface EventCategorySource {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
}

export class EventCategoryModel {
  public id: string;
  public title: string;
  public createdAt: string;
  public updatedAt: string;

  constructor (source: EventCategorySource) {
    this.id = source.id;
    this.title = source.title;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
