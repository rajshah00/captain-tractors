import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-camel-reports',
  templateUrl: './camel-reports.component.html',
  styleUrls: ['./camel-reports.component.scss']
})
export class CamelReportsComponent implements OnInit {
  serchObj: any = {
    current_stage: ''
  };
  getAllBackOrder: any = [];
  p: number = 1;
  allCountryList: any = [];
  dealerList: any;
  brandList: any;
  allRegionList: any;
  continentList: any;
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  getAllOrderReport: any = [];
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    this.getBrandList();
    this.getContinent();
    this.getDealerList();
  }

  getContinent() {
    this.service.continent({}).subscribe((res: any) => {
      if (res.success) {
        this.continentList = res.data;
      }
    })
  }

  //========// Get All Region //========//
  getRegionList() {
    let obj = { continent_id: this.serchObj.continent_id }
    this.service.Region(obj).subscribe((res: any) => {
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
  //========// Get All Country //========//
  getCountryList() {
    let obj = { region_id: this.serchObj.region_id }
    this.service.allCountryList(obj).subscribe((res: any) => {
      if (res.success) {
        this.allCountryList = res.data;
      }
    })
  }

  getReport() {
    delete this.serchObj.export;
    delete this.serchObj.export_type;
    this.service.getReportOrder(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        this.getAllOrderReport = res.data;
        this.getAllOrderReport.forEach((item: any) => {
          if (item.backorder_details) {
            item.order_details = item.backorder_details;
          }
        });

      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  export() {
    this.serchObj.export = 1;
    this.serchObj.export_type = "xlsx";
    this.service.getReportOrder(this.serchObj).subscribe((res: any) => {
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
    item.order_details.forEach((it: any) => {
      total += parseFloat(it.part_qty)
    });

    return total;
  }

  resetForm(form: any) {
    this.getAllOrderReport = [];
    this.serchObj = {}
    this.serchObj.current_stage = "";
  }
}
