import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn(): boolean {
    // Example check; replace with real logic (token check, session check, etc.)
    return !!localStorage.getItem('token');
  }
}