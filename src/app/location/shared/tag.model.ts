export interface TagSource {
  id: string,
  name: string,
  createdAt: string,
}

export class TagModel {
  public id: string;
  public name: string;
  public createdAt: string;

  constructor (source: TagSource) {
    this.id = source.id;
    this.name = source.name;
    this.createdAt = source.createdAt;
  }
}
