import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-i-circular',
  templateUrl: './i-circular.component.html',
  styleUrls: ['./i-circular.component.scss']
})
export class ICircularComponent implements OnInit {
  p: number = 1;
  popupType: any;
  dealers: any = [];
  selectedDealers: any = [];
  pdf: any = null;
  circularList: any = [];
  item_id: any;
  circularDetail: any = {};
  circular_name: any;
  isPdf: boolean = false;
  pdfUrl: any;
  imageUrl: any;
  userData: any = {};
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private sanitizer: DomSanitizer
  ) {

  }


  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('profile') || '');
    this.getCircularList();
    this.getDealerList();
  }

  //========// Get All Dealer //========//
  getDealerList() {
    this.service.DealerList({}).subscribe((res: any) => {
      if (res.success) {
        this.dealers = res.data
      }
    })
  }

  //========// get Brand List //========//
  getCircularList() {
    this.service.circularList({}).subscribe((res: any) => {
      if (res.success) {
        this.circularList = res.data;
      }
    })
  }

  //========// Open Popup  //========//
  openPop(type: any, item: any) {
    this.selectedDealers = []
    this.circular_name = '';
    if (type == 'Edit') {
      this.item_id = item.id;
      this.circular_name = item.name;
      item.i_circular_dealer.forEach((element: any) => {
        this.selectedDealers.push(element.dealer_id)
      });
    }
    console.log("this.selectedDealers", this.selectedDealers);

    this.popupType = type;
    $('#circularPopup').modal('show')
  }

  //========// File Select Function  //========//
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validFileTypes = ['application/pdf', 'image/jpeg'];
      if (validFileTypes.includes(fileType)) {
        this.pdf = file;
      } else {
        // Handle invalid file type
        this.comman.toster('warning', 'Invalid file type. Only PDF and JPG files are allowed.')
        event.target.value = '';
      }
    }
  }

  //========// Submit and save function  //========//
  onSubmit(form: any) {
    if (form.valid) {
      if (this.popupType == 'Add') {
        const formData = new FormData();
        formData.append('pdf_or_img', this.pdf);
        formData.append('name', this.circular_name);
        this.selectedDealers.forEach((dealerId: any) => {
          formData.append('dealers[]', dealerId.toString());
        });

        this.service.addCircular(formData).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getCircularList();
            $('#circularPopup').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        });
      } else {
        const formData = new FormData();
        formData.append('pdf_or_img', this.pdf);
        formData.append('name', this.circular_name);
        this.selectedDealers.forEach((dealerId: any) => {
          formData.append('dealers[]', dealerId.toString());
        });

        this.service.editCircular(formData, this.item_id).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getCircularList();
            $('#circularPopup').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        });
      }
    }
  }

  //========// Delete function//========//
  delete(item: any) {
    this.service.deleteCircular(item.id).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getCircularList();
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
    this.circularDetail = item;
    if (item.pdf_or_img && item.pdf_or_img.endsWith('.pdf')) {
      this.isPdf = true;
      // this.pdfUrl = item.pdf_or_img;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.pdf_or_img);
    } else {
      this.isPdf = false;
      this.imageUrl = item.pdf_or_img;
    }
    $('#exampleModal').modal('show')
  }

}
