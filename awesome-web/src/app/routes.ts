import { Routes } from '@angular/router';
import { HomeComponent } from '../app/home/home.component'
import { AboutMeComponent } from '../app/about-me/about-me.component'

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'about-me', component: AboutMeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full'}
]
