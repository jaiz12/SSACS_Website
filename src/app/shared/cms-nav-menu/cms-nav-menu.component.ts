import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-cms-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cms-nav-menu.component.html',
  styleUrl: './cms-nav-menu.component.css'
})
export class CmsNavMenuComponent {
  constructor(private router: Router, private toastr: ToastrService, private configService: ConfigService) { }
  logout(){
    localStorage.clear(); // Clears all stored data
    
  this.toastr.info('Logged out successfully!');
    const websiteUrl = this.configService.get("websiteUrl");
    window.location.href = `${websiteUrl}?logout=true`;
  }
}
