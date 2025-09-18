import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';
import { APIService } from '../../shared/services/api.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit{
  about: any;
  ourMission: any = [];
  ourUpdates: any = [];
  location: any;
  private locationInterval: any;
  private refreshInterval: any;

  // Inject ConfigService via constructor
  constructor(private configService: ConfigService, private appComponent: AppComponent, private api: APIService) { }

  ngOnInit(){
    this.about = this.configService.get("about_ssacs_static_details");
    this.ourMission = this.configService.get("about_our_mission_static_details");
    this.appComponent.location$.subscribe(location => {
      this.location = location;
      console.log('Location:', this.location);

      if (this.location) {
        this.getOurUpdates();
        this.refreshInterval = setInterval(() => {
          this.getOurUpdates();
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

  getOurUpdates() {
    this.api.getAll('Website/GetWebsiteContent', this.location, 'about', false).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.ourUpdates = res.data;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
    

  }

 
}
