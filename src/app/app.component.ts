import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    // HomepageComponent,
    RouterOutlet,
    CommonModule,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private router: Router) {}
  title = 'app-frontend';

  activeSection: string = 'slider'; // Secțiunea implicită

  showContent(sectionId: string): void {
    console.log('Apăsat:', sectionId);
    this.activeSection = sectionId;
  }

  onLogoClick() {
    if (this.router.url === '/homepage') {
      // Dacă suntem deja pe homepage, trimitem evenimentul către HomepageComponent
      document.dispatchEvent(new CustomEvent('slider'));
      this.activeSection = 'slider';
    } else {
      // Dacă suntem pe altă pagină, navigăm către homepage
      this.router.navigate(['/homepage']);
    }
  }
}
