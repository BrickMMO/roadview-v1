document.addEventListener("DOMContentLoaded", function () {
    generateGrid();
});

const apiUrl = "http://local.api.brickmmo.com:7777/map/square/city_id/1";

let currentLocation = null;
let currentX = 0;
let currentY = 0;
let currentDirection = "up"; // Default direction
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

                    if (square.type === "water") {
                        color = colorMap["water"];
                    } else if (square.type === "ground") {
                        if (square.building_id && square.building_id !== "0" && square.building) {
                            color = colorMap["building"];
                            entityType = "Building";
                            entityData = square.building;
                            isWalkable = true;
                        } else if (square.road) {
                            color = colorMap["road"];
                            entityType = "Road";
                            entityData = square.road;
                            isWalkable = true;
                        } else if (square.track) {
                            color = colorMap["track"];
                            entityType = "Track";
                            entityData = square.track;
                            isWalkable = true;
                        }
                    }

                    cell.style.backgroundColor = color;
                    cell.dataset.x = x;
                    cell.dataset.y = y;
                    cell.dataset.walkable = isWalkable;
                    cell.dataset.square = JSON.stringify(square);

                    cell.addEventListener("click", function () {
                        if (isWalkable) {
                            updateHighlightedCell(cell, "up"); // Default direction when clicked
                            currentX = x;
                            currentY = y;

                            if (entityType && entityData) {
                                updateDetailsPanel(entityType, entityData);
                            } else {
                                updateDetailsPanel("Location", { name: "Empty Land", set: "N/A", number: "N/A" });
                            }
                        }
                    });

                    if (!currentLocation && isWalkable) {
                        updateHighlightedCell(cell, "up"); // Default facing direction
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
function updateDetailsPanel(type, data) {
    const detailsText = document.getElementById("details-text");

    let detailsHTML = `<h2>${type} Details</h2>`;

    if (type === "Building") {
        detailsHTML += `<p>🏛️ Name: ${data.name}</p>`;
        detailsHTML += `<p>📦 Set: ${data.set}</p>`;
        detailsHTML += `<p>🔢 Number: ${data.number}</p>`;
    } else if (type === "Road") {
        detailsHTML += `<p>🛣️ Name: ${data.name}</p>`;
        detailsHTML += `<p>📍 Location: X=${data.x}, Y=${data.y}</p>`;
    } else if (type === "Track") {
        detailsHTML += `<p>🚂 Name: ${data.name}</p>`;
        detailsHTML += `<p>📍 Location: X=${data.x}, Y=${data.y}</p>`;
    }

    detailsText.innerHTML = detailsHTML;
}

// Function to move in a direction
function move(direction) {
    if (!currentLocation) {
        console.error("No location selected!");
        return;
    }

    let rows = document.querySelectorAll("#map-grid tr");
    let maxY = rows.length - 1;
    let maxX = rows[0].children.length - 1;

    let newX = currentX;
    let newY = currentY;

    if (direction === "up" && currentY > 0) newY--;
    if (direction === "down" && currentY < maxY) newY++;
    if (direction === "left" && currentX > 0) newX--;
    if (direction === "right" && currentX < maxX) newX++;

    let newCell = rows[newY].children[newX];

    if (newCell.dataset.walkable === "true") {
        updateHighlightedCell(newCell, direction);
        currentX = newX;
        currentY = newY;

        let squareData = JSON.parse(newCell.dataset.square);
        let entityType = null;
        let entityData = null;

        if (squareData.building_id && squareData.building_id !== "0" && squareData.building) {
            entityType = "Building";
            entityData = squareData.building;
        } else if (squareData.road) {
            entityType = "Road";
            entityData = squareData.road;
        } else if (squareData.track) {
            entityType = "Track";
            entityData = squareData.track;
        }

        if (entityType && entityData) {
            updateDetailsPanel(entityType, entityData);
        } else {
            updateDetailsPanel("Location", { name: "Empty Land", set: "N/A", number: "N/A" });
        }
    }
}

// Function to highlight current location and show an arrow for direction
function updateHighlightedCell(cell, direction) {
    if (currentLocation) {
        currentLocation.classList.remove("current-location");
        currentLocation.innerHTML = ""; // Remove old arrow
    }

    let arrow = "";
    if (direction === "up") arrow = "⬆";
    if (direction === "down") arrow = "⬇";
    if (direction === "left") arrow = "⬅";
    if (direction === "right") arrow = "➡";

    cell.innerHTML = `<span class="direction-arrow">${arrow}</span>`;
    cell.classList.add("current-location");
    currentLocation = cell;
    currentDirection = direction;
}
