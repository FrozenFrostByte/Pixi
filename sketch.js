var gridSize=8;
var current;
var grid;
var out=120;
var colorInputs;
var wait=0;
var screenw=400;
var awnser;
var screenh=400;
var img;
var saveButton;
var button;
var help;
var returningValue;
var fileInput;
var localSaveButton;
var loadSave;
function setup() {
  createCanvas(screenw,screenh);
  
  localSaveButton=createButton("Save to Web")
  localSaveButton.position(screenw/4,screenh+50)
  localSaveButton.mousePressed(saveWeb)
    localSaveButton=createButton("Load Web File")
  localSaveButton.position(screenw/2,screenh+50)
  localSaveButton.mousePressed(loadWeb)
  help=createButton("Instructions")
  help.position(0,screenh+50)
  help.mousePressed(getHelp)
  button=createButton("Set New Size")
  button.mousePressed(buttonPressed);
  button.position(0,screenh+25);
  saveButton=createButton("Save Project")
  saveButton.mousePressed(downloadProject);
  saveButton.position(screenw/4,screenh+25)
  fileInput=createFileInput(uploaded)
  fileInput.position(screenw/2,screenh+25)
  img=createImage(gridSize,gridSize)
  img.loadPixels()
  colorInputs=[createSlider(0,255,0),createSlider(0,255,0),createSlider(0,255,0)];
  if(getItem("windowSave")==null){grid=createGrid(gridSize);}else{grid=getItem("windowSave")}
}

function draw() {
  background(220);
  drawGrid(grid,gridSize)
  saveImage();
  colorPallet(colorInputs)
}

function createGrid(gs,g,pixelGrid){
  pixelGrid=[];
  g=0;
  while(gs*gs>=g){
    pixelGrid[g]=["empty"]
    g++;
  }
  return pixelGrid
}

function drawGrid(pixelGrid,gs,g,x,y,newImg){
  newImg=createImage(gridSize,gridSize)
  newImg.loadPixels();
  x=0;
  y=0;
  g=0;
  while(gs*gs>=g){
    if(pixelGrid[g][0]!=="empty"){
      noStroke();
    fill(pixelGrid[g][0],pixelGrid[g][1],pixelGrid[g][2])
    rect(x*screenw/gs,y*screenh/gs,screenw/gs,screenh/gs) 
    newImg.set(x,y,color(pixelGrid[g][0],pixelGrid[g][1],pixelGrid[g][2]))
    newImg.updatePixels()
    }
    x++;
    g++;
    if(x>=gs){
      x=0;
      y++;
    }
  }
  img=newImg
}

function editColors(pixelGrid,gs,g,x,y){
x=0;
y=0;
g=0;
while(gs*gs>=g){
  if(mouseX>x&&x+screenw/gs>mouseX){
    if(y<mouseY&&mouseY<y+screenh/gs){
            if(key=="p"&&pixelGrid[g][0]!=="empty"){
        colorInputs[0].value(pixelGrid[g][0])
        colorInputs[1].value(pixelGrid[g][1])
        colorInputs[2].value(pixelGrid[g][2])
        key=0;
      }else{
      if(pixelGrid[g][0]=="empty"){
      pixelGrid[g]=[colorInputs[0].value(),colorInputs[1].value(),colorInputs[2].value()]
  }else{pixelGrid[g]=["empty"]}}}}
  x+=screenw/gs;
  if(x>=screenw){
    x=0;
    y+=screenh/gs;
  }
  g++;
}
  return pixelGrid
}

function draggedColors(pixelGrid,gs,g,x,y){
  
x=0;
y=0;
g=0;
while(gs*gs>=g){
  if(mouseX>x&&x+screenw/gs>mouseX){
    if(y<mouseY&&mouseY<y+screenh/gs){
      pixelGrid[g]=[colorInputs[0].value(),colorInputs[1].value(),colorInputs[2].value()]
}}
  x+=screenw/gs;
  if(x>=screenw){
    x=0;
    y+=screenh/gs;
  }
  g++;
}
  return pixelGrid
}
function mousePressed(){
  grid=editColors(grid,gridSize);
}
function mouseDragged(){
  if(out>60){grid=draggedColors(grid,gridSize);}else{out++}
}

function saveImage(){
if(key=="s"&&wait>30){
    save(img,str(window.prompt("What would you like your image to be called?"))+".png")
    key=0;
    wait=0;
  }
  storeItem("windowSave",grid)
  wait++}
function buttonPressed(){
  if(window.prompt("Are you sure you want to change the size?\n\nThis will delete your current art, so you should save it beforehand.")=="yes"){
  returningValue=0
  while(returningValue<=0){
  returningValue=~~abs(window.prompt("What size? Put something above zero."))
  }
  gridSize=returningValue;
  img=createImage(gridSize,gridSize)
  img.loadPixels()
  grid=createGrid(gridSize)
  }
  out=0;
}

function uploaded(file){
grid=file.data
gridSize=findSize(grid)
out=0;
}


function downloadProject(writing){
writing=createWriter(window.prompt("What would you like to name your project?")+".JSON")
writing.print(fix(grid))
writing.close()
out=0;
}

function fix(data,g,newData){
  newData="["
  g=0;
  while(data[g]!==undefined){
    if(data[g][0]=="empty"){
    if(data[g+1]!==undefined){
      newData+="["+str('"')+"empty"+str('"')+"],"}else{
      newData+="["+str('"')+"empty"+str('"')+"]"}}else{    
        if(data[g+1]!==undefined){newData+="["+data[g]+"],"}else{newData+="["+data[g]+"]"}}
    g++
  }
  return newData+=","+"["+gridSize+"]]"
}

function findSize(data,g){
  g=0;
  while(data[g]!==undefined){
    g++
  }
  return data[g-1][0]
}

function getHelp(){
  window.alert("How to Use: \n\nTo save your art as an image, press S \n\nThe sliders on the bottom of the screen control the colors of the pixels you draw. The first one controls red, the second one controls green, and the third controls blue. \n\nTo create a pixel, click where you want to go and it will appear. If you click on a pixel after it has been placed, it will be deleted. \n\nTo get the color from a pixel, hover your mouse over it and press P. The sliders will adjust and switch to the color of the pixel you clicked.\n\nTo save your project, click the save button and save it to your computer. If you want to reload it later, upload it after clicking the 'Choose File' button.")
}

function saveWeb(){
  storeItem("webSave",grid)
}

function loadWeb(){
  grid=getItem("webSave")
}

function colorPallet(colorValues){
strokeWeight(10);
stroke(0)
noFill()
stroke(colorValues[0].value(),colorValues[1].value(),colorValues[2].value())
rectMode(CENTER)
rect(screenw/2,screenh/2,screenw,screenh)
rectMode(CORNER)
}