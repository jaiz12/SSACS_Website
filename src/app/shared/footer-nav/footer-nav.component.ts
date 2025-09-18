import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class FooterNavComponent {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  email: any;
  mailto: any;
  constructor(private configService: ConfigService) {}

  ngOnInit(){
    this.email = this.configService.get("footerEmail");
    this.mailto = "mailto:" + this.email;
  }
}
