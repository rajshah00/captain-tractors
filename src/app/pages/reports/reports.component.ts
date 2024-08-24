import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  report_type: any;
  userData: any = JSON.parse(localStorage.getItem('profile') || '');
  constructor(
    private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.report_type = params['type'];
        console.log("this.report_type", this.report_type);

      };
    });
  }

}
