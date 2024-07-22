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
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  getAllOrder: any = [];
  p: number = 1;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    if (this.userData?.role_name == 'Dealer') {
      this.serchObj.dealer_id = this.userData.id;
    }
    this.getCatalogue(this.serchObj);
  }


  getCatalogue(obj: any) {
    this.service.getOrder(obj).subscribe((res: any) => {
      if (res.success) {
        this.getAllOrder = res.data;
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  selectedRow(item: any) {
    console.log(item);
    this.router.navigate(['/order-detail', item.id], {
      queryParams: { type: 'Order' }
    });
  }

  // downloadPdf(url: string) {
  //   this.http.get(url, { responseType: 'blob' }).subscribe((response: Blob) => {
  //     const blob = new Blob([response], { type: 'application/pdf' });
  //     FileSaver.saveAs(blob, 'downloadedFile.pdf');
  //   });
  // }

  downloadPdf(poPdf: string) {
    if (poPdf && poPdf != '') {
      console.log('Downloading PDF:', poPdf);
      const link = document.createElement('a');
      link.href = poPdf;
      link.target = '_blank';
      link.download = 'purchase_order.pdf';
      link.click();
    } else {
      this.comman.toster('warning', "PDF url not found")
    }
  }

  resetForm(form: any) {
    form.resetForm();
    this.getCatalogue({});
  }
}
