import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import { NavserviceService } from 'src/app/services/navservice.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userData: any;
  finalTotal: any = 0;
  menuItems: any;
  permissionsList: any = JSON.parse(localStorage.getItem('permissions') || '[]');
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
    private navServices: NavserviceService
  ) {

  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('profile') || '');
    this.checkNavActiveOnLoad();
    $('#toggelMenu').on('click', function (event: any) {
      event.stopPropagation(); // Prevent the click event from propagating to the body
      $("#allMenu").toggleClass('show');
      $("body").toggleClass('body-active');
    });
    // Remove the show class when clicking outside
    $(document).on('click', function (event: any) {
      if (!$(event.target).closest('#allMenu').length) {
        $('#allMenu').removeClass('show');
        $('body').removeClass('body-active');
      }
    });
  }

  toggelSideBar() {
    $("body").toggleClass("toggle-sidebar");
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }

  removeClass() {
    $("#allMenu").removeClass('show');
    $('body').removeClass('body-active');
  }

  // To set Active on Load
  checkNavActiveOnLoad() {
    this.navServices.role_Menu.subscribe((menuItems: any) => {
      this.menuItems = menuItems;
      let allPermision: any = []
      this.permissionsList.filter((item: any) => {
        allPermision.push(item.title);
        if (item.children) {
          item.children.filter((chaildItem: any) => {
            allPermision.push(chaildItem.title);
          })
        }
      })
      // console.log("allPermision", allPermision);

      this.menuItems = this.filterRoleMenu([...allPermision], this.menuItems);
      // console.log("filteredRoleMenu", this.menuItems);
    });
  }


  filterRoleMenu(permissions: string[], rolemenu: any[]): any[] {
    const permissionSet = new Set(permissions);

    const filterMenu = (menu: any[]): any[] => {
      return menu
        .map(menuItem => {
          if (permissionSet.has(menuItem.title)) {
            const newMenuItem = { ...menuItem };
            if (newMenuItem.children) {
              newMenuItem.children = filterMenu(newMenuItem.children);
            }
            return newMenuItem;
          }
          return null;
        })
        .filter(Boolean);
    };

    return filterMenu(rolemenu);
  }


  formatTitle(title: string): string {
    return title.replace(/\s+/g, '-');
  }



}

