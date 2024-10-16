import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  @ViewChild('model_logo') model_logo: ElementRef | any;
  @ViewChild('Brochure_img') Brochure_img: ElementRef | any;
  @ViewChild('Brochure_pdf') Brochure_pdf: ElementRef | any;
  formObj: any = {};
  serchObj: any = {};
  modalType: any;
  searchTex: any;
  modalList: any = [];
  modalId: any;
  selectedFile: File | null = null;
  productTypeList: any;
  p: number = 1;
  validation: any = {};
  BrochurePdf: any = "";
  deleteImageType: any;
  TypeList: any = [];
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getModalList();
    this.getproductsTypeMaster();
    this.getMainTypeMaster();
  }

  openPop(type: any, item: any) {
    this.model_logo.nativeElement.value = '';
    this.Brochure_img.nativeElement.value = '';
    this.Brochure_pdf.nativeElement.value = '';
    if (type == 'Edit') {
      this.formObj.product_type_master_id = item.product_type_master_id;
      this.modalId = item.id;
      this.formObj.name = item.name;
      this.formObj.number = item.number;
      this.formObj.main_category_id = item.main_category_id;
      this.formObj.image = item.image;
      this.formObj.blosore_image_view = item.blosore_image;
      this.formObj.description = item.description;
      this.formObj.is_active = item.is_active;
    } else {
      this.formObj = {};
    }
    this.validation = {};
    this.modalType = type;
    $('#modalPop').modal('show');
  }

  onSubmit(form: any) {
    //========// Add modal code //========//
    if (form.valid) {
      this.formObj.is_active = this.formObj.is_active ? 1 : 0;
      if (this.modalType == 'Add') {
        const formData = new FormData();
        formData.append('product_type_master_id', this.formObj.product_type_master_id);
        formData.append('name', this.formObj.name);
        formData.append('number', this.formObj.number);
        formData.append('main_category_id', this.formObj.main_category_id);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }

        if (this.formObj.blosore_pdf) {
          formData.append('blosore_pdf', this.formObj.blosore_pdf, this.formObj.blosore_pdf.name);
        }

        if (this.formObj.blosore_image) {
          formData.append('blosore_image', this.formObj.blosore_image, this.formObj.blosore_image.name);
        }
        this.service.addModal(formData).subscribe((res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getModalList();
            $('#modalPop').modal('hide');
          } else {
            this.validation = res.data;
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later');
        })
      } else {
        //========// Edit modal code //========//
        const formData = new FormData();
        formData.append('product_type_master_id', this.formObj.product_type_master_id);
        formData.append('name', this.formObj.name);
        formData.append('number', this.formObj.number);
        formData.append('main_category_id', this.formObj.main_category_id);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        } else if (this.deleteImageType == 'modal_image') {
          formData.append('image', '');
        }

        if (this.formObj.blosore_pdf) {
          formData.append('blosore_pdf', this.formObj.blosore_pdf, this.formObj.blosore_pdf.name);
        }

        if (this.formObj.blosore_image) {
          formData.append('blosore_image', this.formObj.blosore_image, this.formObj.blosore_image.name);
        } else if (this.deleteImageType == 'Brochure_img') {
          formData.append('blosore_image', '');
        }

        this.service.editModal(formData, this.modalId).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getModalList();
            $('#modalPop').modal('hide');
          } else {
            this.validation = res.data;
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


  selectBrochure(event: any, type: any) {
    const file = event.target.files[0];

    if (type === 'PDF') {
      if (file && file.type === 'application/pdf') {
        this.formObj.blosore_pdf = file;
      } else {
        this.comman.toster('error', 'Please upload a valid PDF file.');
        event.target.value = '';  // Clear the input
      }
    } else {
      this.formObj.blosore_image = file;
    }
  }


  //========// Get All Products Type //========//
  getproductsTypeMaster() {
    this.service.ProductTypeList({}).subscribe((res: any) => {
      if (res.success) {
        this.productTypeList = res.data
      }
    })
  }

  //========// Get All Products Type //========//
  getMainTypeMaster() {
    this.service.MainTypeList({}).subscribe((res: any) => {
      if (res.success) {
        this.TypeList = res.data
      }
    })
  }

  resetForm(form: any) {
    form.resetForm();
    this.getModalList();
  }

  openPopVeiw(item: any) {
    if (item.blosore_pdf) {
      this.BrochurePdf = this.sanitizer.bypassSecurityTrustResourceUrl(item.blosore_pdf);
    }
    $('#exampleModal').modal('show')
  }


  deleteImage(type: any) {
    this.deleteImageType = type;
    if (type == 'Brochure_img') {
      this.formObj.blosore_image_view = "";
    } else if (type == 'modal_image') {
      this.formObj.image = "";
    }
  }

}