import { Component, OnInit } from '@angular/core';
import { NavserviceService } from 'src/app/services/navservice.service';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any;
  permissionsList: any = JSON.parse(localStorage.getItem('permissions') || '[]');
  constructor(private navServices: NavserviceService,) {

  }

  ngOnInit(): void {
    this.checkNavActiveOnLoad();
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
      console.log("allPermision", allPermision);

      this.menuItems = this.filterRoleMenu([...allPermision], this.menuItems);
      console.log("filteredRoleMenu", this.menuItems);
    });
  }

  // Permission wise data filter 
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
        .filter(Boolean); // Remove null entries
    };
  
    return filterMenu(rolemenu);
  }
  

  formatTitle(title: string): string {
    return title.replace(/\s+/g, '-');
  }

  toggelRemove() {
    // $("body").addClass("toggle-sidebar");
  }
}
