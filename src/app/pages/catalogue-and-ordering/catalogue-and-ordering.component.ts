import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-catalogue-and-ordering',
  templateUrl: './catalogue-and-ordering.component.html',
  styleUrls: ['./catalogue-and-ordering.component.scss']
})
export class CatalogueAndOrderingComponent implements OnInit {
  formObj: any = {};
  serchObj: any = {};
  allCountryList: any = [];
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  getAllOrder: any = [];
  p: number = 1;
  dealerList: any = [];
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    if (this.userData?.role_id == 3) {
      this.serchObj.dealer_id = this.userData.id;
    }
    this.getCatalogue(this.serchObj);
    this.getDealerList();
    this.getCountryAllList();
  }


  //========// Get All Dealer //========//
  getDealerList() {
    this.service.DealerList({}).subscribe((res: any) => {
      if (res.success) {
        this.dealerList = res.data;
        this.dealerList.unshift({ id: '', name: 'ALL' })
      }
    })
  }

  getCountryAllList() {
    this.service.allCountryList({}).subscribe((res: any) => {
      if (res.success) {
        this.allCountryList = res.data
      }
    })
  }

  getCatalogue(obj: any) {
    this.service.getOrder(obj).subscribe((res: any) => {
      if (res.success) {
        this.getAllOrder = res.data;
        this.getAllOrder.forEach((item:any) => {
          item.file = '';
        });
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  selectedRow(item: any, event: Event): void {
    const targetElement = event.target as HTMLElement;
    
    // Ignore click if it originates from a checkbox or file input
    if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'LABEL') {
      return;
    }

    this.router.navigate(['/order-detail', item.id], {
      queryParams: { type: 'Order' }
    });
  }

  downloadPdf(poPdf: string) {
    if (poPdf && poPdf != '') {
      console.log('Downloading PDF:', poPdf);
      const link = document.createElement('a');
      link.href = poPdf;
      link.target = '_blank';
      link.download;
      link.click();
    } else {
      this.comman.toster('warning', "PDF url not found")
    }
  }

  resetForm(form: any) {
    form.resetForm();
    this.getCatalogue({});
  }

  getTotalQty(item: any) {
    let total = 0;
    item.order_details.forEach((it: any) => {
      total += parseFloat(it.part_qty)
    });

    return total;
  }

  onFileSelected(event: any, item: any) {
    const file: File = event.target.files[0];
    const maxSizeInMB = 20;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
    if (file) {
      if (file.size > maxSizeInBytes) {
        this.comman.toster('warning', `File size exceeds ${maxSizeInMB} MB limit. Please upload a smaller file.`);
        return;
      }
  
      const formData = new FormData();
      formData.append('pi_upload_dealer', file);
      this.service.scanPoUpload(item.id, formData).subscribe(
        (res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getCatalogue({});
          } else {
            this.comman.toster('warning', res.message);
          }
        },
        (err: any) => {
          console.log(err);
          this.comman.toster('error', 'Oops! Something went wrong. Please try again later.');
        }
      );
    }
  }
  
}
