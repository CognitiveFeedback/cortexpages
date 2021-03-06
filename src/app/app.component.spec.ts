import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { PhotosComponent } from './photography/photos.component';
import { ContactComponent } from './contact/contact.component';
import { ProductsComponent } from './products/products.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from './services/data-service.service';
import { HttpClientModule } from '@angular/common/http';
import { MessagesComponent } from './messages/messages.component';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DiagnosticsComponent } from './diagnostics/diagnostics.component';
import { PortraitComponent } from './photography/portrait/portrait.component';
import { ProductComponent } from './photography/product/product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SoftwareComponent } from './products/software/software.component';
import { WebsitesComponent } from './products/websites/websites.component';

export const MODULE = {
  declarations: [
    AppComponent,
    AboutComponent,
    ContactComponent,
    HomeComponent,
    PhotosComponent,
    ProductsComponent,
    MessagesComponent,
    SidebarComponent,
    DiagnosticsComponent,
    PortraitComponent,
    ProductComponent,
    SoftwareComponent,
    WebsitesComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterTestingModule
  ],
  providers: [
    DataService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
};
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule(MODULE).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'CortexPages'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('CortexPages');
  });
});
