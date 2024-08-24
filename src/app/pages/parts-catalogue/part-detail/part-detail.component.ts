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
  productId: any;
  productTypeId: any;
  categoryList: any;
  pdfUrl: any;

  constructor(
    private route: ActivatedRoute,
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.modalList();
    this.route.queryParams.subscribe(params => {
      if (params['name'] || params['id']) {
        this.productName = params['name'];
        this.productId = params['id'];
        this.productTypeId = params['producrId'];
        this.service.getModalById(this.productId).subscribe((res: any) => {
          if (res.success) {
            this.pdfUrl = res.data.image;
          }
        })
      };
    });
  }

  //========// Get All Modal //========//
  modalList() {
    this.service.model_categoryList({}).subscribe((res: any) => {
      if (res.success) {
        this.categoryList = res.data
      }
    })
  }

}
