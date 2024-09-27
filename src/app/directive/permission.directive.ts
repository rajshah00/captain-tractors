import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[hasPermission]'
})
export class PermissionDirective {
  permissionsList: any = JSON.parse(localStorage.getItem('permissions') || '[]');
  @Input() set hasPermission(action: string) {
    // Get current path
    const currentPath = this.router.url;
    this.checkPermission(currentPath, action);
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private router: Router
  ) { }


  private checkPermission(path: string, action: string) {
    const filterMenu = (menu: any[]): any[] => {
      return menu
      .map(menuItem => {
        if (menuItem.children) {
          menuItem.children = filterMenu(menuItem.children);
          }
          if(menuItem.path == path && menuItem[action] == 1){
            this.viewContainer.createEmbeddedView(this.templateRef);
            return menuItem;
          }
          
          return true;
        })
        .filter(Boolean);
    };

    return filterMenu(this.permissionsList);

  }
}
