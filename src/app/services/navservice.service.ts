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
      path: '',
      title: 'Masters',
      type: 'link',
      icon: 'bi bi-menu-button-wide',
      children: [
        {
          path: '/user-master',
          title: 'User Master',
          type: 'link',
          icon: 'bi bi-people',
        },
        {
          path: '/role-master',
          title: 'Role Master',
          type: 'link',
          icon: 'bi bi-person-gear',
        },
        {
          path: '/brand-master',
          title: 'Brand Master',
          type: 'link',
          icon: 'bi bi-person-gear',
        },
        {
          path: '/dealer-assign-model',
          title: 'Assign Model',
          type: 'link',
          icon: 'bi bi-person-lines-fill',
        },
      ]
    },
    {
      path: '',
      title: 'Ordering',
      type: 'link',
      icon: 'bi bi-menu-button-wide',
      children: [
        {
          path: '/catalogue-and-ordering',
          title: 'Order List',
          type: 'link',
          icon: 'bi bi-cart4',
        },
        {
          path: '/add-catalogue',
          title: 'E-Catalogue',
          type: 'link',
          icon: 'bi bi-cart4',
        },
        {
          path: '/purchase-order',
          title: 'Purchase Order',
          type: 'link',
          icon: 'bi bi-grid',
        },
      ]
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
        },
        {
          path: '/category-master',
          title: 'Category Master',
          type: 'link',
          icon: 'bi bi-circle',
        },
        {
          path: '/part-master',
          title: 'Part Master',
          type: 'link',
          icon: 'bi bi-circle',
        }
      ]
    },
    {
      path: '',
      title: 'Services',
      type: 'link',
      icon: 'bi bi-menu-button-wide',
      children: [
        {
          path: '/i-catalogue',
          title: 'E - Catalogue',
          type: 'link',
          icon: 'bi bi-bullseye',
        },
        {
          path: '/technical-circula',
          title: 'Technical Circular',
          type: 'link',
          icon: 'bi bi-bullseye',
        },
        {
          path: '/service-manuals',
          title: 'Service Manuals',
          type: 'link',
          icon: 'bi bi-ui-checks-grid',
        },
        {
          path: '/owners-manuals',
          title: 'Owners Manuals',
          type: 'link',
          icon: 'bi bi-person-lines-fill',
        },
        {
          path: '/service-sop',
          title: 'Service SOP',
          type: 'link',
          icon: 'bi bi-person-lines-fill',
          children: []
        },
      ]
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
          path: '/pending-order-report',
          title: 'Pending Order Report',
          type: 'link',
          icon: 'bi bi-circle',
        }, {
          path: '/approval-order-report',
          title: 'Approval Order Report',
          type: 'link',
          icon: 'bi bi-circle',
        },
        {
          path: '/camel-reports',
          title: 'Spare Parts Sales Report',
          type: 'link',
          icon: 'bi bi-circle',
        }
      ]
    },
    // {
    //   path: '',
    //   title: 'More',
    //   type: 'link',
    //   icon: 'bi bi-menu-button-wide',
    //   children: [
    //     {
    //       path: '/feedback',
    //       title: 'Feedback',
    //       type: 'link',
    //       icon: 'bi bi-person-lines-fill',
    //     },
    //   ]
    // },

  ]

  role_Menu = new BehaviorSubject<any[]>(this.ROLEMENU);

}
