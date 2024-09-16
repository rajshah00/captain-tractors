import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-add-assembly',
  templateUrl: './add-assembly.component.html',
  styleUrls: ['./add-assembly.component.scss']
})
export class AddAssemblyComponent implements OnInit {
  formObj: any = {};
  modaldataList: any;
  selectedFile: any;
  assemblyType: any = 'Add';
  progress: number = 0;
  showProgress: boolean = false;
  assemblyId: any;
  excelFile: any;

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.modalList();
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.service.getAssemblyById(params['id']).subscribe((res: any) => {
          if (res.success) {
            this.assemblyId = params['id'];
            this.formObj.name = res.data.user.name;
            this.formObj.model_id = res.data.user.model_id;
            this.formObj.assembly_no = res.data.user.assembly_no;
            this.formObj.image = res.data.user.image;
            this.formObj.description = res.data.user.description;
            this.formObj.is_active = res.data.user.is_active;
            this.assemblyType = "Edit"
          }
        })
        console.log("this.assemblyId", this.assemblyId);
      } else {
        this.formObj = {};
      };
    });
  }

  //========// Get All Modal //========//
  modalList() {
    this.service.ModalList({}).subscribe((res: any) => {
      if (res.success) {
        this.modaldataList = res.data
      }
    })
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.handleFiles(input.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = document.getElementById('drop-area');
    dropArea?.classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = document.getElementById('drop-area');
    dropArea?.classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = document.getElementById('drop-area');
    dropArea?.classList.remove('dragover');
    if (event.dataTransfer?.files && event.dataTransfer.files.length) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  handleFiles(files: FileList) {
    if (files.length) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        console.log('Excel file uploaded:', file.name);
        this.excelFile = file;
      } else {
        this.comman.toster('warning', 'Please upload a valid Excel file.');
      }
    }
  }

  onSubmit(form: any) {
    //========// Add assembly code //========//
    if (form.valid) {
      this.formObj.is_active = this.formObj.is_active ? 1 : 0;
      if (this.assemblyType == 'Add') {
        const formData = new FormData();
        formData.append('name', this.formObj.name);
        formData.append('model_id', this.formObj.model_id);
        formData.append('assembly_no', this.formObj.assembly_no);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.excelFile) {
          formData.append('partExcel', this.excelFile);
        }
        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.addAssembly(formData).subscribe((res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
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
        formData.append('assembly_no', this.formObj.assembly_no);
        formData.append('description', this.formObj.description);
        formData.append('is_active', this.formObj.is_active.toString());

        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.service.editAssembly(formData, this.assemblyId).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
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

  demoImport() {
    this.service.demoAssemblyEXCL().subscribe((res: any) => {
      if (res.success) {
        const link = document.createElement('a');
        link.href = res.data;
        link.target = '_blank';
        link.download = 'sample_excel';
        link.click();
      }
      console.log("res", res);
    })
  }
}
