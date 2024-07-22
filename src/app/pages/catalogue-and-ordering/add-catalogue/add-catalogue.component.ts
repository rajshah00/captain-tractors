import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-add-catalogue',
  templateUrl: './add-catalogue.component.html',
  styleUrls: ['./add-catalogue.component.scss']
})
export class AddCatalogueComponent implements OnInit {
  formObj: any = {};
  assemblyList: any;
  modaldataList: any;
  productTypeList: any;
  partList: any = [];
  totalQty: any = 0;
  lineCount: any = 0;
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }
  ngOnInit(): void {
    this.getproductsTypeMaster();
    this.getassemblyList();
    this.modalList();
  }


  //========// Get All assembly //========//
  getassemblyList() {
    this.service.AssemblyList({}).subscribe((res: any) => {
      if (res.success) {
        this.assemblyList = res.data
      }
    })
  }

  //========// Get All Modal //========//
  modalList() {
    this.service.ModalList({}).subscribe((res: any) => {
      if (res.success) {
        this.modaldataList = res.data
      }
    })
  }

  //========// Get All Products Type //========//
  getproductsTypeMaster() {
    this.service.ProductTypeList({}).subscribe((res: any) => {
      if (res.success) {
        this.productTypeList = res.data
      }
    })
  }

  //========// Get Catalogue //========//
  getCatalogue(Type: any) {
    if (Type == 'Reset') { this.formObj = {} }
    this.service.e_CatalogueList(this.formObj).subscribe((res: any) => {
      if (res.success && res.data.length) {
        this.partList = res.data;
        this.totalQty = 0;
        this.lineCount = 0;
        for (let item of this.partList) {
          item.qty = 0;
        }
      } else {
        this.partList = [];
        this.comman.toster('warning', res.message)
      }
    })
  }


  increment(ind: any): void {
    if (this.partList[ind].qty < 100) {
      this.partList[ind].qty += 1;
      this.totalQty += 1;
      this.lineCount = this.partList.reduce((acc: any, item: any) => { return item.qty > 0 ? acc + 1 : acc; }, 0);
    }
  }

  decrement(ind: any): void {
    if (this.partList[ind].qty > 0 && this.partList[ind].qty < 100) {
      this.partList[ind].qty -= 1;
      this.totalQty -= 1;
      this.lineCount = this.partList.reduce((acc: any, item: any) => { return item.qty > 0 ? acc + 1 : acc; }, 0);
    }
  }

  moveTocart() {
    let obj: any = {
      "user_id": this.userData.id,
      "parts": []
    }
    this.partList.forEach((item: any) => {
      if (item.qty > 0) {
        obj.parts.push({
          "part_id": item.id,
          "qty": item.qty,
          "price": item.price,
          "total": item.price
        })
      }
    });
    if (obj.parts && obj.parts.length) {
      this.service.addToCart(obj).subscribe((res: any) => {
        if (res.success) {
          // this.router.navigate(['/add-to-cart'])
          this.comman.toster('success', res.message);
        } else {
          this.comman.toster('warning', res.message)
        }
      })
    } else {
      this.comman.toster('warning', "Plese select quantities and move items to a cart")
    }

  }

}
