document.addEventListener("DOMContentLoaded", function () {
    generateGrid();
});

const apiUrl = "http://local.api.brickmmo.com:7777/map/square/city_id/1";

let currentLocation = null;
let currentX = 0;
let currentY = 0;
let direction = "north"; // Default direction
let currentSquare = 0;
let gridData = [];

const colorMap = {
    "water": "#4da6ff",
    "ground": "#b5651d",
    "road": "#d3d3d3",
    "track": "#4d4d4d",
    "building": "#1e3e67"
};

// Function to fetch data and create the grid
async function generateGrid() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("API request failed");
        }
        const data = await response.json();

        if (!data || !data.squares || data.squares.length === 0) {
            console.error("No map data available.");
            return;
        }

        gridData = data.squares;
        const grid = document.getElementById("map-grid");
        if (!grid) {
            console.error("Table element not found");
            return;
        }

        grid.innerHTML = "";

        let maxX = 0, maxY = 0;
        data.squares.forEach(sq => {
            maxX = Math.max(maxX, parseInt(sq.x));
            maxY = Math.max(maxY, parseInt(sq.y));
        });

        for (let y = 0; y <= maxY; y++) {
            let row = document.createElement("tr");

            for (let x = 0; x <= maxX; x++) {
                let cell = document.createElement("td");
                let square = data.squares.find(sq => parseInt(sq.x) === x && parseInt(sq.y) === y);

                if (square) {
                    let color = colorMap["ground"];
                    let entityType = null;
                    let entityData = null;
                    let isWalkable = false;
                    let entityXY = null;
                    currentSquare = square.id;

                    if (square.type === "water") {
                        color = colorMap["water"];
                    } else if (square.type === "ground") {
                        if (square.building) {
                            color = colorMap["building"];
                            entityType = "Building";
                            entityData = square.building;
                            isWalkable = true;
                        } else if (square.roads != 0) {
                            color = colorMap["road"];
                            entityType = "Road";
                            entityData = square.road_names;
                            entityXY = square;
                            isWalkable = true;
                        } else if (square.tracks != 0) {
                            color = colorMap["track"];
                            entityType = "Track";
                            entityData = square.track_names;
                            entityXY = square;
                            isWalkable = true;
                        }
                    }

                    cell.style.backgroundColor = color;
                    cell.dataset.x = x;
                    cell.dataset.y = y;
                    cell.dataset.walkable = isWalkable;
                    cell.dataset.square = JSON.stringify(square);

                    cell.addEventListener("click", async function () {
                        if (isWalkable) {
                            updateHighlightedCell(cell, direction);
                            currentX = x;
                            currentY = y;
                            if (entityType && entityData) {
                                updateDetailsPanel(entityType, entityData, entityXY);
                            } else {
                                updateDetailsPanel("Location", { name: "Empty Land", set: "N/A", number: "N/A" }, null);
                            }
                        }
                    });

                    if (!currentLocation && isWalkable) {
                        updateHighlightedCell(cell, direction);
                        currentX = x;
                        currentY = y;
                    }
                }

                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
    } catch (error) {
        console.error("Error fetching map data:", error);
    }
}

// Function to update the details panel
function updateDetailsPanel(type, data, entityXY) {
    const detailsText = document.getElementById("details-text");

    let detailsHTML = `<h2>${type} Details</h2>`;

    if (type === "Building") {
        detailsHTML += `<p>🏛️ Name: ${data.name}</p>`;
        detailsHTML += `<p>📦 Set: ${data.set}</p>`;
        detailsHTML += `<p>🔢 Number: ${data.number}</p>`;
    } else if (type === "Road") {
        detailsHTML += `<p>🛣️ Name: ${data}</p>`;
        detailsHTML += `<p>📍 Location: X=${entityXY.x}, Y=${entityXY.y}</p>`;
    } else if (type === "Track") {
        detailsHTML += `<p>🚂 Name: ${data}</p>`;
        detailsHTML += `<p>📍 Location: X=${entityXY.x}, Y=${entityXY.y}</p>`;
    }

    detailsText.innerHTML = detailsHTML;
    fetchImage();
}

// Function to move in a direction
async function move() {
    if (!currentLocation) {
        console.error("No location selected!");
        return;
    }

    let rows = document.querySelectorAll("#map-grid tr");
    let maxY = rows.length - 1;
    let maxX = rows[0].children.length - 1;

    let newX = currentX;
    let newY = currentY;

    if (direction === "north" && currentY > 0) newY--;
    if (direction === "south" && currentY < maxY) newY++;
    if (direction === "west" && currentX > 0) newX--;
    if (direction === "east" && currentX < maxX) newX++;

    let newCell = rows[newY].children[newX];

    if (newCell.dataset.walkable === "true") {
        updateHighlightedCell(newCell, direction);
        currentX = newX;
        currentY = newY;

        let squareData = JSON.parse(newCell.dataset.square);
        let entityType = null;
        let entityData = null;
        currentSquare = squareData.id;

        if (squareData.building) {
            entityType = "Building";
            entityData = squareData.building;
        } else if (squareData.roads != 0) {
            entityType = "Road";
            entityData = squareData.road_names;
            entityXY = squareData;
        } else if (squareData.tracks != 0) {
            entityType = "Track";
            entityData = squareData.track_names;
            entityXY = squareData;
        }
        if (entityType && entityData) {
            updateDetailsPanel(entityType, entityData, entityXY);
        } else {
            updateDetailsPanel("Location", { name: "Empty Land", set: "N/A", number: "N/A" }, null);
        }
    }
}

function turn(change) {

    // console.log(change);
    if(change === 'west')
    {
        if(direction === "north") direction = "west";
        else if(direction === "west") direction = "south"
        else if(direction === "south") direction = "east";
        else if(direction === "east") direction = "north";
    }
    else if(change === 'east')
    {
        if(direction === "north") direction = "east";
        else if(direction === "east") direction = "south";
        else if(direction === "south") direction = "west";
        else if(direction === "west") direction = "north";
    }
    const compass = document.getElementById("compass-icon");
    if (compass) {
        let deg = 0;
        if (direction === "east") deg = 90;
        else if (direction === "south") deg = 180;
        else if (direction === "west") deg = 270;
        else if (direction === "north") deg = 0;
        compass.style.transform = `rotate(${deg}deg)`;
    }
    
// console.log(direction);
    // direction = change;
    updateHighlightedCell(currentLocation, direction);
    fetchImage();
}

// Function to highlight current location and show an arrow for direction
function updateHighlightedCell(cell, direction) {
    if (currentLocation) {
        currentLocation.classList.remove("current-location");
        currentLocation.innerHTML = ""; // Remove old arrow
    }

    let arrow = "";
    if (direction == "north") arrow = "⬆";
    if (direction == "south") arrow = "⬇";
    if (direction == "west") arrow = "⬅";
    if (direction == "east") arrow = "➡";

    cell.innerHTML = `<span class="direction-arrow">${arrow}</span>`;
    cell.classList.add("current-location");
    currentLocation = cell;
}

async function fetchImage(){
    const detailsImg = document.getElementById("details-image");
    const compassIcon = document.getElementById("compass-icon");
    let imageUrl = `http://local.api.brickmmo.com:7777/map/images/city_id/1/square_id/${currentSquare}/direction/${direction}`;
    let imageResponse = await fetch(imageUrl);
    let imageData = await imageResponse.json();
    // console.log(imageData);
    // console.log(imageData.squares.length);
    if(imageData.squares.length >= 1){
    image = imageData.squares[0].image;
    if (image) {
        // console.log(image);
        detailsImg.src = image;
        detailsImg.style.display = "block";
    } else {
        detailsImg.style.display = "none";
    }
    }else detailsImg.style.display = "none";
    if (compassIcon) {
        let deg = 0;
        if (direction === "east") deg = 90;
        else if (direction === "south") deg = 180;
        else if (direction === "west") deg = 270;
        else if (direction === "north") deg = 0;
        compassIcon.style.transform = `rotate(${deg}deg)`;
    }
}