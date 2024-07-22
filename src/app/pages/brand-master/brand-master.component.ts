import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import { NavserviceService } from 'src/app/services/navservice.service';
declare var $: any;

@Component({
  selector: 'app-brand-master',
  templateUrl: './brand-master.component.html',
  styleUrls: ['./brand-master.component.scss']
})
export class BrandMasterComponent implements OnInit {
  formData: any = {
    name: '',
    email: '',
    website: '',
    logo: ''
  };
  serchObj: any = {};
  brandType: any;
  searchTex: any;
  brandList: any = [];
  p: number = 1;
  brand_id: any;
  constructor(
    private navServices: NavserviceService,
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getBrandList();
  }

  openPop(type: any, item: any) {
    if (type == 'Edit') {
      this.brand_id = item.id;
      this.formData.name = item.name;
      this.formData.email = item.email;
      this.formData.website = item.website;
    } else {
      this.formData.name = '';
      this.formData.email = '';
      this.formData.website = '';
    }
    this.brandType = type;
    $('#brandPop').modal('show')
  }

  // Save Brand
  submitForm(form: NgForm) {
    if (form.valid) {
      if (this.brandType == 'Add') {
        const formValues = this.appendFormData(this.formData);
        this.service.saveBrand(formValues).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getBrandList();
            $('#brandPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          this.comman.toster('error', 'ops! something went wrong please try again later');
          $('#brandPop').modal('hide');
        })
      } else {
        const formValues = this.appendFormData(this.formData);
        this.service.editBrand(this.brand_id, formValues).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getBrandList();
            $('#brandPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          this.comman.toster('error', 'ops! something went wrong please try again later');
          $('#brandPop').modal('hide');
        })
      }
    }
  }

  // image select to file assing value
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.formData.logo = event.target.files[0];
    }
  }

  // get Brand List
  getBrandList() {
    this.service.brandList(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        this.brandList = res.data;
      }
    })
  }

  appendFormData(data: any): FormData {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return formData;
  }

  deletBrand(item: any) {
    this.service.deleteBrand(item.id).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getBrandList();
      } else {
        this.comman.toster('warning', res.message)
      }
    }, (err: any) => {
      console.log(err);
      this.comman.toster('error', 'Ops! something went wrong please try again later')
    })
  }

  resetForm(form: any) {
    form.resetForm();
    this.getBrandList();
  }

}
