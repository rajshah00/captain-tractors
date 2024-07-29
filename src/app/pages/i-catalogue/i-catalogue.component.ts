import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-i-catalogue',
  templateUrl: './i-catalogue.component.html',
  styleUrls: ['./i-catalogue.component.scss']
})
export class ICatalogueComponent implements OnInit {
  @ViewChild('pdfInput') pdfInput: ElementRef | any;
  p: number = 1;
  popupType: any;
  dealers: any = [];
  selectedDealers: any = [];
  pdf: any = null;
  catalogueList: any = [];
  item_id: any;
  catalogueDetail: any = {};
  catalogue_name: any;
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
    this.service.catalogueList({}).subscribe((res: any) => {
      if (res.success) {
        this.catalogueList = res.data;
      }
    })
  }

  //========// Open Popup  //========//
  openPop(type: any, item: any) {
    this.selectedDealers = []
    this.catalogue_name = '';
    this.pdfInput.nativeElement.value = '';
    if (type == 'Edit') {
      this.item_id = item.id;
      this.catalogue_name = item.name;
      item.i_catalogue_dealer.forEach((element: any) => {
        this.selectedDealers.push(element.dealer_id)
      });
    }
    console.log("this.selectedDealers", this.selectedDealers);

    this.popupType = type;
    $('#circularPopup').modal('show');
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
        formData.append('name', this.catalogue_name);
        this.selectedDealers.forEach((dealerId: any) => {
          formData.append('dealers[]', dealerId.toString());
        });

        this.service.addCatalogue(formData).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getCircularList();
            $('#circularPopup').modal('hide');
            form.reset();
          } else {
            this.comman.toster('warning', res.message)
          }
        });
      } else {
        const formData = new FormData();
        formData.append('pdf_or_img', this.pdf);
        formData.append('name', this.catalogue_name);
        this.selectedDealers.forEach((dealerId: any) => {
          formData.append('dealers[]', dealerId.toString());
        });

        this.service.editCatalogue(formData, this.item_id).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getCircularList();
            $('#circularPopup').modal('hide');
            form.reset();
          } else {
            this.comman.toster('warning', res.message)
          }
        });
      }
    }
  }

  //========// Delete function//========//
  delete(item: any) {
    this.service.deleteCatalogue(item.id).subscribe((res: any) => {
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
    this.catalogueDetail = item;
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
