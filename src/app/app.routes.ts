import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FactsMythsComponent } from './pages/facts-myths/facts-myths.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { FaqComponent } from './pages/faq/faq.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { AuthGuard } from './shared/services/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'facts-myths', component: FactsMythsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
