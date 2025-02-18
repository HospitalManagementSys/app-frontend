import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() logoClicked = new EventEmitter<string>();
  constructor(private router: Router) {}
  onLogoClick() {
    this.logoClicked.emit('slider'); // Emitere eveniment către homepage
  }
  login(): void {
    this.router.navigate(['/login']);
  }
}
