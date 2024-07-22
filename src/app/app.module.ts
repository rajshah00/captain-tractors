import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { UserMasterComponent } from './pages/user-master/user-master.component';
import { FormsModule } from '@angular/forms';
import { RoleMasterComponent } from './pages/role-master/role-master.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { ProductsTypeMasterComponent } from './pages/products-parts/products-type-master/products-type-master.component';
import { ModalMasterComponent } from './pages/products-parts/modal-master/modal-master.component';
import { AssemblyMasterComponent } from './pages/products-parts/assembly-master/assembly-master.component';
import { CatalogueAndOrderingComponent } from './pages/catalogue-and-ordering/catalogue-and-ordering.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpResponseInterceptor } from './Interceptors/http-response.interceptor';
import { HttpRequestInterceptor } from './Interceptors/http-request.interceptor';
import { DealerAssignModelComponent } from './pages/dealer-assign-model/dealer-assign-model.component';
import { SearchPipe } from './pipes/search-pipe.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { AddCatalogueComponent } from './pages/catalogue-and-ordering/add-catalogue/add-catalogue.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddToCartComponent } from './pages/catalogue-and-ordering/add-to-cart/add-to-cart.component';
import { PurchaseOrderComponent } from './pages/purchase-order/purchase-order.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderDetailComponent } from './pages/catalogue-and-ordering/order-detail/order-detail.component';
import { SparePartsBillingReportComponent } from './pages/spare-parts-billing-report/spare-parts-billing-report.component';
import { BackOrderReportComponent } from './pages/back-order-report/back-order-report.component';
import { BrandMasterComponent } from './pages/brand-master/brand-master.component';
import { ICircularComponent } from './pages/i-circular/i-circular.component';
import { ServiceManualsComponent } from './pages/service-manuals/service-manuals.component';
import { OwnersManualsComponent } from './pages/owners-manuals/owners-manuals.component';
import { ServiceSOPComponent } from './pages/service-sop/service-sop.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    UserMasterComponent,
    RoleMasterComponent,
    MyProfileComponent,
    ProductsTypeMasterComponent,
    ModalMasterComponent,
    AssemblyMasterComponent,
    CatalogueAndOrderingComponent,
    ForgetPasswordComponent,
    DealerAssignModelComponent,
    SearchPipe,
    AddCatalogueComponent,
    AddToCartComponent,
    PurchaseOrderComponent,
    OrderDetailComponent,
    SparePartsBillingReportComponent,
    BackOrderReportComponent,
    BrandMasterComponent,
    ICircularComponent,
    ServiceManualsComponent,
    OwnersManualsComponent,
    ServiceSOPComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
