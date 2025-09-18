import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppComponent } from '../../app.component';
import { APIService } from '../../shared/services/api.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit, OnDestroy {
  faqsDetails: any[] = [];
  openIndex: number = 0; // first FAQ open by default
  private locationInterval: any;
  private refreshInterval: any;
  location: any = [];

  constructor(private appComponent: AppComponent, private api: APIService) { }

  ngOnInit() {
    // 🔹 Keep checking until location is available
    this.appComponent.location$.subscribe(location => {
      this.location = location;
      console.log('Location:', this.location);

      if (this.location) {
        this.getFAQs();
        this.refreshInterval = setInterval(() => {
          this.getFAQs();
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

  toggleFaq(index: number) {
    this.openIndex = this.openIndex === index ? -1 : index;
  }

  getFAQs() {
    this.api.getAll('Website/GetWebsiteContent', this.location, 'faqs', false).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.faqsDetails = res.data;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
    
  }
}
