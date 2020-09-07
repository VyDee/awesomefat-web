import { LogInComponent } from './log-in/log-in.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { Routes } from '@angular/router';
import { HomeComponent } from '../app/home/home.component'
import { AboutMeComponent } from '../app/about-me/about-me.component';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'about-me', component: AboutMeComponent },
    { path: 'contact-us', component: ContactUsComponent},
    { path: 'log-in', component: LogInComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full'}
]
