import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/auth/auth.service';  // Importar el servicio de autenticación


@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent {
    email: string = '';
    password: string = '';

    rememberMe: boolean = false;

    //constructor(private layoutService: LayoutService) {}

    constructor(private authService: AuthService, private router: Router, private layoutService: LayoutService) {}

    onSubmit() {
      const isAuthenticated = this.authService.login(this.email, this.password);
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);  // Redirigir al dashboard
      } else {
        console.error('Login fallido');
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }
}
