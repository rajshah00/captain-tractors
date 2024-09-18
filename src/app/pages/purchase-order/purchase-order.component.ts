import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  // @ViewChild(NgSelectComponent) ngSelect!: NgSelectComponent;
  @ViewChild('ngSelectContainer', { static: false }) ngSelectContainer!: ElementRef;
  @ViewChild('ngSelect', { static: false }) ngSelect: ElementRef | any;
  @ViewChild('chassisSelect') chassisSelect: NgSelectComponent | any;

  formObj: any = {
    order_type: '',
    entry_type: 'Manual Entry',
    mode_of_dispatch: '',
    chassis_number: null,
    parts: []
  };
  partList: any = [];
  missing_parts: any = [];
  progress: number = 0;
  showProgress: boolean = false;
  chassisList: any = [];
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  todayDate: any = new Date();

  partListOption: any = [];
  partListOptionEx: any = [];
  bufferSize = 10;
  allParts: any;
  loading = false;
  isLoading = false;
  page = 1;
  pageNum = 1;
  pageSize = 10; // Number of items per page
  query = '';
  endReached = false;
  ChassisNumber: any = {};
  serchBox: any;
  partNumber: any = {};

  isDropdownOpen = false;
  selectedParts: any;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.formObj.entry_type = params['type'];
      };
    });
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.formObj.po_number = this.userData.code + '/' + year + month;
    console.log(this.formObj.po_number);

    this.addRow();
    this.getChassisList();
    this.fetchParts();
    // this.getPartList();
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

  handleFiles(files: FileList) {
    if (files.length) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        console.log('Excel file uploaded:', file.name);
        this.readExcelFile(file);
      } else {
        this.comman.toster('warning', 'Please upload a valid Excel file.');
      }
    }
  }

  readExcelFile(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (event: any) => {
      const binaryData: string = event.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });

      // Assuming you want to read the first sheet
      const sheetName: string = workbook.SheetNames[0];
      const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Converting the sheet data to JSON
      const data = XLSX.utils.sheet_to_json(sheetData);
      console.log('Excel Data:', data);
      this.uploadFile(file, data);
    };

    reader.onerror = (error) => {
      console.error('Error reading Excel file:', error);
      this.comman.toster('error', 'Error reading Excel file.');
    };
  }

  //========// Import Part Data Progress //========//
  uploadFile(file: File, data: any) {
    this.showProgress = true;
    this.formObj.file = file;
    this.progress = 0;
    const simulateUpload = () => {
      if (this.progress < 100) {
        this.progress += 5; // Adjust the increment as needed
      } else {
        clearInterval(uploadInterval);
        this.comman.toster('success', 'Upload complete!');
        let obj = {
          parts: data
        }
        this.service.importExcel(obj).subscribe((res: any) => {
          if (res.success) {
            this.partListOptionEx = [...this.partListOptionEx, ...res.data.existingParts];
            this.selectedParts = res.data.existingParts;
            setTimeout(() => {
              this.comman.toster('success', res.message);
            }, 200);
          } else {
            this.comman.toster('warning', res.message)
          }
        })
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
          this.router.navigate(['/order-conform'], { queryParams: { id: res.data?.id } },)
        } else {
          this.comman.toster('warning', res.message)
        }
      })
    }
  }

  //========// Get All Modal //========//
  getChassisList(query: string = '', page: number = 1) {
    this.isLoading = true;
    let obj = {
      search: this.serchBox,
      page: page,
      size: this.pageSize
    };

    this.service.ChassisNumberList(obj).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length === 0) {
          this.endReached = true;
        } else {
          this.chassisList = [...this.chassisList, ...response.data];
          this.pageNum++;
        }
      }
      this.isLoading = false;
    });
  }


  fetchMoreChassis() {
    if (!this.isLoading && !this.endReached) {
      this.getChassisList(this.query, this.pageNum);
    }
  }


  //========// Get All Parts //========//
  getPartList() {
    this.service.getAllParts({}).subscribe((res: any) => {
      if (res.success) {
        this.allParts = res.data;
        this.partListOption = this.allParts.slice(0, this.bufferSize);
      }
    })
  }

  //========// Store Order //========//
  sapeParts(form: any) {
    form.submitted = true
    if (form.form.valid) {
      let obj: any = {
        "user_id": this.userData.id,
        "po_number": this.formObj.po_number,
        "parts": []
      }
      this.partList.forEach((item: any) => {
        if (item.qty > 0) {
          obj.parts.push(item)
        }
      });

      if (obj.parts && obj.parts.length) {
        this.service.addToCart(obj).subscribe((res: any) => {
          if (res.success) {
            localStorage.setItem('order_detail', JSON.stringify(this.formObj));
            this.router.navigate(['/add-to-cart'])
            this.comman.toster('success', res.message);
          } else {
            this.comman.toster('warning', res.message)
          }
        })
      } else {
        this.comman.toster('warning', "Plese select quantities and move items to a cart")
      }
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
      if (res.success && res.data.user_cart_part.length) {
        console.log("res", res);
        this.partList = []
        for (let i in res.data.user_cart_part) {
          this.partListOption.push(res.data.user_cart_part[i].part);
          this.partList.push({
            part_id: res.data.user_cart_part[i].part?.id,
            description: res.data.user_cart_part[i].part?.description,
            moq: res.data.user_cart_part[i].part?.moq,
            qty: res.data.user_cart_part[i].qty
          })
        }
      } else {
        this.comman.toster('warning', "Your cart is empty!")
      }
    })
  }

  onChangePart(partNo: any, ind: any, event: any) {
    this.partNumber = event;

    if (partNo) {
      let part: any = this.partListOption.find((part: any) => part.id === partNo);
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

  fetchMore() {
    if (!this.loading && !this.endReached) {
      this.fetchParts(this.query, this.page);
    }
  }

  fetchParts(query: string = '', page: number = 1) {
    this.loading = true;
    let obj = {
      search: query,
      page: page,
      size: this.pageSize
    }

    this.service.getAllParts(obj).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length === 0) {
          this.endReached = true;
        } else {
          if (query) {
            this.partListOptionEx = response.data;
            this.partListOption = response.data;
          } else {
            this.partListOptionEx = [...this.partListOptionEx, ...response.data];
            this.partListOption = [...this.partListOption, ...response.data];
          }
          this.page++;
        }
      }
      this.loading = false;
    });
  }

  onSearch(event: any) {
    if (event.term.length >= 1) {
      this.fetchParts(event.term);
    }
  }

  onChangeChassisNumber(item: any) {
    this.ChassisNumber = item;
  }

  copyText(item: any) {
    console.log("item", this.ChassisNumber);
    if (item) {
      const tempInput = document.createElement('input');
      tempInput.value = item;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      this.comman.toster('success', "Text copied to clipboard!");
      // Optionally provide feedback to the user
      // alert('Text copied to clipboard!');
    } else {
      this.comman.toster('warning', "Plese select any item")
    }

  }



  toggleDropdown() {
    if (this.chassisSelect.isOpen) {
      this.chassisSelect.close();
    } else {
      this.chassisSelect.open();
    }
  }

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value == '') {
      this.getChassisList();
    }
  }

  onSearchClick() {
    this.isLoading = true;
    let obj = {
      search: this.serchBox,
      page: 1,
      size: this.pageSize
    };

    this.service.ChassisNumberList(obj).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length === 0) {
          this.endReached = true;
        } else {
          this.chassisList = response.data;
          this.pageNum++;
        }
      }
      this.isLoading = false;
    });
    // this.chassisSelect.filter(this.serchBox);
  }

  onClear() {
    this.serchBox = '';
    this.onSearchClick();
  }

  submitOrder(form: any) {
    form.submitted = true
    if (form.form.valid) {
      this.partList.forEach((item: any) => {
        this.formObj.parts.push({
          "part_id": item.part_id,
          "qty": item.qty,
        })
      });

      this.service.saveOrder(this.formObj).subscribe((res: any) => {
        if (res.success) {
          localStorage.removeItem('order_detail');
          this.router.navigate(['/order-conform'], { queryParams: { id: res.data?.id } },)
          this.comman.toster('success', res.message);
        } else {
          this.comman.toster('warning', res.message)
        }
      })
    }
  }


  incrementEx(ind: any): void {
    if (this.selectedParts[ind].qty < 100) {
      this.selectedParts[ind].qty += 1;
    }
  }

  decrementEx(ind: any): void {
    if (this.selectedParts[ind].qty > 0 && this.selectedParts[ind].qty < 100) {
      this.selectedParts[ind].qty -= 1;
    }
  }

  onChangePartEx(partNo: any, ind: any, event: any) {
    if (partNo) {
      let part: any = this.partListOptionEx.find((part: any) => part.id === partNo);
      this.selectedParts[ind].description = part.description;
      this.selectedParts[ind].moq = part.moq;
    } else {
      this.selectedParts[ind].description = '';
      this.selectedParts[ind].moq = '';
    }
  }


  saveToDraft() {
    let obj: any = {
      "user_id": this.userData.id,
      "po_number": this.formObj.po_number,
      "parts": []
    }
    for (let item of this.selectedParts) {
      if (item.qty > 0) {
        obj.parts.push({
          "part_id": item.id,
          "qty": item.qty,
          "price": item.price,
          "total": item.price
        })
      }
    }

    if (obj.parts && obj.parts.length) {
      this.service.saveAsDraft(obj).subscribe((res: any) => {
        if (res.success) {
          this.getCartList();
          this.comman.toster('success', res.message);
        } else {
          this.comman.toster('warning', res.message)
        }
      })
    } else {
      this.comman.toster('warning', "Plese select quantities and move items to a cart")
    }
  }

  onPartClear() {
    this.serchBox = '';
    this.fetchParts(this.query, this.page);
  }


  changeType() {
    this.formObj.po_number = "";
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.formObj.po_number = this.formObj.order_type + '/' + this.userData.code + '/' + year + month;
  }
}
