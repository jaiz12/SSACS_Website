import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute, private configService: ConfigService) { }

  canActivate(): boolean {
    if (localStorage.getItem("token")) {
      console.log(localStorage.getItem("token"))
      return true; // allow access
    }
      else {
      // redirect to home or login
      window.location.href = this.configService.get("websiteUrl");
      return false;
    }
  }
}
