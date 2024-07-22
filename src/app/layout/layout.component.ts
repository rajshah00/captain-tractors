import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { CommanService } from '../services/comman.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  getAllNotification: any;
  currentDate: any;
  userData: any;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    console.log("this.currentDate", this.currentDate);

    this.getCatalogue();
    this.userData = JSON.parse(localStorage.getItem('profile') || '')
    let obj = {
      user_id: this.userData.id
    }
    this.getCartList(obj)
  }


  //========// Get All Cart List //========//
  getCartList(obj: any) {
    this.service.cartList(obj).subscribe((res: any) => {
      if (res.success) {
        console.log(res);
      }
    })
  }


  //========// Get All Notifications List //========//
  getCatalogue() {
    this.service.getNotifications({}).subscribe((res: any) => {
      if (res.success) {
        this.getAllNotification = res.data;
        this.getAllNotification.forEach((notification: any, index: any) => {
          notification.displayTime = this.timeDifference(notification.created_at);
        });

        for (let i = 0; i < this.getAllNotification.length; i++) {
          if (this.isToday(this.getAllNotification[i].created_at)) {
            this.getAllNotification[i].dateType = 'Today';
            break;
          }
        };

        for (let i = 0; i < this.getAllNotification.length; i++) {
          if (!this.isToday(this.getAllNotification[i].created_at)) {
            this.getAllNotification[i].dateType = 'Other Day';
            console.log("isadasd");
            break;
          }
        };
        console.log("this.getAllNotification", this.getAllNotification);

      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  isToday(createdAt: string): boolean {
    const today = new Date();
    const createdDate = new Date(createdAt);

    return (
      createdDate.getDate() === today.getDate() &&
      createdDate.getMonth() === today.getMonth() &&
      createdDate.getFullYear() === today.getFullYear()
    );
  }

  formatDate(date: any) {
    const options: any = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  timeDifference(date: any) {
    const now: any = new Date();
    const createdDate: any = new Date(date);
    const diffInMs = now - createdDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const diffInMinutes = diffInMs / (1000 * 60);
      if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)} minutes ago`;
      }
      return `${Math.floor(diffInHours)} hours ago`;
    }

    return this.formatDate(date);
  };

  redirectTo(item: any) {
    this.service.readNotification({ notificationn_id: item.id }).subscribe((res: any) => {
      if (res.success) {
        this.getCatalogue();
        this.router.navigate(['/order-detail', item.uuid], {
          queryParams: { type: 'Order' }
        });
        $('#theme-settings-offcanvas').offcanvas('hide');
      }
    });
  }


}
