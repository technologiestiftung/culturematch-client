export interface UserSource {
  id: string,
  displayName: string,
  email: string,
}

export class UserModel {
  public id: string;
  public displayName: string;
  public email: string;

  constructor(source: UserSource) {
    this.id = source.id;
    this.displayName = source.displayName;
    this.email = source.email;
  }
}
