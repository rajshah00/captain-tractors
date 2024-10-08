import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  @ViewChild('po_pdf') po_pdf: ElementRef | any;
  selectAll: any;
  partList: any = [];
  order_id: any;
  orderDetail: any = {};
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  file: any;
  ordertype: any;
  tracking_number: any = '';
  isDesibled: boolean = false;
  any_comment: any;
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
          this.ordertype = params['type'];
          if (this.ordertype == 'Order') {
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
        this.tracking_number = res.data.tracking_number != null ? res.data.tracking_number : '';
        this.isDesibled = this.tracking_number ? true : false;
        this.partList = res.data.order_details;
        this.orderDetail.total_qty = this.getTotalQty(this.partList);
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
        this.tracking_number = res.data.tracking_number != null ? res.data.tracking_number : '';
        this.isDesibled = this.tracking_number ? true : false;
        this.partList = res.data.backorder_details;
        this.orderDetail.total_qty = this.getTotalQty(this.partList);
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
      any_comment: this.any_comment,
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

  onSubmit(type: any): void {
    const formData = new FormData();
    if (type == 'Reset') {
      formData.append('po_pdf', "");
      formData.append('type', "reset");
      formData.append('tracking_number', this.tracking_number);
    } else {
      formData.append('po_pdf', this.file, this.file.name);
      formData.append('type', "upload");
      formData.append('tracking_number', this.tracking_number);
    }

    this.service.poUpload(this.order_id, formData).subscribe((res: any) => {
      if (res.success) {
        this.po_pdf.nativeElement.value = '';
        if (this.ordertype == 'Order') {
          this.getDetail();
        } else {
          this.getBackOrderDetail();
        }
        this.comman.toster('success', res.message);
      } else {
        this.comman.toster('warning', res.message)
      }
    })

  }

  approveOrderDealer() {
    let obj: any = {
      order_detail: []
    };
    this.partList.forEach((item: any) => {
      obj.order_detail.push({
        order_detail_id: item.id,
        approve_qty: item.part_qty
      })
    });

    this.service.approveByDealer(this.order_id, obj).subscribe((res: any) => {
      if (res.success) {
        this.router.navigate(['/order-detail', res.data.id], {
          queryParams: { type: 'Order' }
        });
        this.comman.toster('success', res.message);
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  onQuantityChange(item: any): void {
    if (item.approve_qty > item.part_qty) {
      item.approve_qty = item.part_qty;  // Set to maximum allowed value
    } else if (item.approve_qty < 1) {
      item.approve_qty = 1;  // Set to minimum allowed value
    }
  }

  getTotalQty(item: any) {
    let total = 0;
    item.forEach((it: any) => {
      total += parseFloat(it.part_qty)
    });

    return total;
  }

}
