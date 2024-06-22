import { Component } from '@angular/core';
import { MainFooterComponent } from '../../shared/main-footer/main-footer.component';
import { MainNavbarComponent } from '../../shared/main-navbar/main-navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [MainFooterComponent, MainNavbarComponent, RouterOutlet],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss',
})
export class HomeLayoutComponent {}
