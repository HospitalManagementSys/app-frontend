import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  slides = [
    {
      imageUrl:
        'https://mhospital.ro/wp-content/uploads/2022/04/pachet-M-Care-1.jpg',
      title: 'Bine ai venit la MedicaNova',
      description:
        'Echipa noastră de specialiști îți oferă tratamente personalizate, într-un mediu sigur și modern.',
    },
    {
      imageUrl: 'https://mhospital.ro/wp-content/uploads/2022/04/gineco21.jpg',
      title: 'Servicii medicale avansate',
      description:
        'Investim constant în echipamente de top și în cele mai noi metode de diagnostic și tratament.',
    },
    {
      imageUrl:
        'https://mhospital.ro/wp-content/uploads/2021/10/m-hospital-m-laborator-diagnostic-800x455-1.jpg',
      title: 'Profesioniști dedicați sănătății tale',
      description:
        'Fiecare pacient este unic. Suntem aici să îți oferim cele mai bune soluții pentru sănătatea ta.',
    },
  ];

  currentSlide = 0;
  slideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
    document.addEventListener('slider', this.showSlider.bind(this));
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
  constructor(private cdRef: ChangeDetectorRef) {}

  @Input() activeSection: string = 'slider'; // Primește secțiunea activă de la AppComponent
  @Output() sectionChange = new EventEmitter<string>(); // Trimite secțiunea activă înapoi

  showContent(sectionId: string): void {
    this.activeSection = sectionId;
    this.cdRef.detectChanges();
    // console.log('Apăsat:', sectionId);
    this.sectionChange.emit(sectionId); // Emitere eveniment către AppComponent
  }

  ngOnDestroy() {
    // Curăță evenimentul pentru a evita scurgeri de memorie
    document.removeEventListener('slider', this.showSlider.bind(this));
  }

  showSlider() {
    this.activeSection = 'slider';
  }
}
