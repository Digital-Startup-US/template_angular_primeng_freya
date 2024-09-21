import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FDRDashboardRoutingModule } from './fdr.dashboard-routing.module';
import { FDRDashboardComponent } from './fdr.dashboard.component';
import { FormTableModule } from 'src/app/demo/components/ui/form-table/form-table.module';


@NgModule({
    imports: [CommonModule, FDRDashboardRoutingModule, FormTableModule],
    declarations: [FDRDashboardComponent]
})
export class FDRDashboardModule {}
