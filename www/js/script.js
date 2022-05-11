//Controll and must HaveObjetcs
const modelViewerColor = document.querySelector("model-viewer#color");
let initialized = false;
let locked = false;
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


function changeColor(colorModel, room, device) {
    funLoad();

    if (!initialized) {
        return;
    }
    if (!colorModel || !room || !device) {
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

    //Abfrage ob es auf oder zugeschlossen wird?
    if (locked) {
        imgLock.src = "./img/unlocked.png";
        locked=false;
    } else {
        imgLock.src = "./img/locked.png";
        locked = true;
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

