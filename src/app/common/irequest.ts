export class IRequest {

  public params: {};
  public type: string;

  constructor(params: {}, type: string) {
    this.params = params;
    this.type = type;
  }

  public getParams() {
    return this.params;
  }

}
