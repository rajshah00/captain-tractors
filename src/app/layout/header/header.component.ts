import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userData: any;
  finalTotal: any = 0;
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('profile') || '')
  }

  toggelSideBar() {
    $("body").toggleClass("toggle-sidebar");
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }



}

