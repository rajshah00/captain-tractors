import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

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
  isUtility: boolean = false;
  any_comment: any;
  utility_po: any;
  mergedPdfUrl: any;
  isMini: boolean = false;
  loading = false;
  pageSize = 10; // Number of items per page
  endReached = false;
  query = '';
  page = 1;
  partListOption: any = [];
  partListOptionEx: any = [];
  partNumber: any;
  pdf_name: any;
  constructor(
    private route: ActivatedRoute,
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private sanitizer: DomSanitizer
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
        this.fetchParts();
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
        this.pdf_name = res.data.po_pdf ? res.data.po_pdf.split('/pdf/')[1] : '';
        this.tracking_number = res.data.tracking_number != null ? res.data.tracking_number : '';
        this.isDesibled = this.tracking_number ? true : false;
        this.partList = res.data.order_details;
        this.partList.forEach((item: any) => {
          item.part_qty = parseFloat(item.part_qty);
          item.approve_qty = item.part_qty;
          item.part_price = parseFloat(item.part.price || 0)
          this.partListOption.push(item.part);
        });
        this.partList.forEach((item: any) => {
          if (item.part && item.part.main_category_id !== undefined && item.part.main_category_id === 1) {
            this.isUtility = true;
          }
          if (item.part && item.part.main_category_id !== undefined && item.part.main_category_id === 2) {
            this.isMini = true;
          }
        });
        if (this.userData?.role_name == 'CTPL') {
          this.partList = this.partList.filter((item: any) => item.part.main_category_id !== 1);
        }
        console.log(this.isUtility);
        this.orderDetail.total_qty = this.getTotalQty(this.partList, 'part_qty');
        this.orderDetail.total_price = this.getTotalPrice(this.partList);

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
        this.partList.forEach((item: any) => {
          item.part_qty = parseFloat(item.part_qty);
          item.approve_qty = item.part_qty;
          item.part_price = parseFloat(item.part.price || 0);
          this.partListOption.push(item.part);
        });
        this.orderDetail.total_qty = this.getTotalQty(this.partList, 'part_qty');
        this.orderDetail.total_price = this.getTotalPrice(this.partList);
        this.selectAll = true;
        this.selected();
      } else {
        this.comman.toster('warning', res.message)
      }
    })
  }

  approveOrder() {
    // $('#po_upload').modal('show');
    // return

    let obj: any = {
      order_detail: []
    };
    this.partList.forEach((item: any) => {
      obj.order_detail.push({
        order_detail_id: item.id,
        approve_qty: item.is_approve != true ? 0 : item.approve_qty,
        part_id: item.part.id,
        remarks: item.remarks,
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

  async onSubmit(type: any): Promise<void> {
    let mergedPdfBlob: any = "";
    if (this.isMini && this.isUtility) {
      const pdf1 = await this.file.arrayBuffer();
      const pdf2 = await this.utility_po.arrayBuffer();
      mergedPdfBlob = await this.comman.mergePdfs(pdf1, pdf2);
    } else if (this.isMini) {
      mergedPdfBlob = this.file;
    } else if (this.isUtility) {
      mergedPdfBlob = this.utility_po;
    }

    const formData = new FormData();
    if (type == 'Reset') {
      formData.append('po_pdf', "");
      formData.append('utility_po', "");
      formData.append('merged_po', "");
      formData.append('type', "reset");
      formData.append('tracking_number', this.tracking_number);
    } else {
      formData.append('po_pdf', this.file ? this.file : '');
      formData.append('utility_po', this.utility_po ? this.utility_po : '');
      formData.append('merged_po', mergedPdfBlob);
      formData.append('type', "upload");
      formData.append('tracking_number', this.tracking_number);
    }

    this.service.poUpload(this.order_id, formData).subscribe((res: any) => {
      if (res.success) {
        this.po_pdf.nativeElement.value = '';
        URL.revokeObjectURL(this.mergedPdfUrl as string);
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

  getTotalQty(item: any, type: any) {
    let total = 0;
    item.forEach((it: any) => {
      total += parseFloat(it[type])
    });

    return total;
  }


  getTotalPrice(item: any) {
    let total: any = 0;
    item.forEach((it: any) => {
      total += parseFloat(it.part_price) * parseFloat(it.part_qty);
    });

    return total;
  }


  onUtilityFileSelected(event: any) {
    const file: File = event.target.files[0];
    const maxSizeInMB = 20;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file) {
      if (file.size > maxSizeInBytes) {
        this.comman.toster('warning', `File size exceeds ${maxSizeInMB} MB limit. Please upload a smaller file.`);
        return;
      }
      this.utility_po = file;
    }
  }

  onUtilitySubmit(type: any): void {
    const formData = new FormData();
    if (type == 'Reset') {
      formData.append('po_pdf', "");
      formData.append('type', "reset");
    } else {
      formData.append('po_pdf', this.utility_po, this.utility_po.name);
      formData.append('type', "upload");
    }
    this.service.scanUtilityPoUpload(this.order_id, formData).subscribe(
      (res: any) => {
        console.log("res", res);
        if (res.success) {
          this.comman.toster('success', res.message);
        } else {
          this.comman.toster('warning', res.message);
        }
      },
      (err: any) => {
        console.log(err);
        this.comman.toster('error', 'Oops! Something went wrong. Please try again later.');
      }
    );

  }


  onChangePart(ind: any, event: any) {
    this.partList[ind].part = event
  }

  fetchMore() {
    if (!this.loading && !this.endReached) {
      this.fetchParts(this.query, this.page);
    }
  }

  fetchParts(query: string = '', page: number = 1) {
    this.loading = true;
    let obj = {
      search: query,
      page: page,
      size: this.pageSize
    }

    this.service.getAllParts(obj).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length === 0) {
          this.endReached = true;
        } else {
          if (query) {
            this.partListOptionEx = response.data;
            this.partListOption = response.data;
          } else {
            this.partListOptionEx = [...this.partListOptionEx, ...response.data];
            this.partListOption = [...this.partListOption, ...response.data];
          }
          this.page++;
        }
      }
      this.loading = false;
    });
  }

  onSearch(event: any) {
    if (event.term.length >= 1) {
      this.fetchParts(event.term);
    }
  }

  onPartClear() {
    this.fetchParts(this.query, this.page);
  }

  downloadPdf(poPdf: string) {
    if (poPdf && poPdf != '') {
      console.log('Downloading PDF:', poPdf);
      const link = document.createElement('a');
      link.href = poPdf;
      link.target = '_blank';
      link.click();
    } else {
      this.comman.toster('warning', "PDF url not found")
    }
  }
}
