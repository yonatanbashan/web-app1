export class Post {

  public id: string;
  public title: string;
  public content: string;
  public user: string;
  public dateCreated: Date;

  constructor(title: string, content: string, user: string) {
    this.id = null;
    this.title = title;
    this.content = content;
    this.user = user;
    this.dateCreated = new Date();
  }

}
