import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  formObj: any = {
    order_type: '',
    entry_type: 'Manual Entry',
    mode_of_dispatch: '',
    chassis_number: ''
  };
  partList: any = [];
  missing_parts: any = [];
  progress: number = 0;
  showProgress: boolean = false;
  chassisList: any;
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  todayDate: any = new Date();
  partListOption: any;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    this.addRow();
    this.getModalList();
    this.getPartList();
  }

  addRow() {
    this.partList.push({ part_id: null, description: '', moq: '', qty: 0 })
  }

  increment(ind: any): void {
    if (this.partList[ind].qty < 100) {
      this.partList[ind].qty += 1;
    }
  }

  decrement(ind: any): void {
    if (this.partList[ind].qty > 0 && this.partList[ind].qty < 100) {
      this.partList[ind].qty -= 1;
    }
  }

  removeRow(ind: any) {
    this.partList.splice(ind, 1);
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

  handleFiles(files: any) {
    if (files.length) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        console.log('Excel file uploaded:', file.name);
        this.uploadFile(file);
      } else {
        this.comman.toster('warning', 'Please upload a valid Excel file.');
      }
    }
  }

  //========// Import Part Data Progress //========//
  uploadFile(file: File) {
    this.showProgress = true;
    this.formObj.file = file;
    this.progress = 0;
    const simulateUpload = () => {
      if (this.progress < 100) {
        this.progress += 5; // Adjust the increment as needed
      } else {
        clearInterval(uploadInterval);
        this.comman.toster('success', 'Upload complete!');
        // this.progress = 0;
        // this.showProgress = false;
      }
    };
    const uploadInterval = setInterval(simulateUpload, 100);
  }

  //========// Import Part Data //========//
  importData(form: any) {
    form.submitted = true
    if (form.form.valid) {
      const formData = new FormData();
      formData.append('file', this.formObj.file);
      formData.append('order_type', this.formObj.order_type);
      formData.append('entry_type', this.formObj.entry_type);
      formData.append('mode_of_dispatch', this.formObj.mode_of_dispatch);
      formData.append('chassis_number', this.formObj.chassis_number);
      this.service.uploadExcel(formData).subscribe((res: any) => {
        if (res.success) {
          this.missing_parts = res.data.missing_parts;
          this.progress = 0;
          this.showProgress = false;
          this.comman.toster('success', res.message);
        } else {
          this.comman.toster('warning', res.message)
        }
      })
    }
  }

  //========// Get All Modal //========//
  getModalList() {
    this.service.ChassisNumberList({}).subscribe((res: any) => {
      if (res.success) {
        this.chassisList = res.data
      }
    })
  }

  //========// Get All Parts //========//
  getPartList() {
    this.service.getAllParts({}).subscribe((res: any) => {
      if (res.success) {
        this.partListOption = res.data
      }
    })
  }

  //========// Store Order //========//
  sapeParts(form: any) {
    form.submitted = true
    if (form.form.valid) {
      this.formObj.dealer_id = this.userData?.id;
      this.formObj.parts = this.partList;
      console.log("this.formObj", this.formObj);
      this.service.saveOrder(this.formObj).subscribe((res: any) => {
        if (res.success) {
          this.formObj.order_type = 'VOR';
          this.formObj.entry_type = 'Manual Entry';
          this.partList = []
          this.addRow();
          this.comman.toster('success', res.message);
        } else {
          this.comman.toster('warning', res.message)
        }
      })
    } else {
      this.comman.toster('error', 'Please enter all valid feilds')
    }
  }

  //========// Get All Cart List //========//
  getCartList() {
    let obj = {
      user_id: this.userData.id
    }
    this.service.cartList(obj).subscribe((res: any) => {
      if (res.success && res.data.length) {
        console.log("res", res);
        this.partList = []
        for (let i in res.data) {
          this.partList.push({
            part_id: res.data[i].part?.id,
            description: res.data[i].part?.description,
            moq: res.data[i].part?.moq,
            qty: res.data[i].qty
          })
        }
      }
    })
  }

  onChangePart(partNo: any, ind: any) {
    if (partNo) {
      let part = this.partListOption.find((part: any) => part.id === partNo);
      this.partList[ind].description = part.description;
      this.partList[ind].moq = part.moq;
    } else {
      this.partList[ind].description = '';
      this.partList[ind].moq = '';
    }
  }

  demoImport() {
    this.service.demoEXCL().subscribe((res: any) => {
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
