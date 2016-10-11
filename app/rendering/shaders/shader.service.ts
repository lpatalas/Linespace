import { Injectable } from '@angular/core';
import './rxjs-operators';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ShaderService {

    constructor(private http: Http) {

    }

    get() {
        this.http.get("bin/rendering/shaders/galaxy.frag")
            .map(p => p)
            .subscribe(p => {
                console.log(p);
            })
    }

    // getGalaxyFrag():Observable<string> {

    //     new Observable( observer =>{
    //         this.http.get("bin/rendering/shaders/galaxy.frag")
    //         .map(res => res)
    //         .subscribe(p => {
    //             observer.next(p)
    //         });
    //     })        
    // }


    // getGalaxyVert():Observable<string> {
    //     this.http.get("bin/rendering/shaders/galaxy.vert")
    //         .map(res => res)
    //         .subscribe(p => {
    //             console.log(p);
    //         });
    // }
}