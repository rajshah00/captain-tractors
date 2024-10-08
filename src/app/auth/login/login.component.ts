import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formObj: any = {};
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) {

  }
  ngOnInit(): void {
    $(document).ready(function () {
      $("#owl-demo").owlCarousel({
        navigation: false,
        autoplay: true,
        margin: 0,
        items: 1,
        loop: true,
        nav: false,
        dots: false,
      });
    });
  }

  onSubmit(form: any) {
    if (form.form.valid) {
      this.service.login(form.form.value).subscribe((res: any) => {
        console.log("res", res);
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('profile', JSON.stringify(res.data.user));
          localStorage.setItem('permissions', JSON.stringify(res.data.permissions));
          this.comman.toster('success', res.message);
          this.service.hide()
          this.router.navigate(['/dashboard'])
        } else {
          this.comman.toster('warning', res.message)
          this.service.hide()
        }
      }, (err: any) => {
        console.log(err);

        this.comman.toster('error', 'ops! something went wrong please try again later')
      })
    }
  }

}
