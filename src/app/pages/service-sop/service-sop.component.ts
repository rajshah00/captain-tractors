import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-service-sop',
  templateUrl: './service-sop.component.html',
  styleUrls: ['./service-sop.component.scss']
})
export class ServiceSOPComponent implements OnInit {
  @ViewChild('sop_pdf') sop_pdf: ElementRef | any;
  p: number = 1;
  popupType: any;
  dealers: any;
  sopList: any = [];
  selectedDealers: any = [];
  circular_name: any;
  item_id: any;
  pdf: any;
  sopDetail: any = {};
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
    this.getSOPList();
    this.getDealerList();
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

  //========// get Service SOP List //========//
  getSOPList() {
    this.service.sopList({}).subscribe((res: any) => {
      if (res.success) {
        this.sopList = res.data;
      }
    })
  }

  //========// Open Popup  //========//
  openPop(type: any, item: any) {
    this.selectedDealers = []
    this.circular_name = '';
    this.dateSelect = '';
    this.sop_pdf.nativeElement.value = '';
    if (type == 'Edit') {
      this.item_id = item.id;
      this.circular_name = item.name;
      this.dateSelect = item.date;
      item.service_sop_dealer.forEach((element: any) => {
        this.selectedDealers.push(element.dealer_id)
      });
    }
    this.popupType = type;
    $('#serviceSOPPopup').modal('show');
  }

  //========// File Select Function  //========//
  onFileChange(event: any) {
    const file = event.target.files[0];
    const maxSize = 150 * 1024 * 1024; // 20MB in bytes

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

        this.service.addSOP(formData).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getSOPList();
            $('#serviceSOPPopup').modal('hide');
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
        this.service.editSOP(formData, this.item_id).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getSOPList();
            $('#serviceSOPPopup').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        });
      }
    }
  }

  //========// Delete function //========//
  delete(item: any) {
    this.service.deleteSOP(item.id).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getSOPList();
      } else {
        this.comman.toster('warning', res.message)
      }
    }, (err: any) => {
      console.log(err);
      this.comman.toster('error', 'Ops! something went wrong please try again later')
    })
  }

  //========// Open Veiw Popup  //========//
  openPopVeiw(item: any) {
    this.sopDetail = item;
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
