import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { AnalyticsService } from './shared/services/analytics.service';
import { LocationService } from './shared/services/location.service';
import { CommonModule } from '@angular/common';
import { GaService } from './shared/services/ga.service';
import { FooterNavComponent } from './shared/footer-nav/footer-nav.component';
import { ConfigService } from './shared/services/config.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FooterNavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kiosk-quiz-ui';
  // Added for timeout.
  private timeoutId: any;
  private readonly timeoutMs = 90000; // for 1.5 minute
  private locationInterval: any;
  private locationSubject = new BehaviorSubject<any>(null);
  location$ = this.locationSubject.asObservable();


  constructor(private router: Router, private route: ActivatedRoute, private ngZone: NgZone, private locationservice: LocationService, private configService: ConfigService) { // need to add this private gaService: GaService
   // this.gaService.init();
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params['logout'] === 'true') {
        localStorage.clear(); // Clear website storage
        this.router.navigate([], {
          queryParams: { logout: null },
          queryParamsHandling: 'merge'
        });
      }
      else {
        const token = localStorage.getItem('token');
        if (token) {
          console.log("website")
          const cmsUrl = this.configService.get("cmsUrl");
          window.location.href = `${cmsUrl}?token=${token}`;
        }
        else {
          this.resetTimer();
        }
      }
    });

    

    this.getLocation();
    this.locationInterval = setInterval(() => {
      this.getLocation();
      console.log("get location intervel")
    }, 60 * 60 * 1000);
  }

  ngOnDestroy() {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
      console.log("destroy")
    }
  }

  error: any;
  getLocation() {
    console.log("get location")
    this.locationservice
      .getLatLon()
      .then((position) => {
        const lat = position.lat;
        const lon = position.lon;
        console.log("test")
        this.locationservice.getLocationName(lat, lon).subscribe({
          next: (res: any) => {
            this.locationSubject.next({
              lat : res.results[0].geometry.lat,
              lon : res.results[0].geometry.lng,
              name : res.results[0].components.suburb

            })
          },
          error: () => {
            this.error = 'Failed to fetch location name.';
          },
        });
      })
      .catch((err) => {
        this.error = 'Geolocation permission denied or unavailable.';
        console.error(err);
      });
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  @HostListener('window:touchstart')

  resetTimer() {
    clearTimeout(this.timeoutId);
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => {
          this.router.navigate(['']);
        });
      }, this.timeoutMs);
    });
  }
}
