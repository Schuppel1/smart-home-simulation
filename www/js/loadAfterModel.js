material = modelViewerColor.model.materials;


function SmartHomeDevice(imgID, modelID) {

    let active = false;
    let imgId = imgID;
    let modelId = modelID;
    let htmlButtonElement = document.querySelector(imgID); 
    
    this.turnOn = function() {
        if(!active) {

            active = true;
            rgba = [0.75, 0.75, 0, 1.0]
            // Model wird angeschaltet

            material.forEach(element => {
            if(element.name==modelId) {
                    element.pbrMetallicRoughness.setBaseColorFactor(rgba);
                    element.setEmissiveFactor(rgba);
                }
            }); 
            
            // Button wird angeschalter
            htmlButtonElement.style.backgroundColor="yellow"; 
        }
    }

    this.turnOff = function() {
        if(active) {
            active = false;
            rgba = [92/255, 84/255, 84/255, 1.0];
            // Model wird ausgeschalten
            
            material.forEach(element => {
            if(element.name==modelID) {
                    element.pbrMetallicRoughness.setBaseColorFactor(rgba);
                    element.setEmissiveFactor(rgba);
                }
            }); 
            
            // Button wird angeschalter
            htmlButtonElement.style.backgroundColor="white"; 
        }
    }

    this.switch = function() {
        if(active)
            this.turnOff();
        else 
            this.turnOn();
    }
    
}

let lampBathroom = new SmartHomeDevice("#imgLampBathroom", "lamp.3" ); 
let lampLivingroom = new SmartHomeDevice("#imgLampLivingroom", "lamp.1" ); 
let lampBedroom = new SmartHomeDevice("#imgLampBedroom", "lamp.2" ); 

let heaterBathroom = new SmartHomeDevice("#imgHeaterBathroom", "heizung.002" ); 
let heaterLivingroom = new SmartHomeDevice("#imgHeaterLivingroom", "heizung.001" ); 
let heaterBedroom = new SmartHomeDevice("#imgHeaterBedroom", "heizung.001" ); 

