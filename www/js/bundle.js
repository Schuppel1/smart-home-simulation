(function () {
    'use strict';

    // THIS IS A MODULE!
    const helloWorld = "Hello world";
    class Beispiel extends HTMLElement {
        constructor() {
            super();
            this.innerHTML = "<h1>Hello World</h1>";
        }
    }

    // THIS IS A MODULE
    function alertMe() {
        alert("ATTENTION PLEASE");
    }

    //THIS IS THE ENTRY FILE - WRITE YOUR MAIN LOGIC HERE!
    var _a;
    console.log(helloWorld);
    console.log("someChange");
    customElements.define("my-beispiel", Beispiel);
    alertMe();
    document.querySelector("#myInput");
    document.querySelector("#myInput");
    (_a = document
        .querySelector("#myInput")) === null || _a === void 0 ? void 0 : _a.addEventListener("focus", doSmth);
    function doSmth(e) {
        const val = e.target;
        console.log(e, val.value);
    }

})();
