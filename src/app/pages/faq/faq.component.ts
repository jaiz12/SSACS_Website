import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AppComponent } from '../../app.component';
import { APIService } from '../../shared/services/api.service';
import { UrlParserService } from '../../shared/services/url-parser.service';

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
  url: any = [];

  constructor(private appComponent: AppComponent, private api: APIService, private urlParser: UrlParserService,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    // 🔹 Keep checking until location is available
    this.url = this.urlParser.getDomainFromUrl(this.document.location.href);
    if (this.url) {
      this.getFAQs();
      this.refreshInterval = setInterval(() => {
        this.getFAQs();
      }, 5000);
    }
        
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  toggleFaq(index: number) {
    this.openIndex = this.openIndex === index ? -1 : index;
  }

  getFAQs() {
    this.api.getAll('Website/GetWebsiteContent', this.url, 'faqs', false).subscribe({
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
