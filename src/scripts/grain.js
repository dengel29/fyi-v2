class Grain {
  // TO DO: make a Grain a full class object composed of the falling logic and coloring
  constructor(pixelStart, x, y, width) {
    this.pixelStart = pixelStart;
    this.x = x;
    this.y = y;
    this.nextPixel = pixelStart + width * 4
    this.color = [31, 86, 122];
    this.atRest = false;
  }

  /**
   * 
   * @param {Number} x the x position of the mouse when pressed
   * @param {Number} y the y position of the mouse when pressed, also the *row*
   * @param {Number} width the width of the canvas
   * @param {Number} pixelDensity the density of the pixel canvas
   * @returns {Number} the number position of the first digit in the pixels 4 digit sequence
   */
  static getOffset(x, y, width, pixelDensity) {
    return (y * width + x) * pixelDensity * 4;
  }

  /**
   * 
   * @param {Number} width the width of the pixel canvas
   * @returns {Number} the number position of the first digit in the pixels 4 digit sequence of the pixel below this current pixel
   */
  getNextPixelBelow(width) {
    // this.pixelBelow = this.pixelStart + width * 4
    return this.nextPixel + width * 4
  }

  nextRow() {
    return this.y + 1
  }

  // emptyPixel() {
  //   // empties current pixel
  //   p.pixels[this.pixelStart] = 100;
  //   p.pixels[this.pixelStart + 1] = 100;
  //   p.pixels[this.pixelStart + 2] = 100;
  // }

  // controlColor(r) {
  //   this.color = [r, r, r]
  //   p.pixels[this.pixelStart] = r - 30;
  //   p.pixels[this.pixelStart + 1] = r - 25;
  //   p.pixels[this.pixelStart + 2] = r - 100;
  // }

  colorPixel() {
    // p.pixels[this.pixelStart] = this.color[0];
    // p.pixels[this.pixelStart + 1] = this.color[1];
    // p.pixels[this.pixelStart + 2] = this.color[2];
    // pixels[this.pixelStart + 3] = this.color[3];
  }

  colorNextPixel() {
    // empties current pixel
    // p.pixels[this.nextPixel] = this.color[0];
    // p.pixels[this.nextPixel + 1] = this.color[1];
    // p.pixels[this.nextPixel + 2] = this.color[2];
  }

  randomColor() {
    p.pixels[this.nextPixel] = random(255);
    p.pixels[this.nextPixel + 1] = random(255);
    p.pixels[this.nextPixel + 2] = random(255);
  }

  update() {
    pixels[this.pixelStart] = 100
    if (this.atRest) {
      return
    }
    // updatePixels();
    // occupies next pixel
    this.emptyPixel()
    this.colorNextPixel()
    this.y = this.nextRow()
    this.pixelStart = this.nextPixel
    this.nextPixel = this.getNextPixelBelow(width)
    return this
  }
}

