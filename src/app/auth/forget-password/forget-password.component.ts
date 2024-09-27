import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  formObj: any = {};
  passwordObj: any = {};
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }

  ngOnInit(): void {

  }

  onSubmit(form: any): void {
    console.log(form.value);
    if (form.valid) {
      this.service.forgetPasswordMailSend(form.value).subscribe((res: any) => {
        if (res.success) {
          this.service.hide();
          this.comman.toster('success', res.message);
          this.router.navigate(['/login']);
        } else {
          this.service.hide();
          this.comman.toster('warning', res.message);
        }
      });
    }
  }

}
