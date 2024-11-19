import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  formObj: any = {}
  passwordObj: any = {}
  userData: any;
  roleList: any;
  allCountryList: any;
  allStateList: any;
  brandList: any;
  allContinent: any;
  allRegionList: any;

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {
    this.getRoleList();
    this.getBrandList();
    this.getContinent();
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('profile') || '');
    if (this.userData) {
      this.formObj.name = this.userData.name;
      this.formObj.code = this.userData.code;
      this.formObj.phone = this.userData.phone;
      this.formObj.contact_name = this.userData.contact_name;
      this.formObj.email = this.userData.email;
      this.formObj.continent_id = this.userData.continent_id;
      this.formObj.continent_id ? this.getRegionList() : '';
      this.formObj.region_id = this.userData.region_id;
      this.formObj.region_id ? this.getCountryList() : '';
      this.formObj.country_id = this.userData.country_id;

      this.formObj.city = this.userData.city;
      this.formObj.role_id = this.userData.role_id;
      this.formObj.address = this.userData.address;
      this.formObj.address_2 = this.userData.address_2;
      this.formObj.address_3 = this.userData.address_3;
      this.formObj.brand_id = this.userData.brand_id;
      this.formObj.contact_name = this.userData.contact_name;
      this.formObj.remark = this.userData.remark;
      // this.formObj.is_active = this.userData.is_active;
    }
  }

  // get Brand List
  getBrandList() {
    this.service.brandList({}).subscribe((res: any) => {
      if (res.success) {
        this.brandList = res.data;
      }
    })
  }

  getContinent() {
    this.service.continent({}).subscribe((res: any) => {
      if (res.success) {
        this.allContinent = res.data;
      }
    })
  }

  getRegionList() {
    let obj = { continent_id: this.formObj.continent_id }
    this.service.Region(obj).subscribe((res: any) => {
      if (res.success) {
        this.allRegionList = res.data;
      }
    })
  }

  onSubmitPassword(form: any) {
    if (this.passwordObj.new_password_confirmation && this.passwordObj.new_password != this.passwordObj.new_password_confirmation) {
      this.comman.toster('error', 'New Password and Confirm Password dose not match.')
      return
    }

    if (form.form.valid) {
      this.service.changePassword(form.form.value).subscribe((res: any) => {
        if (res.success) {
          this.comman.toster('success', res.message);
          this.passwordObj = {};
        } else {
          this.comman.toster('warning', res.message)
        }
      }, (err: any) => {
        this.comman.toster('error', 'ops! something went wrong please try again later')
      })
    }
  }

  getRoleList() {
    this.service.roleList({}).subscribe((res: any) => {
      if (res.success) {
        this.roleList = res.data;
      }
    })
  }

  getCountryList() {
    let obj = { region_id: this.formObj.region_id }
    this.service.countryList(obj).subscribe((res: any) => {
      if (res.success) {
        this.allCountryList = res.data.country;
      }
    })
  }

  selectCountry() {
    if (this.formObj.country_id) {
      let obj = {
        country_id: this.formObj.country_id
      }
      this.service.stateList(obj).subscribe((res: any) => {
        if (res.success) {
          this.allStateList = res.data;
        }
      })
    } else {
      this.comman.toster('warning', 'Please select country to get state')
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.service.editUser(this.formObj, this.userData.id).subscribe((res: any) => {
        if (res.success) {
          this.comman.toster('success', res.message);
          localStorage.removeItem('profile');
          localStorage.setItem('profile', JSON.stringify(res.data));
        } else {
          this.comman.toster('warning', res.message)
        }
      }, (err: any) => {
        console.log(err);
        this.comman.toster('error', 'ops! something went wrong please try again later')
      })
    } else {
      this.comman.toster('warning', 'Form is invalid');
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('email', this.formObj.email);
      this.service.editUser(formData, this.userData.id).subscribe((res: any) => {
        if (res.success) {
          this.comman.toster('success', res.message);
          localStorage.removeItem('profile');
          localStorage.setItem('profile', JSON.stringify(res.data));
        } else {
          this.comman.toster('warning', res.message)
        }
      }, (err: any) => {
        console.log(err);
        this.comman.toster('error', 'ops! something went wrong please try again later')
      })
    }
  }
}
