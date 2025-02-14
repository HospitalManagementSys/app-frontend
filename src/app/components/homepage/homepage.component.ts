import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule],
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
  activeSection: string = 'slider'; // Inițial, se afișează secțiunea "slider"

  showContent(sectionId: string): void {
    console.log('Apăsat:', sectionId); // Debugging pentru a vedea ce secțiune este apăsată

    this.activeSection = sectionId;
    this.cdRef.detectChanges();
  }
}
