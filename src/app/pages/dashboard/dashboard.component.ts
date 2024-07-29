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

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }
  ngOnInit(): void {
    this.getModalList();
  }

  //========// Get All Modal //========//
  getModalList() {
    this.service.ModalList({}).subscribe((res: any) => {
      if (res.success) {
        this.modalList = res.data
      }
    })
  }

  getParts(item: any) {
    this.service.modalIdPartGet({ "model_id": item.id }).subscribe((res: any) => {
      if (res.success) {
        this.partList = res.data
      }
    })
  }

  toggelSection(type: any) {
    if (type == 'Catalogue') {
      this.is_show_part_cat = true;
      this.is_show_part_ord = false;
    } else {
      this.is_show_part_cat = false;
      this.is_show_part_ord = true;
    }

  }
}
