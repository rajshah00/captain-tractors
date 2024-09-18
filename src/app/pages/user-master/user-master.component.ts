import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit {
  @ViewChild('userForm') userForm!: NgForm;
  userType: any;
  formObj: any = {};
  serchObj: any = {}
  userList: any = [];
  userId: any;
  userData: any;
  roleList: any;
  p: number = 1;
  allCountryList: any;
  allStateList: any;
  brandList: any = [];
  allRegionList: any;
  allContinent: any;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }
  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('profile') || '')
    this.getUerList();
    this.getRoleList();
    this.getBrandList();
    this.getContinent();
  }


  // get Brand List
  getBrandList() {
    this.service.brandList(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        this.brandList = res.data;
      }
    })
  }

  openPop(type: any, item: any) {
    console.log("item", item);

    if (type == 'Edit') {
      this.userId = item.id;
      this.formObj.name = item.name;
      this.formObj.code = item.code;
      this.formObj.phone = item.phone;
      this.formObj.contact_name = item.contact_name;
      this.formObj.email = item.email;
      this.formObj.password = item.password || '';
      this.formObj.continent_id = item.continent_id;
      this.getRegionList();
      this.formObj.region_id = item.region_id;
      this.getCountryList()
      this.formObj.country_id = item.country_id;

      this.formObj.city = item.city;
      this.formObj.role_id = item.role_id;
      this.formObj.is_active = item.is_active;
      this.formObj.address = item.address;
      this.formObj.address_2 = item.address_2;
      this.formObj.address_3 = item.address_3;
      this.formObj.brand_id = item.brand_id;
      this.formObj.contact_name = item.contact_name;
      this.formObj.remark = item.remark;
    } else {
      this.formObj = {};
      this.userForm.resetForm();
    }
    this.userType = type;
    $('#userPop').modal('show');
  }

  onSubmit(form: any) {
    //========// Add user code //========//
    if (form.valid) {
      if (this.userType == 'Add') {
        form.value.is_active = form.value.is_active ? 1 : 0;
        console.log(form.value);
        this.service.addUser(form.value).subscribe((res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getUerList();
            $('#userPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later')
        })

      } else {
        //========// Edit user code //========//
        console.log(form.value);
        this.service.editUser(form.value, this.userId).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getUerList();
            $('#userPop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later')
        })
      }
    } else {
      this.comman.toster('warning', 'Form is invalid');
    }
  }

  getUerList() {
    this.service.userList(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        let data = [];
        for (let i in res.data) {
          if (res.data[i].id != this.userData.id) {
            data.push(res.data[i]);
          }
        }
        this.userList = data
      }
    })
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


  deleteUser(item: any) {
    let obj = {
      id: item.id
    }
    this.service.deleteUser(obj).subscribe((res: any) => {
      if (res.success) {
        this.comman.toster('success', res.message);
        this.getUerList();
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
    this.getUerList();
  }
}
