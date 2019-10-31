import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PhotosComponent } from './photography/photos.component';
import { ProductsComponent } from './products/products.component';
import { MessagesComponent } from './messages/messages.component';
import { ProductComponent } from './photography/product/product.component';
import { PortraitComponent } from './photography/portrait/portrait.component';
import { SoftwareComponent } from './products/software/software.component';
import { WebsitesComponent } from './products/websites/websites.component';

const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'photos', children: [
      { path: '', component: PhotosComponent },
      { path: 'portrait', component: PortraitComponent },
      { path: 'product', component: ProductComponent },
    ]
  },
  {
    path: 'products', children: [
      { path: '', component: ProductsComponent },
      { path: 'software', component: SoftwareComponent },
      { path: 'websites', component: WebsitesComponent },
    ]
  },
  { path: 'products', component: ProductsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: '**', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
