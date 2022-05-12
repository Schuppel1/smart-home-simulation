//Controll and must HaveObjetcs
const modelViewerColor = document.querySelector("model-viewer#color");

let initialized = false;
let locked = false;

const RGBInputLivingroom = document.querySelector('.RGB-input-livingroom');
const RGBInputBedroom = document.querySelector('.RGB-input-bedroom');
const RGBInputBathroom = document.querySelector('.RGB-input-bathroom');
let RGBColorLivingroom = [255, 255, 0]
let RGBColorBedroom = [255, 255, 0]
let RGBColorBathroom = [255, 255, 0]

let material;

//LampObjects
let lampBathroom;
let lampLivingroom;
let lampBedroom;

//Heater Objects
let heaterBathroom;
let heaterLivingroom;
let heaterBedroom;

//Temperatur
let outSideTemp = 15;
let bedroomTempIs = outSideTemp;
let bedroomTempWant = 25;
let bathroomTempIs = outSideTemp;
let bathroomTempWant = 25;
let livingroomTempIs = outSideTemp;
let livingroomTempWant = 25;
let livingroomTimerStarted = false;
let bedroomTimerStarted = false;
let bathroomTimerStarted = false; 


function rgbArrayToString(rgbArray) {
    return "rgb(" + rgbArray[0] + "," + rgbArray[1] + "," + rgbArray[2] + ")"
}

function rgbArrayToZeroOneArray(rgbArray) {
    return [rgbArray[0] / 255, rgbArray[1] / 255, rgbArray[2] / 255, 1]
}



/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

RGBInputLivingroom.addEventListener('input', function () {
    RGBColorLivingroom = hslToRgb(RGBInputLivingroom.value / 360, 1, 0.5)
    if(initialized) {
        lampLivingroom.switchColor(RGBColorLivingroom)
    }
    
});

RGBInputBathroom.addEventListener('input', function () {
    RGBColorBathroom = hslToRgb(RGBInputBathroom.value / 360, 1, 0.5)
    if(initialized) {
        lampBathroom.switchColor(RGBColorBathroom)
    }
    
});

RGBInputBedroom.addEventListener('input', function () {
    RGBColorBedroom= hslToRgb(RGBInputBedroom.value / 360, 1, 0.5)
    if(initialized) {
        lampBedroom.switchColor(RGBColorBedroom)
    }
    
});

function changeColor(room, device) {
    funLoad();

    if (!initialized) {
        return;
    }
    if (!room || !device) {
        return;
    }
    if (room == "livingroom") {
        if (device == "heater") {
            heaterLivingroom.switch();
        } else if (device == "lamp") {
            lampLivingroom.switch();
        } else {
            console.log("Angegebene Device nicht gefunden")
            return;
        }
    } else if (room == "bedroom") {
        if (device == "heater") {
            heaterBedroom.switch();
        } else if (device == "lamp") {
            lampBedroom.switch();
        } else {
            console.log("Angegebene Device nicht gefunden")
            return;
        }
    } else if (room == "bathroom") {
        if (device == "heater") {
            heaterBathroom.switch();
        } else if (device == "lamp") {
            // console.log("buttonpressed")
            lampBathroom.switch();
        } else {
            console.log("Angegebene Device nicht gefunden")
            return;
        }
    } else {
        console.log("Angegebene Raum wurde nicht gefunden")
        return;
    }
}

//CustomEvents
const rainEvent = new CustomEvent('wether-rain', { detail: { wether: "rain" } });
const sunshineEvent = new CustomEvent('wether-sunshine', { detail: { wether: "sunshine" } });
const stormEvent = new CustomEvent('wether-storm', { detail: { wether: "storm" } });
const cloudyEvent = new CustomEvent('wether-cloudy', { detail: { wether: "cloudy" } });
const timeEvent = new CustomEvent('time', { detail: { simulationTime: 0 } });

function lockHome() {
    funLoad();

    imgLock = document.querySelector("#imgLock");
    if (!initialized) {
        return;
    }

    modelId = "lockDisplay"
    colorLocked = rgbArrayToZeroOneArray([226,0,0])
    colorOpen = rgbArrayToZeroOneArray([22,173,0])
    //Abfrage ob es auf oder zugeschlossen wird?
    if (locked) {
        imgLock.src = "./img/unlocked.png";
        locked = false;
        material.forEach(element => {
            if (element.name == modelId) {
                element.pbrMetallicRoughness.setBaseColorFactor(colorOpen);
                element.setEmissiveFactor(colorOpen);
            }
        });
    } else {
        imgLock.src = "./img/locked.png";
        locked = true;
        material.forEach(element => {
            if (element.name == modelId) {
                element.pbrMetallicRoughness.setBaseColorFactor(colorLocked);
                element.setEmissiveFactor(colorLocked);
            }
        });
    }
}


function funLoad() {
    if (!initialized) {
        if (!modelViewerColor.model) {
            alert("Das Model ist noch nicht geladen");
        } else {
            initialized = true;
            material = modelViewerColor.model.materials;
            // Object Definition
            function SmartHomeDevice(imgID, modelID, colorControlButton, colorSimulationDevice) {

                let active = false;
                let imgId = imgID;
                let modelId = modelID;
                let htmlButtonElement = document.querySelector(imgID);
                let colConButton = colorControlButton;
                let colSimDevice = colorSimulationDevice;
                const disableColorSimDevice = [92 / 255, 84 / 255, 84 / 255, 1.0];

                this.turnOn = function () {
                    if (!active) {

                        active = true;
                        //rgba = [0.75, 0.75, 0, 1.0]

                        // Model wird angeschaltet
                        material.forEach(element => {
                            if (element.name == modelId) {
                                element.pbrMetallicRoughness.setBaseColorFactor(colSimDevice);
                                element.setEmissiveFactor(colSimDevice);
                            }
                        });

                        // Button wird angeschalter
                        htmlButtonElement.style.backgroundColor = colConButton;
                    }
                }

                this.turnOff = function () {
                    if (active) {
                        active = false;
                        // Model wird ausgeschalten

                        material.forEach(element => {
                            if (element.name == modelID) {
                                element.pbrMetallicRoughness.setBaseColorFactor(disableColorSimDevice);
                                element.setEmissiveFactor(disableColorSimDevice);
                            }
                        });

                        // Button wird angeschalter
                        htmlButtonElement.style.backgroundColor = "transparent";
                    }
                }

                this.switchColor = function (rgbArray) {
                    colConButton = rgbArrayToString(rgbArray)
                    colSimDevice = rgbArrayToZeroOneArray(rgbArray)
                    if(active){
                        material.forEach(element => {
                            if (element.name == modelId) {
                                element.pbrMetallicRoughness.setBaseColorFactor(colSimDevice);
                                element.setEmissiveFactor(colSimDevice);
                            }
                        });

                        // Button wird angeschalter
                        htmlButtonElement.style.backgroundColor = colConButton;
                    }
                }

                this.switch = function () {
                    if (active)
                        this.turnOff();
                    else
                        this.turnOn();
                }

                this.isActive = function () {
                    return active;
                }

            }

            lampBathroom = new SmartHomeDevice("#imgLampBathroom", "lamp.3", "yellow", [0.75, 0.75, 0, 1.0]);
            lampLivingroom = new SmartHomeDevice("#imgLampLivingroom", "lamp.1", "yellow", [0.75, 0.75, 0, 1.0]);
            lampBedroom = new SmartHomeDevice("#imgLampBedroom", "lamp.2", "yellow", [0.75, 0.75, 0, 1.0]);

            heaterBathroom = new SmartHomeDevice("#imgHeaterBathroom", "heizung.002", "red", [0.55, 0, 0, 1.0]);
            heaterLivingroom = new SmartHomeDevice("#imgHeaterLivingroom", "heizung.001", "red", [0.55, 0, 0, 1.0]);
            heaterBedroom = new SmartHomeDevice("#imgHeaterBedroom", "heizung.003", "red", [0.55, 0, 0, 1.0]);
        }
    }
}

function countTemperatureLivingroom() {
    if(initialized) {

        if (!livingroomTimerStarted) {
            livingroomTimerStarted = true;
            var inv = setInterval(function() {    
                if(livingroomTempIs <= livingroomTempWant && livingroomTempIs >= outSideTemp ) {
                    if(heaterLivingroom.isActive() && livingroomTempIs < livingroomTempWant) {
                        //Muss geheitzt werden
                        livingroomTempIs++;
                    } else if ((heaterLivingroom.isActive() && livingroomTempIs == livingroomTempWant)) {
                        // Max Temp wurde erreicht es muss nix gemacht werden Oder AußenTemp wurde erreicht. Kälter wird es nicht. 
                    } else if (!heaterLivingroom.isActive() && livingroomTempIs == outSideTemp ) {
                        clearInterval(inv);
                        livingroomTimerStarted = false;
                    } else {
                        livingroomTempIs--;
                    }
                    document.getElementById("counterRoom1").innerHTML = livingroomTempIs.toString();
                }else {
                    clearInterval(inv);
                    livingroomTimerStarted = false;
                    }
            }, 3000);
        }
    }
}

function countTemperatureBedroom() {
    if(initialized) {

        if (!bedroomTimerStarted) {
            bedroomTimerStarted = true;
            var inv = setInterval(function() {    
                if(bedroomTempIs <= bedroomTempWant && bedroomTempIs >= outSideTemp ) {
                    if(heaterBedroom.isActive() && bedroomTempIs < bedroomTempWant) {
                        //Muss geheitzt werden
                        bedroomTempIs++;
                    } else if ((heaterBedroom.isActive() && bedroomTempIs == bedroomTempWant)) {
                        // Max Temp wurde erreicht es muss nix gemacht werden Oder AußenTemp wurde erreicht. Kälter wird es nicht. 
                    } else if (!heaterBedroom.isActive() && bedroomTempIs == outSideTemp ) {
                        clearInterval(inv);
                        bedroomTimerStarted = false;
                    } else {
                        bedroomTempIs--;
                    }
                    document.getElementById("counterRoom2").innerHTML = bedroomTempIs.toString();
                }else {
                    clearInterval(inv);
                    bedroomTimerStarted = false;
                    }
            }, 3000);
        }
    }
}

function countTemperatureBathroom() {
    if(initialized) {

        if (!bathroomTimerStarted) {
            bathroomTimerStarted = true;
            var inv = setInterval(function() {    
                if(bathroomTempIs <= bathroomTempWant && bathroomTempIs >= outSideTemp ) {
                    if(heaterBathroom.isActive() && bathroomTempIs < bathroomTempWant) {
                        //Muss geheitzt werden
                        bathroomTempIs++;
                    } else if ((heaterBathroom.isActive() && bathroomTempIs == bathroomTempWant)) {
                        // Max Temp wurde erreicht es muss nix gemacht werden Oder AußenTemp wurde erreicht. Kälter wird es nicht. 
                    } else if (!heaterBathroom.isActive() && bathroomTempIs == outSideTemp ) {
                        clearInterval(inv);
                        bathroomTimerStarted = false;
                    } else {
                        bathroomTempIs--;
                    }
                    document.getElementById("counterRoom3").innerHTML = bathroomTempIs.toString();
                }else {
                    clearInterval(inv);
                    bathroomTimerStarted = false;
                    }
            }, 3000);
        }
    }
}

