document.addEventListener("DOMContentLoaded", function () {
    generateGrid();
        
    const search = document.getElementById("search");
    const search_btn = document.getElementById("search_btn");
    const starting_point = document.getElementById("starting_point");
    const sp_btn = document.getElementById("starting_point_btn");
    //sp_btn = starting point button

    const result_sec = document.getElementById("results");
    const result2_sec = document.getElementById("results2");

    const start_location = document.getElementById("starting_point_area");

    let buildingMap = {};

    search.oninput = async () => {
        result_sec.innerHTML = ""; 

        const query = search.value.trim();
        if (!query) return;

        const response = await fetch(b_nameUrl + encodeURIComponent(query));
        if (!response.ok) {
            console.log("API Request Failed!");
            return;
        }

        const data = await response.json();

        buildingMap = {};

        data.buildings.forEach(building => {
            const option = document.createElement("option");
            
            option.textContent = building.name; 

            result_sec.appendChild(option);

            buildingMap[building.id] = building;
        });
    };

    search_btn.addEventListener("click", async function () {
        const input_value = search.value;
        const buildingResponse = await fetch(b_nameUrl + encodeURIComponent(input_value));
        if (!buildingResponse.ok) {
            console.log("API Request Failed!");
            return;
        }

        const buildingData = await buildingResponse.json();
        if (!buildingData.buildings || buildingData.buildings.length === 0) {
            alert("No building found with that name.");
            return;
        }

        const selected_value = buildingData.buildings[0].id;

        // console.log(selected_value);

        const numeric_value = parseInt(selected_value);
        console.log("Selected Value:", selected_value);

        const response = await fetch(squareUrl);
        if (!response.ok) {
            console.log("API Request Failed!");
            return;
        }

        const data = await response.json();
        

        const matchedSquare = data.squares.find(
            sq => sq.building && parseInt(sq.building.id) === numeric_value
        );

        if (matchedSquare) {
        console.log("Full Square Found:", matchedSquare);

        const allCells = document.querySelectorAll("#map-grid td");
        for (let cell of allCells) {
        const squareData = JSON.parse(cell.dataset.square);

        if (parseInt(squareData.id) === parseInt(matchedSquare.id)) {
            const placementSquareId = squareData.building.square_id;
            const roadSquare = data.squares.find(sq => parseInt(sq.id) === parseInt(placementSquareId));

            if (!roadSquare) {
                console.warn("No placement (road) square found!");
                return;
            }

            for (let cell2 of allCells) {
                const squareData2 = JSON.parse(cell2.dataset.square);

                if (parseInt(squareData2.id) === parseInt(placementSquareId)) {
                    updateHighlightedCell(cell2, direction);

                    currentLocation = cell2;
                    currentSquare = squareData2.id;
                    currentX = squareData2.x;
                    currentY = squareData2.y;

                    let entityType = null;
                    let entityData = null;
                    let entityXY = squareData2;

                    if (roadSquare.building) {
                        entityType = "Building";
                        entityData = roadSquare.building;
                    } else if (roadSquare.tracks && roadSquare.tracks !== "0") {
                        entityType = "Track";
                        entityData = roadSquare.track_names;
                    } else if (roadSquare.roads && roadSquare.roads !== "0") {
                        entityType = "Road";
                        entityData = roadSquare.road_names;
                    } else {
                        entityType = "Ground";
                        entityData = "Empty Ground";
                    }

                    updateDetailsPanel(entityType, entityData, entityXY);
                    fetchImage();
                    cell2.scrollIntoView({ behavior: "smooth", block: "center" });
                    break;
            }
        }

        
    }
        }

        }
        else{
                console.log("No matching building found.");
                alert("No building found with that ID.");
        }
        start_location.style.display = "flex";
    });
    
    starting_point.oninput = async () => {
        result2_sec.innerHTML = ""; 

        const query = starting_point.value.trim();
        if (!query) return;

        const response = await fetch(b_nameUrl + encodeURIComponent(query));
        if (!response.ok) {
            console.log("API Request Failed!");
            return;
        }

        const data = await response.json();

        buildingMap = {};

        data.buildings.forEach(building => {
            const option = document.createElement("option");
            
            option.textContent = building.name; 

            result2_sec.appendChild(option);

            buildingMap[building.id] = building;
        });
    };

    sp_btn.addEventListener("click", async function () {
    const input_value = starting_point.value;
    const buildingResponse = await fetch(b_nameUrl + encodeURIComponent(input_value));
    if (!buildingResponse.ok) {
        console.log("API Request Failed!");
        return;
    }

    const buildingData = await buildingResponse.json();
    if (!buildingData.buildings || buildingData.buildings.length === 0) {
        alert("No building found with that name.");
        return;
    }

    const selected_value = buildingData.buildings[0].id;
    const numeric_value = parseInt(selected_value);
    console.log("Selected Value:", selected_value);

    const response = await fetch(squareUrl);
    if (!response.ok) {
        console.log("API Request Failed!");
        return;
    }

    const data = await response.json();

    const matchedSquare = data.squares.find(
        sq => sq.building && parseInt(sq.building.id) === numeric_value
    );

    if (matchedSquare) {
        console.log("Full Square Found:", matchedSquare);

        const allCells = document.querySelectorAll("#map-grid td");
        for (let cell of allCells) {
            const squareData = JSON.parse(cell.dataset.square);

            if (parseInt(squareData.id) === parseInt(matchedSquare.id)) {
                const placementSquareId = squareData.building.square_id;
                const roadSquare = data.squares.find(sq => parseInt(sq.id) === parseInt(placementSquareId));

                if (!roadSquare) {
                    console.warn("No placement (road) square found!");
                    return;
                }

                for (let cell2 of allCells) {
                    const squareData2 = JSON.parse(cell2.dataset.square);

                    if (parseInt(squareData2.id) === parseInt(placementSquareId)) {
                        updateStartingCell(cell2);

                        startLocation = cell2;
                        startSquare = squareData2.id;
                        startX = squareData2.x;
                        startY = squareData2.y;

                        let entityType = null;
                        let entityData = null;
                        let entityXY = squareData2;

                        if (roadSquare.building) {
                            entityType = "Building";
                            entityData = roadSquare.building;
                        } else if (roadSquare.tracks && roadSquare.tracks !== "0") {
                            entityType = "Track";
                            entityData = roadSquare.track_names;
                        } else if (roadSquare.roads && roadSquare.roads !== "0") {
                            entityType = "Road";
                            entityData = roadSquare.road_names;
                        } else {
                            entityType = "Ground";
                            entityData = "Empty Ground";
                        }

                        updateDetailsPanel(entityType, entityData, entityXY);
                        fetchImage();
                        cell2.scrollIntoView({ behavior: "smooth", block: "center" });
                        break;
                    }
                }

                break;
            }
        }
    } else {
        console.log("No matching building found.");
        alert("No building found with that ID.");
    }

    start_location.style.display = "block";
});

document.getElementById("direction").addEventListener("click", async () => {
    if (startX === undefined || startY === undefined || currentX === undefined || currentY === undefined) {
        alert("Select both start and destination first.");
        return;
    }

    const startSquare = gridData.find(sq => parseInt(sq.x) === parseInt(startX) && parseInt(sq.y) === parseInt(startY));
    const goalSquare = gridData.find(sq => parseInt(sq.x) === parseInt(currentX) && parseInt(sq.y) === parseInt(currentY));

    if (!startSquare || !goalSquare) {
        alert("Start or destination square not found on the map.");
        return;
    }

    if (startSquare.id === goalSquare.id) {
        alert("Start and destination are the same.");
        return;
    }

    const path = bfsFindPath(startSquare, goalSquare, gridData);
    if (path && path.length > 1) {
        highlightPathBFS(path);
    } else {
        alert("No path found.");
    }
});


});

const url = "https://api.brickmmo.com"
const apiUrl = url+ "/map/square/city_id/1";

const localapiurl = "http://local.api.brickmmo.com:7777/map/square/city_id/1";// for localhost testing

// const b_nameUrl = url+ "/map/buildingname/name/"; // for live useage
const b_nameUrl = "http://local.api.brickmmo.com:7777/map/buildingname/name/";// for localhost testing

// const squareUrl = url+ "/map/square/city_id/1"; // for live useage
const squareUrl = "http://local.api.brickmmo.com:7777/map/square/city_id/1";// for localhost testing

let startLocation = null;
let startX = 0;
let startY = 0;
let startSquare = 0;
let start_gridData = [];

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

// --- Pathfinding Logic (Breadth-First Search) ---
// This function implements a simple BFS pathfinding algorithm to find a path from start to goal.
// It assumes that the grid is made up of walkable squares (roads/tracks)
function bfsFindPath(start, goal, gridData) {
    const queue = [];
    const visited = new Set();
    const cameFrom = new Map();
    queue.push(start);
    visited.add(start.id);

    // Direction mapping with road_rules letters
    const directions = [
        { dx: 1, dy: 0, letter: "e" },
        { dx: -1, dy: 0, letter: "w" },
        { dx: 0, dy: -1, letter: "n" },
        { dx: 0, dy: 1, letter: "s" }
    ];

    while (queue.length > 0) {
        const current = queue.shift();
        if (parseInt(current.id) === parseInt(goal.id)) {
            // Reconstruct path
            const path = [current];
            let node = current;
            while (cameFrom.has(node.id)) {
                node = cameFrom.get(node.id);
                path.push(node);
            }
            return path.reverse();
        }

        for (const dir of directions) {
            // Only allow if current block's road_rules includes the direction letter
            if (!current.road_rules || !current.road_rules.includes(dir.letter)) continue;

            const nx = parseInt(current.x) + dir.dx;
            const ny = parseInt(current.y) + dir.dy;
            const neighbor = gridData.find(sq => parseInt(sq.x) === nx && parseInt(sq.y) === ny);

            if (
                neighbor &&
                (neighbor.roads != 0 || neighbor.tracks != 0) &&
                !visited.has(neighbor.id)
            ) {
                queue.push(neighbor);
                visited.add(neighbor.id);
                cameFrom.set(neighbor.id, current);
            }
        }
    }
    return null; // No path found
}

function highlightPathBFS(path) {
    // Remove previous highlights
    document.querySelectorAll('.path-cell').forEach(cell => {
        cell.classList.remove('path-cell');
    });
    // Highlight the path (skip the first and last if you want to keep start/end special)
    if (!path) return;
    path.forEach(square => {
        const selector = `#map-grid td[data-x="${square.x}"][data-y="${square.y}"]`;
        const cell = document.querySelector(selector);
        if (cell && !cell.classList.contains('current-location') && !cell.classList.contains('starting-location')) {
            cell.classList.add('path-cell');
        }
    });
}

// Function to fetch data and create the grid
async function generateGrid() {
    try {
        const response = await fetch(localapiurl);
        if (!response.ok) {
            throw new Error("API request failed");
        }
        const data = await response.json();
        // console.log(data);

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
                            color = square.building.colour;
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
                    
                    console.log("loaded: " + currentSquare);

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
                            currentSquare = square.id;
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
    // console.log(currentSquare);
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
        console.log(currentSquare);
        if (entityType && entityData) {
            updateDetailsPanel(entityType, entityData, entityXY);
        } else {
            updateDetailsPanel("Location", { name: "Empty Land", set: "N/A", number: "N/A" }, null);
        }
    }
}

function turn(change) {

    console.log(change);
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
    }else if(change == 'back')
    {
        if(direction === "north") direction = "south";
        else if(direction === "east") direction = "west";
        else if(direction === "south") direction = "north";
        else if(direction === "west") direction = "east";
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

function updateStartingCell(cell) {
    if (startLocation) {
        startLocation.classList.remove("starting-location");
        startLocation.innerHTML = ""; // Remove old arrow
    }

    cell.innerHTML = `<span class="direction-arrow">📍</span>`;
    cell.classList.add("starting-location");
    startLocation = cell;
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

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowUp":            
            move();
            break;
        case "ArrowLeft":
            turn("west");
            break;
        case "ArrowRight":
            turn("east");
            break;
    }
});

