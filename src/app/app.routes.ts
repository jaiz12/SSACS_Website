import { Routes } from '@angular/router';
import { HomeCmsComponent } from './cms/home-cms/home-cms.component';
import { CmsLayoutComponent } from './shared/cms-layout/cms-layout.component';
import { FactsMythsCmsComponent } from './cms/facts-myths-cms/facts-myths-cms.component';
import { TakeQuizCmsComponent } from './cms/take-quiz-cms/take-quiz-cms.component';
import { AboutSsacsCmsComponent } from './cms/about-ssacs-cms/about-ssacs-cms.component';
import { AuthGuard } from './shared/services/auth.guard';
import { LocationMasterComponent } from './cms/location-master/location-master.component';
import { FaqMasterComponent } from './cms/faq-master/faq-master.component';
import { BusinessMasterComponent } from './cms/business-master/business-master.component';
import { CouponsMasterComponent } from './cms/coupons-master/coupons-master.component';
import { QuizConfigMasterComponent } from './cms/quiz-config-master/quiz-config-master.component';

export const routes: Routes = [
  {
    path: '',
    component: CmsLayoutComponent,
    //canActivate: [AuthGuard],
    children: [
      { path: 'location-master', component: LocationMasterComponent, pathMatch: 'full' },
      { path: 'home-banner-cms', component: HomeCmsComponent },
      { path: 'facts-myths-banner-cms', component: FactsMythsCmsComponent },
      { path: 'take-quiz-cms', component: TakeQuizCmsComponent },
      { path: 'our-updates-cms', component: AboutSsacsCmsComponent },
      { path: 'faq-cms', component: FaqMasterComponent },
      { path: 'business-cms', component: BusinessMasterComponent },
      { path: 'coupon-cms', component: CouponsMasterComponent },
      { path: 'quiz-config-cms', component: QuizConfigMasterComponent },
      
    ]
  },
  { path: '**', redirectTo: 'location-master' }
];
