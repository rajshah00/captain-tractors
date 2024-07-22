import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CommanService } from '../services/comman.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {

  constructor(public Notify: CommanService, private spinner: NgxSpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          if (!evt.body.success && evt.body.status_code == 200) {
            this.Notify.toster('error', evt.body.message);
          }
        }
        return of(evt);
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 401) {
            this.Notify.toster('error', "Unauthorized (X401)!");
          } else if (err.status == 400) {
            if (err.error.message) {
              this.Notify.toster('error', err.error.message);
            } else {
              this.Notify.toster('error', "Server error (X400)!");
            }
          } else if (err.status == 422) {
            if (err.error.message) {
              this.Notify.toster('error', err.error.message);
            } else if (err.error.error) {
              this.Notify.toster('error', err.error.error);
            } else {
              this.Notify.toster('error', "Server error (X422)!");
            }
          } else if (err.status == 500) {
            this.Notify.toster('error', "Server error (X500)!");
          } else {
            // TODO
            this.Notify.toster('error', "Error occurred!");
          }
        }
        this.spinner.hide();
        return of(err);
      }));
  }
}
