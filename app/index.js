import * as fs from "fs";
import * as document from "document";

var addView = document.getElementById("addCaloriesSvg");
var viewView = document.getElementById("viewCaloriesSvg");

const addButton = document.getElementById("button-2");
const viewButton = document.getElementById("button-1")
const numCalButton = document.getElementById("numCalories")

addButton.addEventListener("click", (evt) => addCalories())
viewButton.addEventListener("click", (evt) => viewCalories())
numCalButton.addEventListener("click", (evt) => cycleCalories())

const backButton = document.getElementById("backButton")
backButton.addEventListener("click", (evt) => goBack())

let jsonStorage = {}

let calHistoryList = []

let todayCalories = []

function changeTimeFormat() {
	let date = new Date();

	let hours = date.getHours();
	let minutes = date.getMinutes();

	// Check whether AM or PM
	let newformat = hours >= 12 ? 'PM' : 'AM';

	// Find current hour in AM-PM Format
	hours = hours % 12;

	// To display "0" as "12"
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0' + minutes : minutes;

	return (hours + ':' + minutes + ' ' + newformat);
}


function addCalories(){
    var today = new Date();
    var date = today.getMonth()+'/'+(today.getDate())+'/'+today.getFullYear();
    var time = changeTimeFormat()

    var calories = numCalButton.text

    calHistoryList.push(`  ${time}: ${calories} calories,`)
    
    jsonStorage[date] = calHistoryList

    fs.writeFileSync("calorieHistory.txt", jsonStorage, "json");

    numCalButton.text = "100"

    let json_object  = fs.readFileSync("json.txt", "json");

    todayCalories = jsonStorage[date]

    generateScrollList(todayCalories)
}

function generateScrollList(list){
    var VTList = document.getElementById('my-tile-list');
    var TILES_PER_SEPARATOR = Math.floor(Math.random() * 5) + 1;
    var NUM_ELEMS = list.length;

    VTList.delegate = {
        getTileInfo : function(index) {
        var tile_type = ((index+1) % TILES_PER_SEPARATOR == 0) ? "separate-pool" : "colour-pool";
        return { type : tile_type,
        color : 'black',
        index : index - Math.floor((index + 1) / TILES_PER_SEPARATOR), };
        },
        configureTile : function(tile, info) {
        if (info.type == 'colour-pool') {
        tile.getElementById('bg').style.fill = info.color;
        tile.getElementById('title-text').text = list[info.index];

        tile.onclick = (evt) => {
            var y = 0;
            var x=0;
            var timerText = document.getElementById("timer");
            timerText.onmousedown = function(evt) {
                y = evt.screenY;
                x = evt.screenX;
            }
            timerText.onmouseup = function(evt) {
                let xMove = evt.screenX-x;

                if (xMove< -60 || xMove> 60) {
                    let newList = removeTiles(tile.text)
                    generateScrollList(newList)
                };
    
   }
        }
        }
        },
    };
    
    // KNOWN ISSUE: It is currently required that VTList.length be set AFTER VTList.delegate
    VTList.length = NUM_ELEMS;
}

function removeTiles(tileToRemove){
    let newCalories = []
    var index = todayCalories.indexOf(tileToRemove);
    if (index !== -1) {
        newCalories.splice(index, 1);
    }
    return newCalories
}

function viewCalories(){
    // Hide
    addView.style.display = "none";
    // Show
    viewView.style.display = "inline";


}

function goBack(){
    // Hide
    viewView.style.display = "none";
    // Show
    addView.style.display = "inline";
}

function cycleCalories(){
   let numCals = parseInt(numCalButton.text);
   if (numCals>=1000){
    numCals = 25
   }else{
    numCals += 25
   }

   numCalButton.text = `${numCals}`
}

