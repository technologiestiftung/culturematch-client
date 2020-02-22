export interface AgreementSource {
  id: string,
  title: string,
  type: string,
  content: string,
  excerpt: string,
  changes: string,
  validityStartDate: string,
  status: string,
}

export class AgreementModel {
  public id: string;
  public title: string;
  public content: string;
  public excerpt: string;
  public changes: string;
  public validityStartDate: string;
  public status: string;

  constructor (source: AgreementSource) {
    this.id = source.id;
    this.title = source.title;
    this.content = source.content;
    this.excerpt = source.excerpt;
    this.changes = source.changes;
    this.validityStartDate = source.validityStartDate;
    this.status = source.status;
  }
}
