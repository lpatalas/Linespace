import { Component, OnInit } from '@angular/core';
import { Http, Response  } from '@angular/http';
import { Observable }     from 'rxjs/Observable';


import { run } from './main';
import { lrenderer } from './lrenderer';
import { ThreeJSTest } from './Threejstest';

@Component({
    moduleId: module.id,
    selector: 'linespace-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    
constructor(private http: Http){

}

    ngOnInit(){
        this.http.get("rendering/shaders/galaxy.frag")
        .map(res => res.json())
        .subscribe( p => {
            console.log(p);
        })
        var r = new lrenderer();
        r.render();
    }
 }
