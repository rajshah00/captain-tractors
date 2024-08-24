import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-add-catalogue',
  templateUrl: './add-catalogue.component.html',
  styleUrls: ['./add-catalogue.component.scss']
})
export class AddCatalogueComponent implements OnInit {
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
  model_id: any;
  currentPage: number = 0;
  totalPages: any;
  alldata: any;

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['product_type_id'] || params['model_id']) {
        this.model_id = params['model_id'];
        this.formObj.product_type_id = params['product_type_id'];
        this.formObj.model_id = params['model_id'];
        this.formObj.category_id = params['category_id'];
        console.log(typeof params['product_type_id']);
        this.getAsseblyWiseData();
      };
    });
    this.getproductsTypeMaster();
  }

  onMouseMove(event: MouseEvent): void {
    // console.log('Mouse X:', event.clientX, 'Mouse Y:', event.clientY);
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
          item.qty = 0;
          this.getCartList();
          this.comman.toster('success', res.message);
        } else {
          this.comman.toster('warning', res.message)
        }
      })
    } else {
      this.comman.toster('warning', "Plese select quantities and move items to a cart")
    }
  }

  getCartList() {
    let obj = {
      user_id: this.userData.id
    }
    this.service.cartList(obj).subscribe((res: any) => {
      if (res.success && res.data.length) {
        console.log("res", res);
      }
    })
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
    this.assemblyList = [];
    this.modaldataList = []
  }

  onChangeModel(model_id: any) {
    this.service.ModeleAssembly({ model_id: model_id }).subscribe((res: any) => {
      if (res.success) {
        this.formObj.assembly_id = null;
        this.assemblyList = [];
        this.assemblyList = res.data
      }
    })
  }

  getAsseblyWiseData() {
    this.service.getTypeWiseData(this.formObj).subscribe((res: any) => {
      if (res.success && res.data.length) {
        this.alldata = res.data;
        this.totalPages = res.data.length;
        this.partList = res.data[0].parts;
        this.partList[0].assembly = {};
        this.partList[0].assembly.name = res.data[0].name;
        this.partList[0].assembly.image = res.data[0].image;
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


  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;

      this.partList = this.alldata[this.currentPage].parts;
      this.partList[0].assembly = {};
      this.partList[0].assembly.name = this.alldata[this.currentPage].name;
      this.partList[0].assembly.image = this.alldata[this.currentPage].image;
      this.imageUrl = this.partList[0].assembly.image;
      for (let item of this.partList) {
        item.qty = 0;
      }
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;

      this.partList = this.alldata[this.currentPage].parts;
      this.partList[0].assembly = {};
      this.partList[0].assembly.name = this.alldata[this.currentPage].name;
      this.partList[0].assembly.image = this.alldata[this.currentPage].image;
      this.imageUrl = this.partList[0].assembly.image;
      for (let item of this.partList) {
        item.qty = 0;
      }
    }
  }
}
