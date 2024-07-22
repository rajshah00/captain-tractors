import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-products-type-master',
  templateUrl: './products-type-master.component.html',
  styleUrls: ['./products-type-master.component.scss']
})
export class ProductsTypeMasterComponent implements OnInit {
  formObj: any = {};
  serchObj: any = {};
  modalType: any;
  searchTex: any;
  productTypeList: any = [];
  productTypeId: any;
  selectedFile: File | null = null;
  p: number = 1;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getproductsTypeMaster();
  }

  openPop(type: any, item: any) {
    if (type == 'Edit') {
      this.productTypeId = item.id;
      this.formObj.name = item.name;
      this.formObj.description = item.description;
      this.formObj.is_active = item.is_active;
    } else {
      this.formObj = {};
    }
    this.modalType = type;
    $('#modalPop').modal('show');
  }


  onSubmit(form: any) {
    //========// Add Products Type Maste code //========//
    if (form.valid) {
      this.formObj.is_active = this.formObj.is_active ? 1 : 0;
      if (this.modalType == 'Add') {
        const formData = new FormData();
        formData.append('name', this.formObj.name);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.addProductType(formData).subscribe((res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getproductsTypeMaster();
            $('#modalPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later');
        })
      } else {
        //========// Edit Products Type Maste code //========//
        const formData = new FormData();
        formData.append('name', this.formObj.name);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.editProductType(formData, this.productTypeId).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getproductsTypeMaster();
            $('#modalPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later')
        })
      }
    }
  }

  //========// Get All Products Type //========//
  getproductsTypeMaster() {
    this.service.ProductTypeList(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        this.productTypeList = res.data
      }
    })
  }

  //========// Delete Modal code//========//
  deleteProductType(item: any) {
    let obj = {
      id: item.id
    }
    this.service.deleteProductType(obj).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getproductsTypeMaster();
      } else {
        this.comman.toster('warning', res.message)
      }
    }, (err: any) => {
      console.log(err);
      this.comman.toster('error', 'ops! something went wrong please try again later')
    })
  }


  resetForm(form: any) {
    form.resetForm();
    this.getproductsTypeMaster();
  }


}
