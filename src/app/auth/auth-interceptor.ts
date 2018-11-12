import { UsersService } from '../users.service';
import { HttpRequest, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private usersService: UsersService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.usersService.getToken();

    // Request has to be cloned before modification
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });

    // Pass along the new request
    return next.handle(authRequest);
  }
}
