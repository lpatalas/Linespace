import { Component, OnInit } from '@angular/core';
import { run } from './main';
import { lrenderer } from './lrenderer';

@Component({
    moduleId: module.id,
    selector: 'linespace-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {


    ngOnInit() {
        run();

//         this.shaderService.getGalaxyFrag().subscribe(p=> {
// console.log(p);
//         });
        //run();
        //var r = new lrenderer();
        //r.render();
    }
}
