import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { UserMasterComponent } from './pages/user-master/user-master.component';
import { RoleMasterComponent } from './pages/role-master/role-master.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { ProductsTypeMasterComponent } from './pages/products-parts/products-type-master/products-type-master.component';
import { ModalMasterComponent } from './pages/products-parts/modal-master/modal-master.component';
import { AssemblyMasterComponent } from './pages/products-parts/assembly-master/assembly-master.component';
import { CatalogueAndOrderingComponent } from './pages/catalogue-and-ordering/catalogue-and-ordering.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { AuthGuard } from './auth/auth.guard';
import { DealerAssignModelComponent } from './pages/dealer-assign-model/dealer-assign-model.component';
import { AddCatalogueComponent } from './pages/catalogue-and-ordering/add-catalogue/add-catalogue.component';
import { AddToCartComponent } from './pages/catalogue-and-ordering/add-to-cart/add-to-cart.component';
import { PurchaseOrderComponent } from './pages/purchase-order/purchase-order.component';
import { OrderDetailComponent } from './pages/catalogue-and-ordering/order-detail/order-detail.component';
import { SparePartsBillingReportComponent } from './pages/spare-parts-billing-report/spare-parts-billing-report.component';
import { BackOrderReportComponent } from './pages/back-order-report/back-order-report.component';
import { BrandMasterComponent } from './pages/brand-master/brand-master.component';
import { ICircularComponent } from './pages/i-circular/i-circular.component';
import { ServiceManualsComponent } from './pages/service-manuals/service-manuals.component';
import { OwnersManualsComponent } from './pages/owners-manuals/owners-manuals.component';
import { ServiceSOPComponent } from './pages/service-sop/service-sop.component';
import { ICatalogueComponent } from './pages/i-catalogue/i-catalogue.component';
import { PendingOrderReportComponent } from './pages/pending-order-report/pending-order-report.component';
import { ApprovalOrderReportComponent } from './pages/approval-order-report/approval-order-report.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { PurchaseOrderGuard } from './auth/purchase-order.guard';
import { PendingFormGuard } from './auth/pending-form.guard';
import { PartsCatalogueComponent } from './pages/parts-catalogue/parts-catalogue.component';
import { PartDetailComponent } from './pages/parts-catalogue/part-detail/part-detail.component';
import { PartsOrderComponent } from './pages/parts-order/parts-order.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { OrderConformComponent } from './pages/order-conform/order-conform.component';
import { PartPurchaseReportComponent } from './pages/part-purchase-report/part-purchase-report.component';
import { CategoryMasterComponent } from './pages/products-parts/category-master/category-master.component';
import { PartMasterComponent } from './pages/products-parts/part-master/part-master.component';
import { AddAssemblyComponent } from './pages/products-parts/assembly-master/add-assembly/add-assembly.component';
import { CamelReportsComponent } from './pages/camel-reports/camel-reports.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-master', component: UserMasterComponent },
      { path: 'role-master', component: RoleMasterComponent },
      { path: 'brand-master', component: BrandMasterComponent },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'products-type-master', component: ProductsTypeMasterComponent },
      { path: 'model-master', component: ModalMasterComponent },
      { path: 'assembly-master', component: AssemblyMasterComponent },
      { path: 'add-assembly', component: AddAssemblyComponent },
      { path: 'category-master', component: CategoryMasterComponent },
      { path: 'part-master', component: PartMasterComponent },
      { path: 'catalogue-and-ordering', component: CatalogueAndOrderingComponent },
      { path: 'order-detail/:id', component: OrderDetailComponent },
      { path: 'dealer-assign-model', component: DealerAssignModelComponent },
      { path: 'add-catalogue', component: AddCatalogueComponent },
      { path: 'add-to-cart', component: AddToCartComponent, canActivate: [PendingFormGuard] },
      { path: 'purchase-order', component: PurchaseOrderComponent, canActivate: [PurchaseOrderGuard] },
      { path: 'spare-parts-sales-report', component: SparePartsBillingReportComponent },
      { path: 'back-order-report', component: BackOrderReportComponent },
      { path: 'pending-order-report', component: PendingOrderReportComponent },
      { path: 'approval-order-report', component: ApprovalOrderReportComponent },
      { path: 'parts-catalogue', component: PartsCatalogueComponent },
      { path: 'parts-detail', component: PartDetailComponent },
      { path: 'parts-order', component: PartsOrderComponent },
      { path: 'order-conform', component: OrderConformComponent },
      { path: 'parts-purchase-report', component: PartPurchaseReportComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'camel-reports', component: CamelReportsComponent },

      { path: 'i-catalogue', component: ICatalogueComponent },
      { path: 'technical-circula', component: ICircularComponent },
      { path: 'service-manuals', component: ServiceManualsComponent },
      { path: 'owners-manuals', component: OwnersManualsComponent },
      { path: 'service-sop', component: ServiceSOPComponent },
      { path: 'feedback', component: FeedbackComponent },
    ],
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password/:id', component: ResetPasswordComponent },

  // 404 Routing
  // {
  //   path: '**',
  //   redirectTo: 'layout',
  //   pathMatch: 'full'
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
