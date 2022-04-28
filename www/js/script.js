const modelViewerColor = document.querySelector("model-viewer#color");

let material;

let lampBathroom;
let lampLivingroom;
let lampBedroom;

let heaterBathroom;
let heaterLivingroom;
let heaterBedroom;

let initialized = false;

function changeColor(colorString, room, device) {
    funLoad();

    if(!initialized) {
        return;
    }
    if (!colorString || !room || !device) {
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
                        htmlButtonElement.style.backgroundColor = "transparent" ;
                    }
                }

                this.switch = function () {
                    if (active)
                        this.turnOff();
                    else
                        this.turnOn();
                }

            }

            lampBathroom = new SmartHomeDevice("#imgLampBathroom", "lamp.3","yellow",[0.75, 0.75, 0, 1.0]);
            lampLivingroom = new SmartHomeDevice("#imgLampLivingroom", "lamp.1","yellow",[0.75, 0.75, 0, 1.0]);
            lampBedroom = new SmartHomeDevice("#imgLampBedroom", "lamp.2","yellow",[0.75, 0.75, 0, 1.0]);

            heaterBathroom = new SmartHomeDevice("#imgHeaterBathroom", "heizung.002", "red",[0.55, 0, 0, 1.0]);
            heaterLivingroom = new SmartHomeDevice("#imgHeaterLivingroom", "heizung.001","red",[0.55, 0, 0, 1.0] );
            heaterBedroom = new SmartHomeDevice("#imgHeaterBedroom", "heizung.003", "red",[0.55, 0, 0, 1.0]);
        }
    }
} 