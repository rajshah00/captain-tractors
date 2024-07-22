import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NavserviceService {

  constructor() { }


  ROLEMENU: any[] = [
    {
      path: '/dashboard',
      title: 'Dashboard',
      type: 'link',
      icon: 'bi bi-grid',
      children: []
    },
    {
      path: '/user-master',
      title: 'User Master',
      type: 'link',
      icon: 'bi bi-people',
      children: []
    },
    {
      path: '/role-master',
      title: 'Role Master',
      type: 'link',
      icon: 'bi bi-person-gear',
      children: []
    },
    {
      path: '/brand-master',
      title: 'Brand Master',
      type: 'link',
      icon: 'bi bi-person-gear',
      children: []
    },
    {
      path: '',
      title: 'Products Parts',
      type: 'link',
      icon: 'bi bi-menu-button-wide',
      children: [
        {
          path: '/products-type-master',
          title: 'Products Type Master',
          type: 'link',
          icon: 'bi bi-circle',
        },
        {
          path: '/model-master',
          title: 'Model Master',
          type: 'link',
          icon: 'bi bi-circle',
        },
        {
          path: '/assembly-master',
          title: 'Assembly Master',
          type: 'link',
          icon: 'bi bi-circle',
        }
      ]
    },
    {
      path: '/catalogue-and-ordering',
      title: 'Catalogue & Ordering',
      type: 'link',
      icon: 'bi bi-cart4',
      children: []
    },
    {
      path: '/i-circular',
      title: 'I-Circular',
      type: 'link',
      icon: 'bi bi-bullseye',
      children: []
    },
    {
      path: '/service-manuals',
      title: 'Service Manuals',
      type: 'link',
      icon: 'bi bi-ui-checks-grid',
      children: []
    },
    {
      path: '/owners-manuals',
      title: 'Owners Manuals',
      type: 'link',
      icon: 'bi bi-person-lines-fill',
      children: []
    },
    {
      path: '/service-sop',
      title: 'Service SOP',
      type: 'link',
      icon: 'bi bi-person-lines-fill',
      children: []
    },
    {
      path: '/dealer-assign-model',
      title: 'Dealer Assign Model',
      type: 'link',
      icon: 'bi bi-person-lines-fill',
      children: []
    },
    {
      path: '',
      title: 'Reports',
      type: 'link',
      icon: 'bi bi-menu-button-wide',
      children: [
        {
          path: '/back-order-report',
          title: 'Back Order Report',
          type: 'link',
          icon: 'bi bi-circle',
        },
        {
          path: '/spare-parts-billing-report',
          title: 'Spare Parts Billing Report',
          type: 'link',
          icon: 'bi bi-circle',
        }
      ]
    },
    {
      path: '/purchase-order',
      title: 'Purchase Order',
      type: 'link',
      icon: 'bi bi-grid',
      children: []
    },
  ]

  role_Menu = new BehaviorSubject<any[]>(this.ROLEMENU);

}
