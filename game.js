import TileMap from "./TileMap.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 32;

const tileMap = new TileMap(tileSize);

const detailBox = document.createElement("div");
detailBox.id = "detail-box";
detailBox.style.position = "absolute";
detailBox.style.top = "20px";
detailBox.style.right = "20px";
detailBox.style.padding = "10px";
detailBox.style.background = "white";
detailBox.style.border = "1px solid black";
document.body.appendChild(detailBox);

function gameLoop() {
  tileMap.draw(canvas, ctx);
}

setInterval(gameLoop, 1000 / 60);

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / tileSize);
    const y = Math.floor((event.clientY - rect.top) / tileSize);
    const tileType = tileMap.map[y][x];
    fetchDetails(tileType);
});

async function fetchDetails(tileType) {
    const apiEndpoints = {
        3: "http://local.api.brickmmo.com:7777/map/building",
        1: "http://local.api.brickmmo.com:7777/map/road",
        2: "http://local.api.brickmmo.com:7777/map/track"
    };

    if (apiEndpoints[tileType]) {
        try {
            const response = await fetch(apiEndpoints[tileType]);
            const data = await response.json();
            displayDetails(tileType, data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    }
}

function displayDetails(tileType, data) {
    const typeNames = {
        3: "Building",
        1: "Road",
        2: "Track"
    };
    
    detailBox.innerHTML = `<h3>${typeNames[tileType]} Details</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>`;
}

