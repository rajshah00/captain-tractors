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
    order_type: 'VOR',
    entry_type: 'Manual Entry',
    mode_of_dispatch: '',
    chassis_number: ''
  };
  partList: any = [];

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
        alert('Please upload a valid Excel file.');
      }
    }
  }

  uploadFile(file: File) {
    this.showProgress = true;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true); // Replace with your upload URL

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        this.progress = Math.round(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        alert('Upload complete!');
        this.progress = 0;
        this.showProgress = false;
      } else {
        alert('Upload failed.');
      }
    };

    xhr.onerror = () => {
      alert('Upload failed.');
    };

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
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
