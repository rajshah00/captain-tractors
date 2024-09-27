import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  formObj: any = {};

  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private route: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    this.formObj.token = this.route.snapshot.paramMap.get('id');
    this.service.token_email({ token: this.formObj.token }).subscribe((res: any) => {
      if (res.success) {
        this.formObj.email = res.data.email;
      }
    }, (err: any) => {
      this.comman.toster('error', 'Ops! something went wrong please try again later');
    });
    this.service.hide()

  }

  onSubmit(form: any) {
    if (form.form.valid) {
      console.log(this.formObj);
      this.service.resetPassword(this.formObj).subscribe((res: any) => {
        console.log("res", res);
        if (res.success) {
          this.service.hide();
          this.comman.toster('success', res.message);
          this.router.navigate(['/login']);
        } else {
          this.service.hide()
          this.comman.toster('warning', res.message)
        }
      }, (err: any) => {
        this.comman.toster('error', 'ops! something went wrong please try again later')
      })
    }
  }

}
