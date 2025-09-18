import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ConfigService } from '../../shared/services/config.service';
import { AppComponent } from '../../app.component';
import { APIService } from '../../shared/services/api.service';
import { UrlParserService } from '../../shared/services/url-parser.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // HIV/AIDS awareness themed images for the carousel
  images: any = [];

  currentSlide = 0;
  private autoPlayInterval: any;
  home: any;
  home_remember: any;
  url: any;
  imageApiUrl: any;
  constructor(private appComponent: AppComponent, private api: APIService, private configService: ConfigService, private urlParser: UrlParserService,
    @Inject(DOCUMENT) private document: Document) { }

  private refreshInterval: any;

  ngOnInit() {
    this.startAutoPlay();
    this.home = this.configService.get("home_static_details");
    this.home_remember = this.configService.get("home_remember_static_details");
    // 🔹 Keep checking until url is available
    this.url = this.urlParser.getDomainFromUrl(this.document.location.href);
    if (this.url) {
      this.getHomeBannerImage();
      this.refreshInterval = setInterval(() => {
        this.getHomeBannerImage();
      }, 5000);
    }
  }

  ngOnDestroy() {
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }





  getHomeBannerImage() {
    this.api.getAll('Website/GetWebsiteContent', this.url, 'home', false).subscribe({
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

