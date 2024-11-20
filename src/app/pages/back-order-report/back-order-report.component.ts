import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-back-order-report',
  templateUrl: './back-order-report.component.html',
  styleUrls: ['./back-order-report.component.scss']
})
export class BackOrderReportComponent implements OnInit {
  serchObj: any = {};
  getAllBackOrder: any = [];
  p: number = 1;
  allCountryList: any = [];
  dealerList: any;
  brandList: any;
  allRegionList: any;
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }
  ngOnInit(): void {
    this.getCatalogue(this.serchObj);
    this.getCatalogue({});
    this.getDealerList();
    this.getRegionList()
    this.getBrandList();
  }

  getCatalogue(obj: any) {
    if (this.userData?.role_id == 3) {
      obj.dealer_id = this.userData.id;
    }
    this.service.getBackOrder(obj).subscribe((res: any) => {
      if (res.success) {
        this.getAllBackOrder = res.data;
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  selectedRow(item: any) {
    console.log(item);
    this.router.navigate(['/order-detail', item.id], {
      queryParams: { type: 'Back Order' }
    });
  }

  //========// Get All Country //========//
  getCountryList() {
    let obj = { region_id: this.serchObj.region_id }
    this.service.countryList(obj).subscribe((res: any) => {
      if (res.success) {
        this.allCountryList = res.data.country;
      }
    })
  }

  //========// Get All Region //========//
  getRegionList() {
    this.service.Region({}).subscribe((res: any) => {
      if (res.success) {
        this.allRegionList = res.data;
      }
    })
  }

  //========// Get All Dealer //========//
  getDealerList() {
    this.service.DealerList({}).subscribe((res: any) => {
      if (res.success) {
        this.dealerList = res.data
      }
    })
  }

  //========// get Brand List //========//
  getBrandList() {
    this.service.brandList({}).subscribe((res: any) => {
      if (res.success) {
        this.brandList = res.data;
      }
    })
  }

  resetForm(form: any) {
    form.resetForm();
    this.getCatalogue({});
  }

  export() {
    this.serchObj.export = 1;
    this.serchObj.export_type = "xlsx";
    this.service.getBackOrder(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        const link = document.createElement('a');
        link.href = res.data.file_url;
        link.target = '_blank';
        link.download = 'sample_excel';
        link.click();
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  getTotalQty(item: any) {
    let total = 0;
    item.backorder_details.forEach((it: any) => {
      total += parseFloat(it.part_qty)
    });

    return total;
  }
}
