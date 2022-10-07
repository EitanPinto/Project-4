import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authToken: string | null = this.auth.getTokenLS();
    if(authToken === null || authToken === "") authToken = "demoStringToken";
      const authReq = req.clone({
      headers: req.headers.set('authorization', authToken)
    });
    return next.handle(authReq);
  }
};


