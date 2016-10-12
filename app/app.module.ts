import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { HttpModule } from '@angular/http';

import { ShaderService } from './rendering/shaders/shader.service';

@NgModule({
  imports:      [ BrowserModule, HttpModule ],
  declarations: [ AppComponent ],
  providers: [ShaderService],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
