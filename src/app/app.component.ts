import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { AnalyticsService } from './shared/services/analytics.service';
import { CommonModule } from '@angular/common';
import { ConfigService } from './shared/services/config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kiosk-quiz-ui';
  
  constructor(private router: Router, private route: ActivatedRoute, private ngZone: NgZone, private configService: ConfigService,) { // need to add this private gaService: GaService
   // this.gaService.init();
  }

  ngOnInit() {

    //this.route.queryParams.subscribe(params => {
    //  const token = params['token'];
    //  if (token) {
    //    // Save in localStorage for later API calls
    //    localStorage.setItem('token', token);

    //    // ⚡ Optional: Remove token from URL after saving
    //    this.router.navigate([], {
    //      queryParams: { token: null },
    //      queryParamsHandling: 'merge'
    //    });
    //    this.router.navigate(['/location-master']);
    //  }
    //  if (!localStorage.getItem("token")) {
    //    window.location.href = this.configService.get("websiteUrl");
    //  }
    //});

  }
 
}
