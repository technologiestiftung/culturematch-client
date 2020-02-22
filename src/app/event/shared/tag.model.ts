export interface TagSource {
  _id: string,
  name: string,
  createdAt: string,
  parent?: any;
}

export class TagModel {
  public id: string;
  public name: string;
  public createdAt: string;

  constructor (source: TagSource) {
    this.id = source._id;
    this.name = source.name;
    this.createdAt = source.createdAt;
  }
}
