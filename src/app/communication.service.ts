import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

/* *
  This is a general service to communicate between components, using subjects.
* */
@Injectable()
export class CommunicationService {

  constructor() {}

  /*
    Search/find related members
  */
  private searchActionSubj: Subject<string> = new Subject<string>();
  private lastSearch: string;

  /*
    Search/find related functions
  */
  getSearchActionSubj() {
    return this.searchActionSubj;
  }

  putSearchActionSubj(s: string) {
    this.searchActionSubj.next(s);
    this.lastSearch = s;
  }

  getLastSearch() {
    return this.lastSearch;
  }

}
