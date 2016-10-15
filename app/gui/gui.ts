//<reference path="../../typings/jquery.d.ts" />

import {Guid} from '../common/guid';

var counter = 0;

export class Gui {
    static popup(event:MouseEvent) {
        counter++;
        var mainContainer:HTMLElement = document.getElementById("main-container");

        LoadFile('/app/gui/popup.html').then((succ:string) => {
            var elem:HTMLElement = document.createElement("div");
            let popupId = Guid.newGuid();

            succ = succ.replace("{{title}}", "Planet details for: " + counter.toString());
            succ = succ.replace("{{popupId}}", popupId);

            elem.innerHTML = succ;
            mainContainer.insertAdjacentElement('beforeEnd', elem);
            $('#myModal').show(); ///modal('show');

            // //make draggable
            // var popupHandle = $("#" + popupId);
            // //console.log(popupHandle);
            // popupHandle.draggable({
            //     handle: ".header"
            // });

            // //set position at cursor
            // popupHandle.css("top", event.clientY + 10);
            // popupHandle.css("left", event.clientX + 10);
            // popupHandle.css("position", "fixed");

            elem.addEventListener("click", (ev:MouseEvent) => {
                let evExt = <Ext.EventTargetExt>ev.target;

                //console.log(ev.screenX + ' ' + ev.screenY);
                if (evExt != undefined && evExt.id == "close") {
                    //elem.style.top = ev.clientY.toString();
                    //elem.style.left = ev.clientX.toString();
                    mainContainer.removeChild(elem);
                }

            }, false);
        }, (err) => {
            alert(err);
        });

        //Promise.resolve("Success").then(function (value) {
        //    console.log(value); // "Success"
        //}, function (value) {
        //    // not called
        //});
    }
}

function LoadFile(path:string) {

    return new Promise((resolve, reject) => {
        var req:XMLHttpRequest = new XMLHttpRequest();
        req.open('GET', path, true);

        req.onreadystatechange = (ev:ProgressEvent) => {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    resolve(req.response);
                }
                else {
                    reject(req.response);
                }
            }
        };

        req.send();
    });
}

//function getContent(ev: XMLHttpRequest) {
//    return ev.responseBody;
//}

