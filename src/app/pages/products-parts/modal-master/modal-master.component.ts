import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-modal-master',
  templateUrl: './modal-master.component.html',
  styleUrls: ['./modal-master.component.scss']
})
export class ModalMasterComponent implements OnInit {
  formObj: any = {};
  serchObj: any = {};
  modalType: any;
  searchTex: any;
  modalList: any = [];
  modalId: any;
  selectedFile: File | null = null;
  productTypeList: any;
  p: number = 1;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getModalList();
    this.getproductsTypeMaster();
  }

  openPop(type: any, item: any) {
    if (type == 'Edit') {
      this.modalId = item.id;
      this.formObj.name = item.name;
      this.formObj.number = item.number;
      this.formObj.image = item.image;
      this.formObj.description = item.description;
      this.formObj.is_active = item.is_active;
    } else {
      this.formObj = {};
    }
    this.modalType = type;
    $('#modalPop').modal('show');
  }

  onSubmit(form: any) {
    //========// Add modal code //========//
    if (form.valid) {
      this.formObj.is_active = this.formObj.is_active ? 1 : 0;
      if (this.modalType == 'Add') {
        const formData = new FormData();
        formData.append('name', this.formObj.name);
        formData.append('number', this.formObj.number);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.addModal(formData).subscribe((res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getModalList();
            $('#modalPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later');
        })
      } else {
        //========// Edit modal code //========//
        const formData = new FormData();
        formData.append('name', this.formObj.name);
        formData.append('number', this.formObj.number);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.editModal(formData, this.modalId).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getModalList();
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

  //========// Get All Modal //========//
  getModalList() {
    this.service.ModalList(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        this.modalList = res.data
      }
    })
  }

  //========// Delete Modal code//========//
  deleteModal(item: any) {
    let obj = {
      id: item.id
    }
    this.service.deleteModal(obj).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getModalList();
      } else {
        this.comman.toster('warning', res.message)
      }
    }, (err: any) => {
      console.log(err);
      this.comman.toster('error', 'ops! something went wrong please try again later')
    })
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  
  //========// Get All Products Type //========//
  getproductsTypeMaster() {
    this.service.ProductTypeList({}).subscribe((res: any) => {
      if (res.success) {
        this.productTypeList = res.data
      }
    })
  }

  resetForm(form: any) {
    form.resetForm();
    this.getModalList();
  }

}