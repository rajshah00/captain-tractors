import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  selectAll: any;
  partList: any = [];
  order_id: any;
  orderDetail: any = {};
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  file: any;
  constructor(
    private route: ActivatedRoute,
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.order_id = params.get('id') || '';

      if (this.order_id) {
        this.route.queryParams.subscribe(params => {
          const type = params['type'];
          if (type == 'Order') {
            this.getDetail();
          } else {
            this.getBackOrderDetail();
          }
        });
      }
    });
  }

  // selecte multi check box function
  selected() {
    console.log("selectAll", this.selectAll);
    if (this.selectAll) {
      this.partList.forEach((item: any) => {
        item.is_approve = true;
      });
    } else {
      this.partList.forEach((item: any) => {
        item.is_approve = false;
      });
    }
  }

  getDetail() {
    this.service.getOrderDetail(this.order_id).subscribe((res: any) => {
      if (res.success && res.data) {
        this.orderDetail = res.data;
        this.partList = res.data.order_details;
        this.partList.forEach((item: any) => {
          item.part_qty = parseFloat(item.part_qty);
          item.approve_qty = item.part_qty;
        });
        this.selectAll = true;
        this.selected();
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  getBackOrderDetail() {
    this.service.getBackOrderDetail(this.order_id).subscribe((res: any) => {
      if (res.success && res.data) {
        this.orderDetail = res.data;
        this.partList = res.data.order_details;
        this.partList.forEach((item: any) => {
          item.part_qty = parseFloat(item.part_qty);
          item.approve_qty = item.part_qty;
        });
        this.selectAll = true;
        this.selected();
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  approveOrder() {
    this.service.approve(this.order_id).subscribe((res: any) => {
      if (res.success) {
        this.getDetail();
        this.comman.toster('success', res.message);
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  rejectOrder() {
    this.service.reject(this.order_id).subscribe((res: any) => {
      if (res.success) {
        this.getDetail();
        this.comman.toster('success', res.message);
      } else {
        this.comman.toster('warning', res.message)
      }
    });
  }

  increment(ind: any, mainQty: any): void {
    if (this.partList[ind].approve_qty < mainQty) {
      this.partList[ind].approve_qty += 1;
    }
  }

  decrement(ind: any, mainQty: any): void {
    if (this.partList[ind].approve_qty > 0 && this.partList[ind].approve_qty <= mainQty) {
      this.partList[ind].approve_qty -= 1;
    }
  }

  approveOrderCtpl() {
    let obj: any = {
      order_detail: []
    };
    this.partList.forEach((item: any) => {
      obj.order_detail.push({
        order_detail_id: item.id,
        approve_qty: item.is_approve != true ? 0 : item.approve_qty
      })
    });

    this.service.approve(this.order_id, obj).subscribe((res: any) => {
      if (res.success) {
        this.getDetail();
        this.comman.toster('success', res.message);
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }

  onSubmit(): void {
    if (!this.file) {
      this.comman.toster('warning', "Please select pdf and upload")
      return;
    }

    const formData = new FormData();
    formData.append('po_pdf', this.file, this.file.name);
    this.service.poUpload(this.order_id, formData).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
      } else {
        this.comman.toster('warning', res.message)
      }
    })

  }

}
