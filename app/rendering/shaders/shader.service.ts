import { Injectable } from '@angular/core';
import '../../rxjs-operators';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ShaderService {

    constructor(private http: Http) {

    }

    // getGalaxyFragment() {
    //     this.http.get("bin/rendering/shaders/galaxy.frag")
    //         .map(p => p)
    //         .subscribe(p => {
    //             console.log(p);
    //         })
    // }

    getGalaxyFrag():Observable<string> {

        return new Observable<string>( observer =>{
            this.http.get("bin/rendering/shaders/galaxy.frag")
            .map(res => res.text())
            .subscribe(p => {
                observer.next(p);
                observer.complete();
            });
        })        
    }


    getGalaxyVert():Observable<string> {
        return new Observable<string>(observer => {
            this.http.get("bin/rendering/shaders/galaxy.vert")
            .map(res => res.text())
            .subscribe(p => {
                observer.next(p);
                observer.complete();
            });
        });
    }
}