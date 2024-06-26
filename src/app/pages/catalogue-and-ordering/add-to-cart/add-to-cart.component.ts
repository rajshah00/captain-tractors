import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit {
  cartList: any;
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  finalTotal: any;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    this.getCartList();
  }


  //========// Get All Cart List //========//
  getCartList() {
    let obj = {
      user_id: this.userData.id
    }
    this.service.cartList(obj).subscribe((res: any) => {
      if (res.success) {
        this.cartList = res.data;
        this.finalTotal = 0;
        this.cartList.forEach((item: any) => {
          this.finalTotal += item.price * item.qty;
        });
      }
    })
  }

  //========// Delete Cart Item //========//
  deleteCart(item: any) {
    this.service.deleteCart(item.id).subscribe((res: any) => {
      if (res.success) {
        this.getCartList();
        this.comman.toster('success', res.message);
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }
}
