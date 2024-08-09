import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingFormGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    if (!localStorage.getItem('order_detail')) {
      this.router.navigate(['/purchase-order']);
      return false;
    }
    return true;
  }

}
