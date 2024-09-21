import { Component } from '@angular/core';

@Component({
    templateUrl: './fdr.dashboard.component.html'
})
export class FDRDashboardComponent {

    forms = [
        { id: 1, title: 'Formulario 1', status: 'Submitted', submitter: 'John Doe', date: new Date() },
        { id: 2, title: 'Formulario 2', status: 'In Review', submitter: 'Jane Smith', date: new Date() }
      ];
    
      loading: boolean = false;
    
      ngOnInit(): void {
        // Puedes cargar datos desde una API aquí si tienes un servicio conectado
      }

}
