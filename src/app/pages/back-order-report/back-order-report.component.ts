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
  getAllBackOrder: any;
  p: number = 1;
  allCountryList: any;
  dealerList: any;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }
  ngOnInit(): void {
    this.getCatalogue({});
    this.getDealerList();
    this.getCountryList();
  }

  getCatalogue(obj: any) {
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
    this.service.countryList({}).subscribe((res: any) => {
      if (res.success) {
        this.allCountryList = res.data;
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

  resetForm(form: any) {
    form.resetForm();
    this.getCatalogue({});
  }
}
