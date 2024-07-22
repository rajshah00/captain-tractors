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

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {
    this.getRoleList();
    this.getCountryList();
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('profile') || '');
    if (this.userData) {
      this.formObj.first_name = this.userData.first_name;
      this.formObj.last_name = this.userData.last_name;
      this.formObj.phone = this.userData.phone;
      this.formObj.email = this.userData.email;
      this.formObj.password = this.userData.password;
      this.formObj.country_id = this.userData.country_id;
      this.selectCountry();
      this.formObj.state_id = this.userData.state_id;
      this.formObj.city = this.userData.city;
      this.formObj.role_id = this.userData.role_id;
      this.formObj.address = this.userData.address;
      // this.formObj.is_active = this.userData.is_active;
    }
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
    this.service.countryList({}).subscribe((res: any) => {
      if (res.success) {
        this.allCountryList = res.data;
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

  updateProfile() {
    this.service.editUser(this.formObj, this.userData.id).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
      } else {
        this.comman.toster('warning', res.message)
      }
    }, (err: any) => {
      console.log(err);
      this.comman.toster('error', 'ops! something went wrong please try again later')
    })
  }
}
