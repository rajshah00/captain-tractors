import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-add-catalogue',
  templateUrl: './add-catalogue.component.html',
  styleUrls: ['./add-catalogue.component.scss']
})
export class AddCatalogueComponent implements OnInit, AfterViewInit {
  formObj: any = {};
  assemblyList: any;
  modaldataList: any;
  productTypeList: any;
  partList: any = [];
  totalQty: any = 0;
  lineCount: any = 0;
  p: number = 1;
  userData: any = JSON.parse(localStorage.getItem('profile') || '');

  @ViewChild('imageBox') imageBox!: ElementRef;
  @ViewChild('original') original!: ElementRef;
  @ViewChild('magnified') magnified!: ElementRef;
  magnifiedStyles: any;
  imageUrl: string = ''; // Example image URL

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.getproductsTypeMaster();
  }

  onMouseMove(event: MouseEvent): void {
    console.log('Mouse X:', event.clientX, 'Mouse Y:', event.clientY);
    const offset = $("#img-zoomer-box").offset()!;
    const x = event.pageX - offset.left!;
    const y = event.pageY - offset.top!;
    const imgWidth = $("#img-1").width()!;
    const imgHeight = $("#img-1").height()!;
    let xperc = (x / imgWidth) * 100;
    let yperc = (y / imgHeight) * 100;

    if (x >= 0.01 * imgWidth) {
      xperc *= 1.15;
    }

    if (y >= 0.01 * imgHeight) {
      yperc *= 1.15;
    }

    this.magnifiedStyles = {
      'backgroundImage': `url(${this.imageUrl})`,
      'backgroundPositionX': `${xperc - 9}%`,
      'backgroundPositionY': `${yperc - 9}%`,
      'left': `${x - 100}px`,
      'top': `${y - 100}px`,
      'opacity': '1'
    };
  }

  onMouseLeave(): void {
    this.magnifiedStyles = {
      ...this.magnifiedStyles,
      'opacity': '0'
    };
  }

  // initializeZoom() {
  //   const $imageBox = $("#img-zoomer-box");
  //   const $original = $("#img-1");
  //   const $magnified = $("#img-2");

  //   $imageBox.on('mousemove', (e: any) => {
  //     const offset = $imageBox.offset()!;
  //     const x = e.pageX - offset.left!;
  //     const y = e.pageY - offset.top!;
  //     const imgWidth = $original.width()!;
  //     const imgHeight = $original.height()!;
  //     let xperc = (x / imgWidth) * 100;
  //     let yperc = (y / imgHeight) * 100;

  //     // Allows user to scroll past the right edge of the image
  //     if (x >= 0.01 * imgWidth) {
  //       xperc *= 1.15;
  //     }

  //     // Allows user to scroll past the bottom edge of the image
  //     if (y >= 0.01 * imgHeight) {
  //       yperc *= 1.15;
  //     }

  //     $magnified.css({
  //       'backgroundPositionX': `${xperc - 9}%`,
  //       'backgroundPositionY': `${yperc - 9}%`,
  //       'left': `${x - 100}px`,
  //       'top': `${y - 100}px`
  //     });
  //   });
  // }


  //========// Get All Modal //========//
  modalList(id: any) {
    this.service.productTypeModal({ product_type_id: id }).subscribe((res: any) => {
      if (res.success) {
        this.modaldataList = res.data
      }
    })
  }

  //========// Get All Products Type //========//
  getproductsTypeMaster() {
    this.service.ProductTypeList({}).subscribe((res: any) => {
      if (res.success) {
        this.productTypeList = res.data
      }
    })
  }

  //========// Get Catalogue //========//
  getCatalogue(Type: any) {
    if (Type == 'Reset') { this.formObj = {} }
    this.service.e_CatalogueList(this.formObj).subscribe((res: any) => {
      if (res.success && res.data.length) {
        this.partList = res.data;
        this.imageUrl = this.partList[0].assembly.image;
        this.totalQty = 0;
        this.lineCount = 0;
        for (let item of this.partList) {
          item.qty = 0;
        }
      } else {
        this.partList = [];
        this.comman.toster('warning', res.message)
      }
    })
  }


  increment(ind: any): void {
    if (this.partList[ind].qty < 100) {
      this.partList[ind].qty += 1;
      this.totalQty += 1;
      this.lineCount = this.partList.reduce((acc: any, item: any) => { return item.qty > 0 ? acc + 1 : acc; }, 0);
    }
  }

  decrement(ind: any): void {
    if (this.partList[ind].qty > 0 && this.partList[ind].qty < 100) {
      this.partList[ind].qty -= 1;
      this.totalQty -= 1;
      this.lineCount = this.partList.reduce((acc: any, item: any) => { return item.qty > 0 ? acc + 1 : acc; }, 0);
    }
  }

  moveTocart(item: any) {
    let obj: any = {
      "user_id": this.userData.id,
      "parts": []
    }
    if (item.qty > 0) {
      obj.parts.push({
        "part_id": item.id,
        "qty": item.qty,
        "price": item.price,
        "total": item.price
      })
    }

    if (obj.parts && obj.parts.length) {
      this.service.addToCart(obj).subscribe((res: any) => {
        if (res.success) {
          item.qty = 0
          this.comman.toster('success', res.message);
        } else {
          this.comman.toster('warning', res.message)
        }
      })
    } else {
      this.comman.toster('warning', "Plese select quantities and move items to a cart")
    }
  }

  onChange() {
    this.totalQty = 0;
    this.partList.forEach((item: any) => {
      this.totalQty += item.qty;
    });
  }

  onChangeProduct($event: any) {
    this.modalList($event.id);
    this.formObj.assembly_id = null;
    this.formObj.model_id = null;
  }

  onChangeModel(model_id: any) {
    this.service.ModeleAssembly({ model_id: model_id }).subscribe((res: any) => {
      if (res.success) {
        this.assemblyList = res.data
      }
    })

  }
}
