document.addEventListener("DOMContentLoaded", function () {
  generateGrid();
});

// API URL
const apiUrl = "http://local.api.brickmmo.com:7777/map/square2/city_id/1";

let currentLocation = null;

// Color mapping for different types
const colorMap = {
"water": "#4da6ff",    // Light Blue
"ground": "#b5651d",   // Brown
"road": "#d3d3d3",     // Light Gray
"track": "#4d4d4d",    // Dark Gray
"building": "#1e3e67"  // Dark Blue
};

// Function to fetch data and create map grid
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

      const grid = document.getElementById("map-grid");

      if (!grid) {
          console.error("Table element not found");
          return;
      }

      // Clear previous content if reloading
      grid.innerHTML = "";

      // Determine grid size dynamically
      let maxX = 0, maxY = 0;
      data.squares.forEach(sq => {
          maxX = Math.max(maxX, parseInt(sq.x));
          maxY = Math.max(maxY, parseInt(sq.y));
      });

      // Create grid rows
      for (let y = 0; y <= maxY; y++) {
          let row = document.createElement("tr");

          for (let x = 0; x <= maxX; x++) {
              let cell = document.createElement("td");
              let square = data.squares.find(sq => parseInt(sq.x) === x && parseInt(sq.y) === y);

              if (square) {
                  let color = "#b5651d"; // Default ground color
                  let entityType = null;
                  let entityData = null;

                  if (square.type === "water") {
                      color = colorMap["water"];
                  } else if (square.type === "ground") {
                      if (square.building_id && square.building_id !== "0" && square.building) {
                          color = colorMap["building"];
                          entityType = "Building";
                          entityData = square.building;
                      } else if (square.road) {
                          color = colorMap["road"];
                          entityType = "Road";
                          entityData = square.road;
                      } else if (square.track) {
                          color = colorMap["track"];
                          entityType = "Track";
                          entityData = square.track;
                      }
                  }

                  // Apply background color
                  cell.style.backgroundColor = color;

                  // Add click event for selecting location
                  cell.addEventListener("click", function () {
                      if (currentLocation) {
                          currentLocation.classList.remove("current-location"); // Remove previous highlight
                      }
                      currentLocation = cell;
                      cell.classList.add("current-location"); // Add highlight

                      if (entityType && entityData) {
                          updateDetailsPanel(entityType, entityData);
                      }
                  });
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
  const detailsImage = document.getElementById("details-image");
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

  if (data.image_url) {
      detailsImage.src = data.image_url;
      detailsImage.style.display = "block";
  } else {
      detailsImage.style.display = "none";
  }
}
