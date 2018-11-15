import { dateFormat } from "../common";

export class Post {

  public id: string;
  public title: string;
  public content: string;
  public creatorId: string;
  public createDate: Date;
  public formattedDate: string;

  constructor(title: string, content: string, creatorId: string) {
    this.id = null;
    this.title = title;
    this.content = content;
    this.creatorId = creatorId;
    this.createDate = new Date();
    this.formattedDate = dateFormat(new Date());
  }

}
