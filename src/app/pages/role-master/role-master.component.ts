import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';
import { NavserviceService } from 'src/app/services/navservice.service';
declare var $: any;

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.scss']
})
export class RoleMasterComponent implements OnInit {
  formObj: any = {};
  serchObj: any = {};
  roleType: any;
  searchTex: any;
  menuItems: any;
  selectAll: boolean = false;
  roleList: any = [];
  userId: any;
  p: number = 1;
  constructor(
    private navServices: NavserviceService,
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.checkNavActiveOnLoad();
    this.getRoleList();
  }

  openPop(type: any, item: any) {
    if (type == 'Edit') {
      this.userId = item.id;
      this.formObj.name = item.name;
      this.formObj.description = item.description;
      this.menuItems = this.addPermissionsToMenu(this.menuItems, item.permissions);
      // console.log("item.permissions",item.permissions);
      console.log("this.menuItems", this.menuItems);
    } else {
      this.formObj = {};
      this.menuItems.forEach((item: any) => {
        item.is_create = false;
        item.is_delete = false;
        item.is_edit = false;
        item.is_view = false;
        if (item.children && item.children.length) {
          item.children.forEach((subscribetem: any) => {
            subscribetem.is_create = false;
            subscribetem.is_delete = false;
            subscribetem.is_edit = false;
            subscribetem.is_view = false;
          })
        }
      });
    }
    this.roleType = type;
    $('#rolePop').modal('show')
  }

  // To set Active on Load
  checkNavActiveOnLoad() {
    this.navServices.role_Menu.subscribe((menuItems: any) => {
      console.log("menuItems",menuItems);
      
      this.menuItems = menuItems;
      this.menuItems.forEach((item: any) => {
        item.is_create = false;
        item.is_delete = false;
        item.is_edit = false;
        item.is_view = false;
        if (item.children && item.children.length) {
          item.children.forEach((subscribetem: any) => {
            subscribetem.is_create = false;
            subscribetem.is_delete = false;
            subscribetem.is_edit = false;
            subscribetem.is_view = false;
          })
        }
      });
      console.log("filteredRoleMenu", this.menuItems);
    });
  }

  // Sub menu Toggel
  toggelRow(ind: any) {
    let rowShowHideBtn = document.querySelectorAll(`[id^=showHide${ind}]`)
    let rowShowHideBtnImg = document.querySelectorAll(`[id^=showHide${ind}] img`)
    let showHideRow = document.querySelectorAll(`[id^=showBody${ind}]`)
    rowShowHideBtn.forEach((btn, index) => {
      if (btn.getAttribute("data-is-card-show") === "true") {
        btn.setAttribute("data-is-card-show", "false")
        showHideRow[index].classList.add("d-none")
        rowShowHideBtnImg[index].setAttribute("src", "./assets/img/add-circle-icon.svg")
      } else {
        btn.setAttribute("data-is-card-show", "true")
        showHideRow[index].classList.remove("d-none")
        rowShowHideBtnImg[index].setAttribute("src", "./assets/img/minus-circle-icon.svg")
      }
    });
  }

  // Save Role
  saveRole(form: any) {
    if (form.valid) {
      let permisionAllow: any = [];
      console.log("this.menuItems", this.menuItems);
      this.menuItems.forEach((permision: any) => {
        if (permision.path != '') {
          if (permision.is_create || permision.is_delete || permision.is_edit || permision.is_view) {
            permisionAllow.push(permision)
          }
        }
        if (permision.path == '') {
          let chaildPermision: any = [];
          permision.children.forEach((item: any) => {
            if (item.is_create || item.is_delete || item.is_edit || item.is_view) {
              chaildPermision.push(item);
              permision.is_view = true;
            }
          })
          if (chaildPermision.length) {
            permision.chaildPermision = chaildPermision;
            permisionAllow.push(permision)
          }
        }
      })



      let filteredData = this.filterData(permisionAllow);
      this.formObj.permision = filteredData;
      // this.formObj.is_active = this.formObj.is_active ? 1 : 0;
      console.log("this.formObj", this.formObj);

      if (this.roleType == 'Add') {
        this.service.addRole(this.formObj).subscribe((res: any) => {
          console.log("res", res);
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getRoleList();
            $('#rolePop').modal('hide');
          } else {
            this.comman.toster('warning', res.message)
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later');
          $('#rolePop').modal('hide');
        })
      } else {

        this.service.editRole(this.formObj, this.userId).subscribe((res: any) => {
          if (res.success) {
            this.comman.toster('success', res.message);
            this.getRoleList();
            $('#rolePop').modal('hide');
          } else {
            this.comman.toster('warning', res.message);
            $('#rolePop').modal('hide');
          }
        }, (err: any) => {
          console.log(err);
          this.comman.toster('error', 'ops! something went wrong please try again later');
          $('#rolePop').modal('hide');
        })
      }
    }
  }

  // selecte multi check box function
  selected() {
    console.log("selectAll", this.selectAll);
    if (this.selectAll) {
      this.menuItems.forEach((item: any) => {
        item.is_create = true;
        item.is_delete = true;
        item.is_edit = true;
        item.is_view = true;
        if (item.children && item.children.length) {
          item.children.forEach((subscribetem: any) => {
            subscribetem.is_create = true;
            subscribetem.is_delete = true;
            subscribetem.is_edit = true;
            subscribetem.is_view = true;
          })
        }
      });
    } else {
      this.menuItems.forEach((item: any) => {
        item.is_create = false;
        item.is_delete = false;
        item.is_edit = false;
        item.is_view = false;
        if (item.children && item.children.length) {
          item.children.forEach((subscribetem: any) => {
            subscribetem.is_create = false;
            subscribetem.is_delete = false;
            subscribetem.is_edit = false;
            subscribetem.is_view = false;
          })
        }
      });
    }

  }


  // Function to filter data
  filterData(data: any) {
    return data.map((item: any) => {
      let newItem = { ...item };

      if (newItem.children && newItem.children.length > 0) {
        newItem.children = newItem.children.filter((child: any) =>
          child.is_create || child.is_delete || child.is_edit || child.is_view
        );
      }

      if (newItem.chaildPermision) {
        delete newItem.chaildPermision;
      }

      return newItem;
    }).filter((item: any) =>
      item.is_create || item.is_delete || item.is_edit || item.is_view || item.children.length > 0
    );
  }

  getRoleList() {
    this.service.roleList(this.serchObj).subscribe((res: any) => {
      if (res.success) {
        this.roleList = res.data;
      }
    })
  }


  // Function to add permissions to allmenu
  addPermissionsToMenu(allmenu: any, permissions: any) {
    // Create a mapping of permissions by path for quick lookup
    let permissionMap: any = {};
    permissions.forEach((permission: any) => {
      permissionMap[permission.title] = permission;
      if (permission.children) {
        permission.children.filter((chaildItem: any) => {
          permissionMap[chaildItem.title] = chaildItem;
        })
      }
    });

    // Function to add permissions to an individual menu item
    function addPermissions(item: any) {
      if (permissionMap[item.title]) {
        let permission = permissionMap[item.title];
        item.is_view = permission.is_view;
        item.is_create = permission.is_create;
        item.is_delete = permission.is_delete;
        item.is_edit = permission.is_edit;
      }
      // Recursively add permissions to children
      if (item.children) {
        item.children.forEach(addPermissions);
      }
    }

    // Add permissions to each item in the allmenu
    allmenu.forEach(addPermissions);
    return allmenu;
  }

  resetForm(form: any) {
    form.resetForm();
    this.getRoleList();
  }

}
