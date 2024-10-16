import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  cartCount: any = 0;
  notiCount: any = 0;
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  spinnerState$ = this.spinnerSubject.asObservable();

  constructor(private http: HttpClient) { }

  show() {
    this.spinnerSubject.next(true);
  }

  hide() {
    this.spinnerSubject.next(false);
  }

  login(data: any) {
    return this.http.post(environment.apiUrl + 'login', data);
  }

  forgetPasswordMailSend(data: any) {
    return this.http.post(environment.apiUrl + 'forget-password-mail-send', data);
  }

  resetPassword(data: any) {
    return this.http.post(environment.apiUrl + 'reset-password', data);
  }

  changePassword(data: any) {
    return this.http.post(environment.apiUrl + 'change-password', data);
  }

  token_email(data: any) {
    return this.http.post(environment.apiUrl + 'token_email', data);
  }
  //=====// User Master Start//=====//
  addUser(data: any) {
    return this.http.post(environment.apiUrl + 'user/store', data);
  }

  editUser(data: any, id: any) {
    return this.http.post(environment.apiUrl + `user/${id}/update`, data);
  }

  deleteUser(data: any) {
    return this.http.post(environment.apiUrl + `user/${data.id}/delete`, {});
  }

  userList(data: any) {
    return this.http.post(environment.apiUrl + 'user/list', data);
  }
  //=====// User Master End //=====//

  //=====// Modal Master Start//=====//
  addModal(data: any) {
    return this.http.post(environment.apiUrl + 'model_master/store', data);
  }

  editModal(data: any, id: any) {
    return this.http.post(environment.apiUrl + `model_master/${id}/update`, data);
  }

  deleteModal(data: any) {
    return this.http.post(environment.apiUrl + `model_master/${data.id}/delete`, {});
  }

  ModalList(data: any) {
    return this.http.post(environment.apiUrl + 'model_master/list', data);
  }

  productTypeModal(data: any) {
    return this.http.post(environment.apiUrl + 'model_master/product_type/list', data);
  }

  modalIdPartGet(data: any) {
    return this.http.post(environment.apiUrl + 'part/model_list', data);
  }

  getModalById(id: any) {
    return this.http.get(environment.apiUrl + `model_master/${id}/details`);
  }

  dealerwiseModal(data: any) {
    return this.http.post(environment.apiUrl + 'dealer/model/list', data);
  }
  //=====// Modal Master End//=====//

  //=====// Assembly Master Star //=====//
  addAssembly(data: any) {
    return this.http.post(environment.apiUrl + 'assembly_master/store', data);
  }

  editAssembly(data: any, id: any) {
    return this.http.post(environment.apiUrl + `assembly_master/${id}/update`, data);
  }

  deleteAssembly(data: any) {
    return this.http.post(environment.apiUrl + `assembly_master/${data.id}/delete`, {});
  }

  AssemblyList(data: any) {
    return this.http.post(environment.apiUrl + 'assembly_master/list', data);
  }

  getAssemblyById(id: any) {
    return this.http.get(environment.apiUrl + `assembly_master/${id}/details`);
  }

  ModeleAssembly(data: any) {
    return this.http.post(environment.apiUrl + 'assembly_master/list', data);
  }
  //=====// Assembly Master End //=====//

  //=====// Dealer Master Start //=====//
  DealerList(data: any) {
    return this.http.post(environment.apiUrl + 'dealer/list', data);
  }

  DealerDetail(data: any) {
    return this.http.post(environment.apiUrl + 'dealer/model/list', data);
  }

  assignDealer(data: any) {
    return this.http.post(environment.apiUrl + 'dealer/model/add', data);
  }
  //=====// Dealer Master End //=====//

  //=====// Product Type Master Star //=====//
  addProductType(data: any) {
    return this.http.post(environment.apiUrl + 'product_type_master/store', data);
  }

  editProductType(data: any, id: any) {
    return this.http.post(environment.apiUrl + `product_type_master/${id}/update`, data);
  }

  deleteProductType(data: any) {
    return this.http.post(environment.apiUrl + `product_type_master/${data.id}/delete`, {});
  }

  ProductTypeList(data: any) {
    return this.http.post(environment.apiUrl + 'product_type_master/list', data);
  }

  MainTypeList(data: any) {
    return this.http.post(environment.apiUrl + 'category/list', data);
  }
  //=====// Product Type Master End //=====//


  //=====// Role Master Start //=====//
  addRole(data: any) {
    return this.http.post(environment.apiUrl + 'role/store', data);
  }

  editRole(data: any, id: any) {
    return this.http.post(environment.apiUrl + `role/${id}/update`, data);
  }

  roleList(data: any) {
    return this.http.post(environment.apiUrl + 'role/list', data);
  }
  //=====// Role Master End //=====//


  //=====// E-Catalogue Start //=====//
  addPart(data: any) {
    return this.http.post(environment.apiUrl + 'part/store', data);
  }

  editPart(data: any, id: any) {
    return this.http.post(environment.apiUrl + `part/${id}/update`, data);
  }

  deletePart(id: any) {
    return this.http.post(environment.apiUrl + `part/${id}/delete`, {});
  }

  e_CatalogueList(data: any) {
    return this.http.post(environment.apiUrl + 'part/list', data);
  }

  getTypeWiseData(data: any) {
    return this.http.post(environment.apiUrl + 'assembly_master/list_by_ids', data);
  }

  addToCart(data: any) {
    return this.http.post(environment.apiUrl + 'user_cart_part/store', data);
  }

  saveAsDraft(data: any) {
    return this.http.post(environment.apiUrl + 'save_as_draft/store', data);
  }

  cartList(data: any): Observable<{ items: any[], count: number }> {
    return this.http.post<any>(environment.apiUrl + 'user_cart_part/user_cart_list', data).pipe(
      map(response => {
        this.cartCount = response.data?.user_cart_part ? response.data?.user_cart_part.length : 0;
        return response;
      })
    );
  }

  deleteCart(id: any) {
    return this.http.post(environment.apiUrl + `user_cart_part/${id}/delete`, {});
  }
  //=====// E-Catalogue End //=====//

  Region(data: any) {
    return this.http.post(environment.apiUrl + 'region/list', data);
  }

  continent(data: any) {
    return this.http.post(environment.apiUrl + 'continent/list', data);
  }

  countryList(data: any) {
    return this.http.post(environment.apiUrl + 'region/country_list', data);
  }

  allCountryList(data: any) {
    return this.http.post(environment.apiUrl + 'country/list', data);
  }


  stateList(data: any) {
    return this.http.post(environment.apiUrl + 'state/list', data);
  }

  ChassisNumberList(data: any) {
    return this.http.post(environment.apiUrl + 'chassis_number/list', data);
  }

  getAllParts(data: any) {
    return this.http.post(environment.apiUrl + 'part/all_list', data);
  }

  //=====// Order Start //=====//

  saveOrder(data: any) {
    return this.http.post(environment.apiUrl + 'order/store', data);
  }

  uploadExcel(data: any) {
    return this.http.post(environment.apiUrl + 'order/import', data);
  }

  importExcel(data: any) {
    return this.http.post(environment.apiUrl + 'part/excel_part_show', data);
  }

  getOrder(data: any) {
    return this.http.post(environment.apiUrl + 'order/list', data);
  }


  getBackOrder(data: any) {
    return this.http.post(environment.apiUrl + 'back_order/list', data);
  }

  getPurchaseReport(data: any) {
    return this.http.post(environment.apiUrl + 'report/part_purchase', data);
  }

  getIdByOrder(id: any) {
    return this.http.post(environment.apiUrl + `order/${id}/detail`, {});
  }


  getReportOrder(data: any) {
    return this.http.post(environment.apiUrl + 'report/list', data);
  }


  getBackOrderDetail(id: any) {
    return this.http.post(environment.apiUrl + `back_order/${id}/detail`, {});
  }

  getOrderDetail(id: any) {
    return this.http.post(environment.apiUrl + `order/${id}/detail`, {});
  }

  approve(id: any, data: any = {}) {
    return this.http.post(environment.apiUrl + `order/${id}/approve`, data);
  }

  reject(id: any) {
    return this.http.post(environment.apiUrl + `order/${id}/reject`, {});
  }

  poUpload(id: any, data: any = {}) {
    return this.http.post(environment.apiUrl + `order/${id}/po_upload`, data);
  }

  scanPoUpload(id: any, data: any = {}) {
    return this.http.post(environment.apiUrl + `order/${id}/pi_upload_dealer`, data);
  }

  scanUtilityPoUpload(id: any, data: any = {}) {
    return this.http.post(environment.apiUrl + `order/${id}/utility_pi_upload_dealer`, data);
  }

  demoEXCL() {
    return this.http.post(environment.apiUrl + `order/sample_excel`, {});
  }
  demoAssemblyEXCL() {
    return this.http.post(environment.apiUrl + `assembly_master/sample_excel`, {});
  }

  approveByDealer(id: any, data: any = {}) {
    return this.http.post(environment.apiUrl + `back_order/${id}/approve`, data);
  }


  rejectByDealer(id: any) {
    return this.http.post(environment.apiUrl + `back_order/${id}/reject`, {});
  }
  //=====// Order End //=====//

  //=====// Notifications Start //=====//
  getNotifications(data: any): Observable<{ items: any[], count: number }> {
    return this.http.post<any>(environment.apiUrl + 'notification/list', data).pipe(
      map(response => {
        this.notiCount = response.data ? response.data.filter((notification: any) => notification.is_read === 1).length : 0;
        return response;
      })
    );
  }

  readNotification(data: any) {
    return this.http.post(environment.apiUrl + 'notification/notification_read', data);
  }


  //=====// Brand start //=====//
  brandList(data: any) {
    return this.http.post(environment.apiUrl + 'brand/list', data);
  }

  saveBrand(data: any) {
    return this.http.post(environment.apiUrl + 'brand/store', data);
  }

  editBrand(id: any, data: any) {
    return this.http.post(environment.apiUrl + `brand/${id}/update`, data);
  }

  deleteBrand(id: any) {
    return this.http.post(environment.apiUrl + `brand/${id}/delete`, {});
  }

  //=====// I - Circular Master Start //=====//
  addCircular(data: any) {
    return this.http.post(environment.apiUrl + 'i_circular/store', data);
  }

  editCircular(data: any, id: any) {
    return this.http.post(environment.apiUrl + `i_circular/${id}/update`, data);
  }

  deleteCircular(id: any) {
    return this.http.post(environment.apiUrl + `i_circular/${id}/delete`, {});
  }

  circularList(data: any) {
    return this.http.post(environment.apiUrl + 'i_circular/list', data);
  }
  //=====// I - Circular Master End //=====//


  //=====// Service Manuals Master Start //=====//
  addSM(data: any) {
    return this.http.post(environment.apiUrl + 'service_manual/store', data);
  }

  editSM(data: any, id: any) {
    return this.http.post(environment.apiUrl + `service_manual/${id}/update`, data);
  }

  deleteSM(id: any) {
    return this.http.post(environment.apiUrl + `service_manual/${id}/delete`, {});
  }

  smList(data: any) {
    return this.http.post(environment.apiUrl + 'service_manual/list', data);
  }
  //=====// Service Manuals Master End //=====//


  //=====// Owners Manuals Master Start //=====//
  addOM(data: any) {
    return this.http.post(environment.apiUrl + 'owners_manual/store', data);
  }

  editOM(data: any, id: any) {
    return this.http.post(environment.apiUrl + `owners_manual/${id}/update`, data);
  }

  deleteOM(id: any) {
    return this.http.post(environment.apiUrl + `owners_manual/${id}/delete`, {});
  }

  omList(data: any) {
    return this.http.post(environment.apiUrl + 'owners_manual/list', data);
  }
  //=====// Owners Manuals Master End //=====//

  //=====// Service SOP Master Start //=====//
  addSOP(data: any) {
    return this.http.post(environment.apiUrl + 'service_sop/store', data);
  }

  editSOP(data: any, id: any) {
    return this.http.post(environment.apiUrl + `service_sop/${id}/update`, data);
  }

  deleteSOP(id: any) {
    return this.http.post(environment.apiUrl + `service_sop/${id}/delete`, {});
  }

  sopList(data: any) {
    return this.http.post(environment.apiUrl + 'service_sop/list', data);
  }
  //=====// Service SOP Master End //=====//

  //=====// I - Catalogue Master Start //=====//
  addCatalogue(data: any) {
    return this.http.post(environment.apiUrl + 'i_catalogue/store', data);
  }

  editCatalogue(data: any, id: any) {
    return this.http.post(environment.apiUrl + `i_catalogue/${id}/update`, data);
  }

  deleteCatalogue(id: any) {
    return this.http.post(environment.apiUrl + `i_catalogue/${id}/delete`, {});
  }

  catalogueList(data: any) {
    return this.http.post(environment.apiUrl + 'i_catalogue/list', data);
  }
  //=====// I - Catalogue Master End //=====//

  //=====// Feedback Start //=====//
  feedback(data: any) {
    return this.http.post(environment.apiUrl + 'feedback/store', data);
  }
  //=====// Feedback End //=====//

  //=====// Category Master Start //=====//

  model_category_by_id(data: any) {
    return this.http.post(environment.apiUrl + 'model_category/model/list', data);
  }

  model_categoryList(data: any) {
    return this.http.post(environment.apiUrl + 'model_category/list', data);
  }

  addCategory(data: any) {
    return this.http.post(environment.apiUrl + 'model_category/store', data);
  }

  editCategory(data: any, id: any) {
    return this.http.post(environment.apiUrl + `model_category/${id}/update`, data);
  }

  deleteCategory(id: any) {
    return this.http.post(environment.apiUrl + `model_category/${id}/delete`, {});
  }

  verifyModel(data: any) {
    return this.http.post(environment.apiUrl + 'model_master/check_category_model', data);
  }


}
