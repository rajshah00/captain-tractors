import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  message: any;
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }

  ngOnInit(): void {

  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.service.feedback(form.value).subscribe((res: any) => {
        if (res.success) {
          this.comman.toster('success', res.message);
          form.reset();
        } else {
          this.comman.toster('warning', res.message)
        }
      }, (err: any) => {
        this.comman.toster('error', 'ops! something went wrong please try again later');
        form.reset();
      })
    } else {
      console.log('Form is invalid');
    }
  }
}
