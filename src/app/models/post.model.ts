export class Post {

  public id: string;
  public title: string;
  public content: string;
  public creatorId: string;
  public dateCreated: Date;

  constructor(title: string, content: string, creatorId: string) {
    this.id = null;
    this.title = title;
    this.content = content;
    this.creatorId = creatorId;
    this.dateCreated = new Date();
  }

}
