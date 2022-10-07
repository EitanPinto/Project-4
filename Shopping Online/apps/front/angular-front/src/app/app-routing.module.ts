import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PageNotFoundComponentComponent } from './components/page-not-found-component/page-not-found-component.component';
import { RegisterComponent } from './components/register/register.component';
import { ShoppingPageComponent } from './components/shopping-page/shopping-page.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LogInComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'shop', component: ShoppingPageComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'administration', component: AdminComponent },
  { path: '**', pathMatch: 'full',component: PageNotFoundComponentComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



