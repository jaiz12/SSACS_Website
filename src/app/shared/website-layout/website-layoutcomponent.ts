import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';

@Component({
  selector: 'app-website-layout',
  imports: [RouterOutlet, FooterNavComponent],
  templateUrl: './website-layout.component.html',
  styleUrl: './website-layout.component.css'
})
export class WebsiteLayoutComponent {

}
