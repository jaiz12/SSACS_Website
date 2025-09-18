import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';
import { APIService } from '../../shared/services/api.service';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-facts-myths',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './facts-myths.component.html',
  styleUrls: ['./facts-myths.component.css']
})
export class FactsMythsComponent implements OnInit, OnDestroy {
  // Facts & Myths themed images for the carousel
  images: any = [];
  location: any;
  imageApiUrl: any;
  constructor(private appComponent: AppComponent, private api: APIService, private configService: ConfigService) { }

  currentSlide = 0;
  private autoPlayInterval: any;
  private locationInterval: any;
  private refreshInterval: any;

  ngOnInit() {
    this.startAutoPlay();
    // 🔹 Keep checking until location is available
    this.appComponent.location$.subscribe(location => {
      this.location = location;
      console.log('Location:', this.location);

      if (this.location) {
        this.getFactsAndMythsBannerImage();
        this.refreshInterval = setInterval(() => {
          this.getFactsAndMythsBannerImage();
        }, 5000);
        clearInterval(this.locationInterval);
      }
    });
  }

  ngOnDestroy() {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
    }
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.images.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Pause auto-play when user interacts with navigation
  onNavigationClick() {
    this.stopAutoPlay();
    this.startAutoPlay(); // Restart auto-play
  }


  getFactsAndMythsBannerImage() {
    this.api.getAll('Website/GetWebsiteContent', this.location, 'facts', false).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.images = [];
          var images = JSON.parse(res.data[0].image_path);
          images.forEach((data: any) => {
            this.images.push({ image: this.imageApiUrl + data, title: res.data[0].title });
          });
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
