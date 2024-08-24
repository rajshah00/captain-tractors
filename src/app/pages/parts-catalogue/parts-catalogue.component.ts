import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-parts-catalogue',
  templateUrl: './parts-catalogue.component.html',
  styleUrls: ['./parts-catalogue.component.scss']
})
export class PartsCatalogueComponent implements OnInit {
  userData: any;
  modalList: any = [];
  isChecked: boolean = false;
  productId: any = 1;

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }
  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('profile') || '');
    this.getModalList(3);
  }


  //========// Get All Modal //========//
  getModalList(typeId: any) {
    if (this.userData.role_name == 'Dealer') {
      let obj = {
        id: this.userData.id,
        product_type_id: typeId
      }
      this.service.dealerwiseModal(obj).subscribe((res: any) => {
        if (res.success) {
          this.modalList = res.data.models;
        }
      })
    } else {
      this.service.ModalList({}).subscribe((res: any) => {
        if (res.success) {
          this.modalList = res.data
        }
      })
    }
  }



  toggleSwitch() {
    // this.isChecked = !this.isChecked;
    console.log("this.isChecked", this.isChecked);
    if (this.isChecked) {
      this.getModalList(1);
      this.productId = 1;
    } else {
      this.productId = 3;
      this.getModalList(3);
    }

  }
}
