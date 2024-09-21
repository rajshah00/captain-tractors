import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-part-master',
  templateUrl: './part-master.component.html',
  styleUrls: ['./part-master.component.scss']
})
export class PartMasterComponent implements OnInit {
  @ViewChild('form') form!: NgForm;

  serchObj: any = {};
  formObj: any = {};
  modaldataList: any = [];
  productTypeList: any = [];
  assemblyList: any = [];
  categoryList: any = [];
  partList: any = [];
  formType: any;
  partId: any;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getproductsTypeMaster();
  }

  onChangeProduct($event: any) {
    console.log(this.serchObj.product_type_id);
    
    this.modalList($event.id);
    this.serchObj.assembly_id = null;
    this.serchObj.model_id = null;
    this.assemblyList = [];
    this.modaldataList = []
  }

  //========// Get All Products Type //========//
  getproductsTypeMaster() {
    this.service.ProductTypeList({}).subscribe((res: any) => {
      if (res.success) {
        this.productTypeList = res.data
      }
    })
  }

  //========// Get All Modal //========//
  modalList(id: any) {
    this.service.productTypeModal({ product_type_id: id }).subscribe((res: any) => {
      if (res.success) {
        this.modaldataList = res.data
      }
    })
  }

  //========// Get All Modal //========//
  categoryGetList(modal_Id: any) {
    this.service.model_category_by_id({ model_id: modal_Id }).subscribe((res: any) => {
      if (res.success) {
        this.categoryList = res.data
      }
    })
  }

  onChangeModel(model_id: any) {
    this.service.ModeleAssembly({ model_id: model_id }).subscribe((res: any) => {
      if (res.success) {
        this.serchObj.assembly_id = null;
        this.assemblyList = [];
        this.assemblyList = res.data
      }
    })
  }

  //========// Get Catalogue //========//
  getCatalogue(Type: any) {
    if (Type == 'Reset') {
      this.serchObj = {};
      this.partList = [];
      return
    }
    this.service.e_CatalogueList(this.serchObj).subscribe((res: any) => {
      if (res.success && res.data.length) {
        this.partList = res.data;
      } else {
        this.partList = [];
        this.comman.toster('warning', res.message)
      }
    })
  }

  openPop(type: any, item: any) {
    if (type == 'Edit') {
      this.partId = item.id;
      this.formObj.name = item.name;
      this.formObj.part_no = item.part_no;
      this.formObj.moq = item.moq;
      this.formObj.sno = item.sno;
      this.formObj.remarks = item.remarks;
    } else {
      this.formObj = {};
      this.form.resetForm();
    }
    this.formType = type;
    $('#partPop').modal('show');
  }

  onSubmit(form: any) {
    //========// Add Part code //========//
    if (form.valid) {
      if (this.formType == 'Add') {
        let obj = {
          product_type_id: this.serchObj.product_type_id,
          model_id: this.serchObj.model_id,
          category_id: this.serchObj.category_id,
          assembly_id: this.serchObj.assembly_id,
          name: this.formObj.name,
          part_no: this.formObj.part_no,
          moq: this.formObj.moq,
          sno: this.formObj.sno,
          remarks: this.formObj.remarks,
        }
        this.service.addPart(obj).subscribe((res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getCatalogue('Search');
            $('#partPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later');
        })
      } else {
        //========// Edit category code //========//
        let obj = {
          product_type_id: this.serchObj.product_type_id,
          model_id: this.serchObj.model_id,
          category_id: this.serchObj.category_id,
          assembly_id: this.serchObj.assembly_id,
          name: this.formObj.name,
          part_no: this.formObj.part_no,
          moq: this.formObj.moq,
          sno: this.formObj.sno,
          remarks: this.formObj.remarks,
        }
        this.service.editPart(obj, this.partId).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getCatalogue('Search');
            $('#partPop').modal('hide');
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

  //========// Delete category code//========//
  deletePart(item: any) {
    this.service.deletePart(item.id).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getCatalogue('Search');
      } else {
        this.comman.toster('warning', res.message)
      }
    }, (err: any) => {
      console.log(err);
      this.comman.toster('error', 'ops! something went wrong please try again later')
    })
  }

  getAsseblyWiseData() {
    this.service.getTypeWiseData(this.serchObj).subscribe((res: any) => {
      if (res.success && res.data.length) {
        console.log(res);
        this.serchObj.assembly_id = null;
        this.assemblyList = [];
        this.assemblyList = res.data

      } else {
        this.partList = [];
        this.comman.toster('warning', res.message)
      }
    })
  }
}
