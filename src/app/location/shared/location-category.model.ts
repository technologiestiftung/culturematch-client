export interface LocationCategorySource {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
}

export class LocationCategoryModel {
  public id: string;
  public title: string;
  public createdAt: string;
  public updatedAt: string;

  constructor (source: LocationCategorySource) {
    this.id = source.id;
    this.title = source.title;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
