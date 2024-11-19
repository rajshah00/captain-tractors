import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-part-detail',
  templateUrl: './part-detail.component.html',
  styleUrls: ['./part-detail.component.scss']
})
export class PartDetailComponent implements OnInit {
  productName: any;
  modal_Id: any;
  productTypeId: any;
  categoryList: any;
  pdfUrl: any;
  main_category_id:any;
  partDetail: any = {};
  constructor(
    private route: ActivatedRoute,
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['name'] || params['id']) {
        this.productName = params['name'];
        this.modal_Id = params['id'];
        this.productTypeId = params['producrId'];
        this.modalList();
        this.service.getModalById(this.modal_Id).subscribe((res: any) => {
          if (res.success) {
            this.partDetail = res.data;
            this.pdfUrl = res.data.pdf;
            this.main_category_id = res.data.main_category_id
          }
        })
      };
    });
  }

  //========// Get All Modal //========//
  modalList() {
    this.service.model_category_by_id({ model_id: this.modal_Id }).subscribe((res: any) => {
      if (res.success) {
        this.categoryList = res.data
      }
    })
  }

}
