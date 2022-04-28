const modelViewerColor = document.querySelector("model-viewer#color");

// const svgLampNames =  ["#imgLampLivingroom","#imgLampBedroom" ,"#imgLampBathroom" ]
// const svgHeaterNames = ["#imgHeaterLivingroom" , "#imgHeateBedroom", "#imgHeaterBathroom"];

// const modelLampNames = ["lamp.1","lamp.2","lamp.3" ];
// const modelHeaterNames = ["heizung.001","heizung.003", "heizung.002"]; 
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
            function SmartHomeDevice(imgID, modelID) {

                let active = false;
                let imgId = imgID;
                let modelId = modelID;
                let htmlButtonElement = document.querySelector(imgID);

                this.turnOn = function () {
                    if (!active) {

                        active = true;
                        rgba = [0.75, 0.75, 0, 1.0]
                        // Model wird angeschaltet
                        material.forEach(element => {
                            if (element.name == modelId) {
                                element.pbrMetallicRoughness.setBaseColorFactor(rgba);
                                element.setEmissiveFactor(rgba);
                            }
                        });

                        // Button wird angeschalter
                        htmlButtonElement.style.backgroundColor = "yellow";
                    }
                }

                this.turnOff = function () {
                    if (active) {
                        active = false;
                        rgba = [92 / 255, 84 / 255, 84 / 255, 1.0];
                        // Model wird ausgeschalten

                        material.forEach(element => {
                            if (element.name == modelID) {
                                element.pbrMetallicRoughness.setBaseColorFactor(rgba);
                                element.setEmissiveFactor(rgba);
                            }
                        });

                        // Button wird angeschalter
                        htmlButtonElement.style.backgroundColor = "white";
                    }
                }

                this.switch = function () {
                    if (active)
                        this.turnOff();
                    else
                        this.turnOn();
                }

            }

            lampBathroom = new SmartHomeDevice("#imgLampBathroom", "lamp.3");
            lampLivingroom = new SmartHomeDevice("#imgLampLivingroom", "lamp.1");
            lampBedroom = new SmartHomeDevice("#imgLampBedroom", "lamp.2");

            heaterBathroom = new SmartHomeDevice("#imgHeaterBathroom", "heizung.002");
            heaterLivingroom = new SmartHomeDevice("#imgHeaterLivingroom", "heizung.001");
            heaterBedroom = new SmartHomeDevice("#imgHeaterBedroom", "heizung.003");
        }
    }
} 