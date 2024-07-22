import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-assembly-master',
  templateUrl: './assembly-master.component.html',
  styleUrls: ['./assembly-master.component.scss']
})
export class AssemblyMasterComponent implements OnInit {
  formObj: any = {};
  serchObj: any = {};
  assemblyType: any;
  searchTex: any;
  assemblyList: any = [];
  assemblyId: any;
  selectedFile: File | null = null;
  modaldataList: any;
  p: number = 1;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getassemblyList();
    this.modalList();
  }

  openPop(type: any, item: any) {
    if (type == 'Edit') {
      this.assemblyId = item.id;
      this.formObj.name = item.name;
      this.formObj.model_id = item.model_id;
      this.formObj.image = item.image;
      this.formObj.description = item.description;
      this.formObj.is_active = item.is_active;
    } else {
      this.formObj = {};
    }
    this.assemblyType = type;
    $('#assebmlyPop').modal('show');
  }

  onSubmit(form: any) {
    //========// Add assembly code //========//
    if (form.valid) {
      this.formObj.is_active = this.formObj.is_active ? 1 : 0;
      if (this.assemblyType == 'Add') {
        const formData = new FormData();
        formData.append('name', this.formObj.name);
        formData.append('model_id', this.formObj.model_id);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.addAssembly(formData).subscribe((res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getassemblyList();
            $('#assebmlyPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later');
        })
      } else {
        //========// Edit assembly code //========//
        const formData = new FormData();
        formData.append('name', this.formObj.name);
        formData.append('model_id', this.formObj.model_id);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.editAssembly(formData, this.assemblyId).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getassemblyList();
            $('#assebmlyPop').modal('hide');
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

  //========// Get All assembly //========//
  getassemblyList() {
    this.service.AssemblyList(this.serchObj).subscribe((res: any) => {
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

  //========// Delete assembly code//========//
  deleteAssembly(item: any) {
    let obj = {
      id: item.id
    }
    this.service.deleteAssembly(obj).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getassemblyList();
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
    this.getassemblyList()
  }

}