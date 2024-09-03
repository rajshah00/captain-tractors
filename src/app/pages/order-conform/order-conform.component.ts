import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-order-conform',
  templateUrl: './order-conform.component.html',
  styleUrls: ['./order-conform.component.scss']
})
export class OrderConformComponent implements OnInit {
  orderDetail: any = {};

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private route: ActivatedRoute,
  ){

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.idByOrder(params['id'])
      }
    });
  }

    //========// Get All Products Type //========//
    idByOrder(id:any) {
      this.service.getIdByOrder(id).subscribe((res: any) => {
        if (res.success) {
          this.orderDetail = res.data
        }
      })
    }

}
