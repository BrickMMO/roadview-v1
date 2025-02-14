export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.ground = this.#image("ground.png");
    this.water = this.#image("water.png");
    this.road = this.#image("road.jpeg");
    this.track = this.#image("track.jpeg");
    this.building = this.#image("building.png");
  }

  #image(fileName) {
    const img = new Image();
    img.src = `images/${fileName}`;
    return img;
  }

  //0 - ground
  //1 - road
  //2 - track
  //3 - building
  //4 - water
  map = [
    [0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1],
    [0, 0, 0, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1],
    [0, 0, 0, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1],
    [0, 0, 0, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1],
    [0, 0, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1],
    [0, 0, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1],
    [0, 0, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1],
    [0, 0, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 1, 0, 2, 0, 0, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 0, 0, 1, 1],
    [1, 1, 0, 2, 0, 0, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 2, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 2, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 2, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 0, 2, 1, 1],
    [1, 1, 0, 0, 0, 3, 3, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 0, 2, 1, 1],
    [1, 1, 0, 0, 0, 3, 3, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 0, 2, 1, 1],
    [1, 1, 0, 0, 0, 3, 3, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 0, 2, 1, 1],
    [1, 1, 0, 0, 0, 3, 3, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 3, 3, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 2, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  ];

  draw(canvas, ctx) {
    this.#setCanvasSize(canvas);
    this.#clearCanvas(canvas, ctx);
    this.#drawMap(ctx);
  }
 
  #drawMap(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        let image = null;
        switch (tile) {
          case 1:
            image = this.road;
            break;
          case 0:
            image = this.ground;
            break;
          case 2:
            image = this.track;
            break;
          case 3:
            image = this.building;
            break;
          case 4:
            image = this.water;
            break;
        }

        if (image != null)
          ctx.drawImage(
            image,
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            this.tileSize
          );
      }
    }
  }

  #clearCanvas(canvas, ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  #setCanvasSize(canvas) {
    canvas.height = this.map.length * this.tileSize;
    canvas.width = this.map[0].length * this.tileSize;
  }
}
