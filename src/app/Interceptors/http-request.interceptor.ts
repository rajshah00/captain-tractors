import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';


@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinner.show();
    const authToken = localStorage.getItem('token');
    if (authToken) {
      const modified = request.clone({
        setHeaders: { "Authorization": "Bearer " + authToken }
      });
      return next.handle(modified).pipe(
        finalize(() => this.spinner.hide())
      );
    }

    return next.handle(request);
  }
}
