import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-technical-specification',
  templateUrl: './technical-specification.component.html',
  styleUrls: ['./technical-specification.component.scss']
})
export class TechnicalSpecificationComponent implements OnInit {
  @ViewChild('addEditForm') addEditForm!: NgForm;
  serchObj: any = {};
  formObj: any = {};
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  modalList: any = [];
  modalSearchOpetion:any = [];
  categoryList: any = [];
  parametersList: any = [];
  p: number = 1;
  modalType: any;
  getAll: any = [];
  itemId: any;

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
  ) { }

  ngOnInit(): void {
    this.getModalList();
    this.getCatalogue();
  }

  getCatalogue(type?: any) {
    if (type == 'Reset') { this.serchObj = {} }
    this.service.get(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        this.getAll = res.data;
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }


  //========// Get All Modal //========//
  getModalList() {
    this.service.ModalList(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        this.modalList = res.data;
        this.modalSearchOpetion = res.data;
        this.modalSearchOpetion.unshift({ id: '', name: 'ALL' })
      }
    })
  }

  //========// Get All Modal //========//
  getcategoryList(item: any) {
    this.service.model_category_by_id({ model_id: item.id }).subscribe((res: any) => {
      if (res.success) {
        this.categoryList = res.data
      }
    })
  }


  openPop(type: any, item: any) {
    if (type == "Add") {
      this.parametersList = [{ label: '', value: '' }];
      this.formObj = {};
      this.addEditForm.reset();
    } else {
      this.itemId = item.id;
      this.parametersList = item.parameters;
      this.formObj.model_id = item.model_id;
      this.formObj.category_id = item.category_id;
      this.formObj.tractor_model_name = item.tractor_model_name;
      this.formObj.ctpl_model_code = item.ctpl_model_code;
      this.formObj.camel_model_code = item.camel_model_code;
      this.formObj.homologation_compliance = item.homologation_compliance;
    }
    this.modalType = type;
    $('#add-technical-specification').modal('show');
  }


  addRow() {
    this.parametersList.push({ label: '', value: '' });
    console.log("this.parametersList", this.parametersList);

  }

  removeRow(ind: any) {
    this.parametersList.splice(ind, 1);
  }

  submit(form: any) {
    if (form.form.valid) {
      this.formObj.parameters = this.parametersList;
      if (this.modalType == 'Add') {
        this.service.save(this.formObj).subscribe((res: any) => {
          if (res.success) {
            $('#add-technical-specification').modal('hide');
            this.comman.toster('success', res.message);
            this.getCatalogue();
          } else {
            this.comman.toster('warning', res.message)
          }
        })
      } else {
        this.service.edit(this.formObj, this.itemId).subscribe((res: any) => {
          if (res.success) {
            $('#add-technical-specification').modal('hide');
            this.comman.toster('success', res.message);
            this.getCatalogue();
          } else {
            this.comman.toster('warning', res.message)
          }
        })
      }
    }
  }


  delete(item: any) {
    this.service.delete(item.id).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getCatalogue();
      } else {
        this.comman.toster('warning', res.message)
      }
    }, (err: any) => {
      console.log(err);
      this.comman.toster('error', 'Ops! something went wrong please try again later')
    })
  }

  download() {
    this.serchObj.export = 1;
    this.serchObj.export_type = "xlsx";
    this.service.get(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        const link = document.createElement('a');
        link.href = res.data.file_url;
        link.target = '_blank';
        link.download;
        link.click();
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

}
