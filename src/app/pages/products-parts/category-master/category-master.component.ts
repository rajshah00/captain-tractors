import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.scss']
})
export class CategoryMasterComponent implements OnInit {
  @ViewChild('assembly_logo') assembly_logo: ElementRef | any;
  formObj: any = {};
  serchObj: any = {};
  categoryType: any;
  searchTex: any;
  categoryList: any = [];
  categoryId: any;
  selectedFile: File | null = null;
  modaldataList: any;
  p: number = 1;
  assemblyList: any = [];
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getcategoryList();
    this.modalList();
  }

  //========// Get All assembly //========//
  onChangeModel(model_id: any) {
    this.service.ModeleAssembly({ model_id: model_id }).subscribe((res: any) => {
      if (res.success) {
        this.assemblyList = res.data;
      }
    })
  }

  openPop(type: any, item: any) {
    this.assembly_logo.nativeElement.value = '';
    if (type == 'Edit') {
      console.log(item);

      this.categoryId = item.id;
      this.formObj.name = item.name;
      this.formObj.model_id = [];
      item.model.forEach((item: any) => {
        this.formObj.model_id.push(item.id)
      });
      this.formObj.image = item.image;
      this.formObj.description = item.description;
      this.formObj.is_active = item.is_active;
    } else {
      this.formObj = {};
    }
    this.categoryType = type;
    $('#categoryPop').modal('show');
  }

  onSubmit(form: any) {
    //========// Add category code //========//
    if (form.valid) {
      this.formObj.is_active = this.formObj.is_active ? 1 : 0;
      if (this.categoryType == 'Add') {
        const formData = new FormData();
        formData.append('name', this.formObj.name);
        this.formObj.model_id.forEach((id: number) => {
          formData.append('model_ids[]', id.toString());
        });
        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.addCategory(formData).subscribe((res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getcategoryList();
            $('#categoryPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later');
        })
      } else {
        //========// Edit category code //========//
        const formData = new FormData();
        formData.append('name', this.formObj.name);
        this.formObj.model_id.forEach((id: number) => {
          formData.append('model_ids[]', id.toString());
        });

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.editCategory(formData, this.categoryId).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getcategoryList();
            $('#categoryPop').modal('hide');
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

  //========// Get All category //========//
  getcategoryList() {
    this.service.model_categoryList(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        this.categoryList = res.data
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

  //========// Delete category code//========//
  deleteCategory(item: any) {
    this.service.deleteCategory(item.id).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getcategoryList();
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

  resetForm(form: any) {
    form.resetForm();
    this.getcategoryList()
  }

}