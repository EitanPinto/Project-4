import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponentComponent } from './components/page-not-found-component/page-not-found-component.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalComponent } from './components/app-components/modal/modal.component';
import { SecondPanelHomepageComponent } from './components/second-panel-homepage/second-panel-homepage.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { ThirdPanelHomepageComponent } from './components/third-panel-homepage/third-panel-homepage.component';
import { ShoppingPageComponent } from './components/shopping-page/shopping-page.component';
import { ResizableModule } from 'angular-resizable-element';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OrdersComponent } from './components/orders/orders.component'; 
import { MatNativeDateModule } from '@angular/material/core';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    RegisterComponent,
    PageNotFoundComponentComponent,
    HomepageComponent,
    SecondPanelHomepageComponent,
    ThirdPanelHomepageComponent,
    ShoppingPageComponent,
    OrdersComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ResizableModule,
    ScrollingModule,
    MatNativeDateModule 
  ],
  providers: [
    ModalComponent, 
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor , 
      multi: true 
    }, 
    LogInComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }



