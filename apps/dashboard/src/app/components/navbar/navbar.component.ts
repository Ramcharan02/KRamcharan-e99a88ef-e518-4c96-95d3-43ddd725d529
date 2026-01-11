import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user$ = this.authService.currentUser$;

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
