import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

declare let gtag: Function;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private pageStartTime = Date.now();
  private isBrowser: boolean;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // Track page navigation time
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          this.trackTimeOnPage();
          this.pageStartTime = Date.now();
        }

        if (event instanceof NavigationEnd) {
          this.sendPageView(event.urlAfterRedirects);
        }
      });

      // Track time on last page when leaving site
      window.addEventListener('beforeunload', () => this.trackTimeOnPage());

      // Track all clicks on buttons/links
      document.addEventListener('click', this.trackClickEvents);
    }
  }

  private sendPageView(path: string) {
    console.log('Page view:', path);
    gtag('event', 'page_view', {
      page_path: path
    });
  }

  private trackTimeOnPage() {
    const timeSpent = Date.now() - this.pageStartTime;
    const path = window.location.pathname;
    console.log('Time on page:', path, Math.floor(timeSpent / 1000), 'sec');
    gtag('event', 'time_on_page', {
      page_path: path,
      time_spent_sec: Math.floor(timeSpent / 1000)
    });
  }

  private trackClickEvents = (event: Event) => {
    const target = event.target as HTMLElement;
    const tag = target.tagName.toLowerCase();

    if (['button', 'a', 'label'].includes(tag)) {
      let label =
        target.getAttribute('data-analytics-label') || // Best: custom attribute
        target.getAttribute('aria-label') ||           // Accessible label
        target.innerText ||                            // Visible text
        target.getAttribute('title') ||                // Tooltip title
        target.id ||                                   // Element ID
        target.className ||                            // Element class
        'unknown';
      label = label.toString().trim();
      console.log('Clicked element:', tag, label.trim(), window.location.pathname, this.getOrCreateClientId());

      gtag('event', 'element_click', {
        element: tag,
        label: label.trim(),
        page_path: window.location.pathname,
        client_id: this.getOrCreateClientId()
      });
    }
  };

  private getOrCreateClientId(): string {
    const key = 'client_id';
    let clientId = localStorage.getItem(key) || this.getCookie(key);;

    if (!clientId) {
      clientId = crypto.randomUUID(); // fallback: use other UUID generator if needed
      localStorage.setItem(key, clientId);
      document.cookie = `client_id=${clientId}; path=/; max-age=31536000`; // 1 year
    }

    return clientId;
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
}
