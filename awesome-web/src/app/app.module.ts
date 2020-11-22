import { RefundService } from './service/refund.service';
import { AuthGuard } from './service/auth.guard';
import { ShoppingService } from './service/shopping.service';
import { UserAuthService } from './service/user-auth.service';
import { NotificationService } from './service/notification.service';
import { MessageService } from './service/message.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { appRoutes } from './routes';
import { AboutMeComponent } from './about-me/about-me.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogInComponent } from './log-in/log-in.component';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AppServiceComponent } from './aws-service/app-service/app-service.component';
import { CoachingServiceComponent } from './aws-service/coaching-service/coaching-service.component';
import { CoachingDetailComponent } from './aws-service/coaching-service/coaching-detail.component';
import { CartSummaryComponent } from './aws-service/coaching-service/cart-summary/cart-summary.component';
import { CartComponent } from './aws-service/coaching-service/cart/cart.component';
import { PaymentComponent } from './aws-service/coaching-service/payment/payment.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { BookingComponent } from './my-account/booking/booking.component';
import { EditProfileComponent } from './my-account/edit-profile/edit-profile.component';
import { AddCoachServiceComponent } from './my-account/add-coach-service/add-coach-service.component';
import { Time24To12Pipe } from './shared/time24-to12.pipe';
import { RefundedOrdersComponent } from './my-account/refunded-orders/refunded-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutMeComponent,
    HomeComponent,
    ContactUsComponent,
    LogInComponent,
    AppServiceComponent,
    CoachingServiceComponent,
    CoachingDetailComponent,
    CartSummaryComponent,
    CartComponent,
    PaymentComponent,
    MyAccountComponent,
    BookingComponent,
    EditProfileComponent,
    AddCoachServiceComponent,
    Time24To12Pipe,
    RefundedOrdersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules}),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      autoDismiss: true,
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    MessageService,
    NotificationService,
    UserAuthService,
    ShoppingService,
    RefundService,
    AuthGuard,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
