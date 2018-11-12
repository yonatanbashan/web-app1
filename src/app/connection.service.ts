import { Injectable } from '@angular/core';


@Injectable()
export class ConnectionService {

  getServerAddress() {
    return 'http://localhost:3000/';
  }

}
