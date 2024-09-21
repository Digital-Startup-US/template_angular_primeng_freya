import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FDRDashboardComponent } from './fdr.dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: FDRDashboardComponent }])],
    exports: [RouterModule]
})
export class FDRDashboardRoutingModule {}
