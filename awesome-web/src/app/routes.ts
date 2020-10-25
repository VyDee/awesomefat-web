import { AddCoachServiceComponent } from './my-account/add-coach-service/add-coach-service.component';
import { EditProfileComponent } from './my-account/edit-profile/edit-profile.component';
import { BookingComponent } from './my-account/booking/booking.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { PaymentComponent } from './aws-service/coaching-service/payment/payment.component';
import { CartComponent } from './aws-service/coaching-service/cart/cart.component';
import { CartSummaryComponent } from './aws-service/coaching-service/cart-summary/cart-summary.component';
import { CoachingDetailComponent } from './aws-service/coaching-service/coaching-detail.component';
import { CoachingServiceComponent } from './aws-service/coaching-service/coaching-service.component';
import { LogInComponent } from './log-in/log-in.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { Routes } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { AboutMeComponent } from '../app/about-me/about-me.component';
import { AppServiceComponent } from './aws-service/app-service/app-service.component';
import { AuthGuard } from './service/auth.guard';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'about-me', component: AboutMeComponent },
    { path: 'contact-us', component: ContactUsComponent},
    { path: 'log-in', component: LogInComponent},
    { path: 'services/app-dev', component: AppServiceComponent},
    { path: 'services/coaching', component: CoachingServiceComponent},
    { path: 'services/coaching/:id', component: CartComponent,
      children: [
        {path: '', component: CoachingDetailComponent},
        {path: 'summary', component: CartSummaryComponent},
        {path: 'payment', component: PaymentComponent}
      ]
    },
    { path: 'my-account', component: MyAccountComponent,
      children: [
        {path: '', component: BookingComponent},
        {path: 'booking', component: BookingComponent},
        {path: 'edit-profile', component: EditProfileComponent},
        {path: 'add-coachService', component: AddCoachServiceComponent}
      ]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full'}
];


