import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean = false;

  constructor() {}

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    // Aquí podrías verificar un token en localStorage o algún indicador del login
    return this.isLoggedIn;
  }

  // Lógica de login
  login(username: string, password: string): boolean {
    // Aquí pones tu lógica de autenticación real (llamada a la API, etc.)
    if (username === 'admin' && password === 'password') {
      this.isLoggedIn = true;  // Simulación de login exitoso
      return true;
    }
    return false;  // Login fallido
  }

  // Lógica de logout
  logout(): void {
    this.isLoggedIn = false;  // Cierra sesión
  }
}