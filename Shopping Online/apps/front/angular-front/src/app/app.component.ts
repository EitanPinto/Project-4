import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from './components/app-components/modal/modal.component';
import { ILoginResponse } from './components/log-in/log-in.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-front';
  constructor(
    public authService: AuthService, 
    private router: Router, 
    public modalComponent: ModalComponent) { 
  }

 async onLogOut() {
  const result = await this.modalComponent.onLogOut();  
  if (result.isConfirmed){
  this.authService.isSignOutButtonPresented = false;  
  this.authService.clearToken();
  this.router.navigate(['/']);
  setTimeout(() => {
    window.location.reload();
  }, 900);
  };
 };
 
};
