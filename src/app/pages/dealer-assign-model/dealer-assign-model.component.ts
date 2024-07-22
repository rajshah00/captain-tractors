import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-dealer-assign-model',
  templateUrl: './dealer-assign-model.component.html',
  styleUrls: ['./dealer-assign-model.component.scss']
})
export class DealerAssignModelComponent implements OnInit {
  formObj: any = {};
  serchObj: any = {};
  dealerList: any = [];
  modaldataList: any;
  searchText: any;
  isChecked: any;
  itemId: any;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    this.getModalList();
    this.getDealerList();
  }

  openPop(type: any, data: any) {

  }

  //========// Get All Modal //========//
  getModalList() {
    this.service.ModalList({}).subscribe((res: any) => {
      if (res.success) {
        this.modaldataList = res.data
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


  onCheckboxChange(index: number) {
    this.modaldataList[index].checked = this.modaldataList[index].checked;
  }

  checkAll() {
    if (this.isChecked) {
      this.modaldataList.forEach((item: any) => item.checked = true);
    } else {
      this.modaldataList.forEach((item: any) => item.checked = false);
    }
  }

  openAssignModal(item: any) {
    this.itemId = item.id;
    let obj = { id: item.id }
    this.service.DealerDetail(obj).subscribe((res: any) => {
      if (res.success) {
        if (res.data.models.length) {
          let modelIds = new Set(res.data.models.map((model: any) => model.model_id));
          this.modaldataList.forEach((modal: any) => {
            if (modelIds.has(modal.id)) {
              modal.checked = true;
            }
          });
        } else {
          this.modaldataList.forEach((modal: any) => {
            modal.checked = false;
          });
        }
        console.log(this.modaldataList);

        $('#detail-popup').modal('show')
      }
    })
  }

  saveAssignModal() {
    let obj: any = {
      "dealer_id": this.itemId,
      "model_id": []
    }
    this.modaldataList.forEach((modal: any) => {
      if (modal.checked == true) {
        obj.model_id.push(modal.id)
      }
    });
    this.service.assignDealer(obj).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        $('#detail-popup').modal('hide')
      } else {
        this.comman.toster('warning', res.message)
      }
    });
  }

}
