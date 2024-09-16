import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-service-manuals',
  templateUrl: './service-manuals.component.html',
  styleUrls: ['./service-manuals.component.scss']
})
export class ServiceManualsComponent implements OnInit {
  @ViewChild('service_pdf') service_pdf: ElementRef | any;
  p: number = 1;
  popupType: any;
  selectedDealers: any;
  smList: any = [];
  dealers: any = [];
  item_id: any;
  pdf: any;
  smDetail: any = {};
  circular_name: any;
  isPdf: boolean = false;
  pdfUrl: any;
  imageUrl: any;
  userData: any = {};
  dateSelect: any;
  fileSizeError = false;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private sanitizer: DomSanitizer
  ) {

  }
  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('profile') || '');
    this.getSMList();
    this.getDealerList();
  }

  //========// Submit and save function  //========//
  onSubmit(form: any) {
    if (form.valid && !this.fileSizeError) {
      if (this.popupType == 'Add') {
        const formData = new FormData();
        formData.append('pdf_or_img', this.pdf);
        formData.append('name', this.circular_name);
        formData.append('date', this.dateSelect);
        this.selectedDealers.forEach((dealerId: any) => {
          formData.append('dealers[]', dealerId.toString());
        });

        this.service.addSM(formData).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getSMList();
            $('#serviceManualsPopup').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        });
      } else {
        const formData = new FormData();
        formData.append('name', this.circular_name);
        formData.append('date', this.dateSelect);
        this.selectedDealers.forEach((dealerId: any) => {
          formData.append('dealers[]', dealerId.toString());
        });
        if (this.pdf) {
          formData.append('pdf_or_img', this.pdf);
        }

        this.service.editSM(formData, this.item_id).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getSMList();
            $('#serviceManualsPopup').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        });
      }
    }
  }


  //========// Get All Dealer //========//
  getDealerList() {
    this.service.DealerList({}).subscribe((res: any) => {
      if (res.success) {
        this.dealers = res.data;
        this.selectAllForDropdownItems(this.dealers);
      }
    })
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items: any[]) => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  //========// get Brand List //========//
  getSMList() {
    this.service.smList({}).subscribe((res: any) => {
      if (res.success) {
        this.smList = res.data;
      }
    })
  }

  //========// Open Popup  //========//
  openPop(type: any, item: any) {
    this.selectedDealers = []
    this.service_pdf.nativeElement.value = '';
    if (type == 'Edit') {
      this.item_id = item.id;
      this.circular_name = item.name;
      this.dateSelect = item.date;
      item.service_manual_dealer.forEach((element: any) => {
        this.selectedDealers.push(element.dealer_id)
      });
    } else {
      this.circular_name = '';
      this.dateSelect = '';
    }
    console.log("this.selectedDealers", this.selectedDealers);

    this.popupType = type;
    $('#serviceManualsPopup').modal('show')
  }

  //========// File Select Function  //========//
  onFileChange(event: any) {
    const file = event.target.files[0];
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes

    if (file) {
      const fileType = file.type;
      const validFileTypes = ['application/pdf', 'image/jpeg','image/png'];
      if (validFileTypes.includes(fileType)) {
        this.pdf = file;
      } else {
        // Handle invalid file type
        this.comman.toster('warning', 'Invalid file type. Only PDF and JPG, PNG files are allowed.')
        event.target.value = '';
      }

      if (file && file.size > maxSize) {
        this.fileSizeError = true;
        event.target.value = null;
      } else {
        this.fileSizeError = false;
      }
    }
  }

  //========// Delete SM Function  //========//
  delete(item: any) {
    this.service.deleteSM(item.id).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getSMList();
      } else {
        this.comman.toster('warning', res.message)
      }
    }, (err: any) => {
      console.log(err);
      this.comman.toster('error', 'Ops! something went wrong please try again later')
    })
  }

  //========// Open Popup  //========//
  openPopVeiw(item: any) {
    this.smDetail = item;
    if (item.pdf_or_img && item.pdf_or_img.endsWith('.pdf')) {
      this.isPdf = true;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.pdf_or_img);
    } else {
      this.isPdf = false;
      this.imageUrl = item.pdf_or_img;
    }
    $('#exampleModal').modal('show')
  }

}
