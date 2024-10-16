import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { ApiServiceService } from '../services/api-service.service';


@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private spinner: ApiServiceService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Show spinner for requests except for `/all_list`
    if (!request.url.includes('/all_list') && !request.url.includes('/chassis_number/list') && !request.url.includes('model_master/product_type/list') && !request.url.includes('assembly_master/list') && !request.url.includes('dealer/model/list')) {
      this.spinner.show();
    }
    const authToken = localStorage.getItem('token');
    if (authToken) {
      const modified = request.clone({
        setHeaders: { "Authorization": "Bearer " + authToken }
      });
      return next.handle(modified).pipe(
        finalize(() => {
          setTimeout(() => {
            this.spinner.hide()
          }, 1500);
        })
      );
    }

    return next.handle(request);
  }
}
