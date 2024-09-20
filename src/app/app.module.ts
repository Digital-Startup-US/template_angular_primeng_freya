import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AuthService } from './auth/auth.service';  // Import AuthService
import { AuthGuard } from './auth/auth.guard';  // Import AuthGuard



@NgModule({
    declarations: [AppComponent],
    imports: [AppRoutingModule, AppLayoutModule],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AuthService,  // Register the AuthService as a provider
        AuthGuard  // Register the AuthGuard as a provider
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
