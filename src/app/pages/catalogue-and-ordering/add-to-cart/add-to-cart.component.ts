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
  totalQty: number = 0;
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
        this.totalQty = 0;
        this.cartList.forEach((item: any) => {
          this.totalQty += item.qty;
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

  //========// Update Cart Item //========//
  updateCart() {
    let obj: any = {
      "user_id": this.userData.id,
      "parts": []
    }
    this.cartList.forEach((item: any) => {
      obj.parts.push({
        "part_id": item.part_id,
        "qty": item.qty,
      })
    });
    if (obj.parts && obj.parts.length) {
      this.service.addToCart(obj).subscribe((res: any) => {
        if (res.success) {
          this.comman.toster('success', res.message);
          this.getCartList();
        } else {
          this.comman.toster('warning', res.message)
        }
      })
    } else {
      this.comman.toster('warning', "Plese select quantities and move items to a cart")
    }

  }

  increment(ind: any): void {
    if (this.cartList[ind].qty < 100) {
      this.cartList[ind].qty += 1;
      this.totalQty += 1;
    }
  }

  decrement(ind: any): void {
    if (this.cartList[ind].qty > 0 && this.cartList[ind].qty < 100) {
      this.cartList[ind].qty -= 1;
      this.totalQty -= 1;
    }
  }

  onChange() {
    // console.log("item", item);

    this.totalQty = 0;
    this.cartList.forEach((item: any) => {
      this.totalQty += item.qty;
    });

  }
}
