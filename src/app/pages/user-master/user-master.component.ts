import { Component, OnInit } from '@angular/core';
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
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }
  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('profile') || '')
    this.getUerList();
    this.getRoleList();
    this.getCountryList();
    this.getBrandList();
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
      this.formObj.first_name = item.first_name;
      this.formObj.last_name = item.last_name;
      this.formObj.phone = item.phone;
      this.formObj.email = item.email;
      this.formObj.password = item.password || '';
      this.formObj.address = item.address;
      this.formObj.country_id = item.country_id;
      this.selectCountry()
      this.formObj.state_id = item.state_id;
      this.formObj.city = item.city;
      this.formObj.role_id = item.role_id;
      this.formObj.is_active = item.is_active;
    } else {
      this.formObj = {};
    }
    this.userType = type;
    $('#userPop').modal('show');
  }

  onSubmit(form: any) {
    //========// Add user code //========//
    if (this.userType == 'Add') {
      if (form.valid) {
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
        console.log('Form is invalid');
      }
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
