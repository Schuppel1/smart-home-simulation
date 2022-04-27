
const modelViewerColor = document.querySelector("model-viewer#color");
let lamp1Active = false;

// const light_living_room = document.querySelector('.trolololo');
// console.log(light_living_room);

function changeColor(colorString, room){
    let rgba;
    let svg_bulb 
    let modelLampName;

    if (!colorString || !room) {
        return;
      }

    if(room=="livingroom") {
        svg_bulb = document.querySelector("#bulbColorLivingRoom");
        modelLampName = "lamp.1";
    } else if(room=="bedroom") {
        svg_bulb = document.querySelector("#bulbColorBedroom");
        modelLampName = "lamp.2";
    } else {
        svg_bulb = document.querySelector("#bulbColorBathroom");
        modelLampName = "lamp.3"
    }

    if (!lamp1Active) {
        //Lampe wird eingeschalten
        rgba = [0.75, 0.75, 0, 1.0];
        lamp1Active = true;
        svg_bulb.style.fill = "#ff0";
        
    } else {
        rgba = [92/255, 84/255, 84/255, 1.0];
        lamp1Active = false;
        svg_bulb.style.fill = "#000";
    }

    const material = modelViewerColor.model.materials;

    material.forEach(element => {
        if(element.name==modelLampName) {
            element.pbrMetallicRoughness.setBaseColorFactor(rgba);
            element.setEmissiveFactor(rgba);
        };
    });  
  };
