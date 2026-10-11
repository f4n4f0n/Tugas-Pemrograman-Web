import { Routes } from '@angular/router';
import { LandingPage } from './features/landing-page/landing-page';
import { kalkulator } from './features/budget-settings/kalkulator';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'kalkulator', component: kalkulator },
];