import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  modalList: any;
  partList: any = [];
  p: number = 1;
  is_show_part_cat: boolean = false;
  is_show_part_ord: boolean = false;
  private openAccordions: Set<number> = new Set<number>();
  userData: any;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }
  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('profile') || '')
    this.getModalList();
  }

  //========// Get All Modal //========//
  getModalList() {
    if (this.userData.role_name == 'Dealer') {
      let obj = {
        id: this.userData.id
      }
      this.service.dealerwiseModal(obj).subscribe((res: any) => {
        if (res.success) {
          this.modalList = res.data.models;
        }
      })
    } else {
      this.service.ModalList({}).subscribe((res: any) => {
        if (res.success) {
          this.modalList = res.data
        }
      })
    }
  }

  getParts(item: any, index: any) {
    if (this.openAccordions.has(index)) {
      this.openAccordions.delete(index);
    } else {
      this.service.modalIdPartGet({ "model_id": item.id }).subscribe((res: any) => {
        if (res.success) {
          this.partList = res.data
        }
      })
      this.openAccordions.add(index);
    }
  }

  toggelSection(type: any) {
    if (type == 'Catalogue') {
      this.is_show_part_cat = true;
      this.is_show_part_ord = false;
    } else {
      this.is_show_part_cat = false;
      this.is_show_part_ord = true;
      this.router.navigate(['/catalogue-and-ordering'])
    }

  }

  downloadPdf(poPdf: string) {
    if (poPdf && poPdf != '') {
      const link = document.createElement('a');
      link.href = poPdf;
      link.target = '_blank';
      link.download = 'purchase_order.pdf';
      link.click();
    } else {
      this.comman.toster('warning', "PDF url not found")
    }
  }
}
