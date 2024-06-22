import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { LoadingService } from './services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mango-store-frontend';
  loading: boolean = false;

  constructor(private loadingService: LoadingService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadingService.loadingStatus$.subscribe(isLoading => {
      this.loading = isLoading;
      this.changeDetectorRef.detectChanges();
    });
  }
}
