import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'dddd', data: { breadcrumb: 'E-Commerce Dashboard' }, loadChildren: () => import('./ecommerce/ecommerce.dashboard.module').then((m) => m.EcommerceDashboardModule) },
            { path: 'dashboard-banking', data: { breadcrumb: 'Banking Dashboard' }, loadChildren: () => import('./banking/banking.dashboard.module').then((m) => m.BankingDashboardModule) },
            { path: 'fdr', data: { breadcrumb: 'FDR Dashboard' }, loadChildren: () => import('./fdr/fdr.dashboard.module').then((m) => m.FDRDashboardModule) }
        ])
    ],
    exports: [RouterModule]
})
export class DashboardsRoutingModule {}
