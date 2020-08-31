let sketch = function (p) {
  let grains = [];
  p.setup = function () {
    CANVAS = p.createCanvas(320, 100);
    HEIGHT = CANVAS.height;
    WIDTH = CANVAS.width;
    p.pixelDensity(1);
    CANVAS.background(100);
    p.frameRate(30);
  }


  p.draw = function () {
    dropSand();
    if (grains.length > 0) {
      grains.forEach((grain, i) => {
        let pixelBelow = grain[1]
        let pixelBelowAndLeft = pixelBelow - 4
        let pixelBelowAndRight = pixelBelow + 4
        let x = grain[2]
        let y = grain[3]
        let d = grain[4]
        let off = grain[0]
        if (y == HEIGHT - 1) {
          return
        }
        // keeps pixel where it is if all three pixels below are occuppied
        if ((p.pixels[pixelBelow + 1] == 255) && (p.pixels[pixelBelowAndLeft + 1] == 255) && (p.pixels[pixelBelowAndRight + 1] == 255)) {
          return
        }
        // moves pixel down if space below is empty
        if (shouldPixelMove(pixelBelow)) {
          grains[i] = movePixelDown(off, pixelBelow, x, y, d)

        } else if (shouldPixelMove(pixelBelowAndLeft)) {
          grains[i] = movePixelDown(off, pixelBelowAndLeft, x, y, d)
        } else if (!shouldPixelMove(pixelBelowAndLeft)) {
          grains[i] = movePixelDown(off, pixelBelowAndRight, x, y, d)
        } else {
          grains.splice(i, 1)
        }
      })
    }
    p.updatePixels();
  }

  /**
   * 
   * @param {Event} e the mouse press event
   */
  // p.mouseDragged = function (e) {

  //   p.loadPixels();
  //   let x = e.x
  //   let y = e.y;
  //   let d = p.pixelDensity();
  //   let off = (y * WIDTH + x) * d * 4;
  //   placePixel(off);


  //   let pixelBelow = off + WIDTH * 4
  //   grains.push([off, pixelBelow, x, y, d])
  // }

  function dropSand() {
    p.loadPixels();
    let d = p.pixelDensity();
    let offset = [4, 3, 2, 5]
    offset = offset[Math.floor(Math.random() * offset.length)]
    let off = Grain.getOffset(width / 2, 0, width, d)
    off += offset
    let grain = new Grain(off, width / 2, 0, width)
    grain.colorPixel()
    grains.push(grain)
    updatePixels()
  }

  /**
   * 
   * @param {Number} off the beginning of the 4 digit pixel RGBA value
   */
  placePixel = function (off) {
    // loadPixels();
    // turn from background Grey to Green
    p.pixels[off + 1] = 255;
    p.updatePixels();
  }

  /**
   * 
   * @param {Number} pixel the position of the pixel below the current pixel
   * @returns {Boolean} whether or not the pixel can move to the space below
   */

  shouldPixelMove = function (pixel) {
    // if this is true, the pixel below is empty
    // loadPixels()
    return p.pixels[pixel + 1] == 100
  }

  /**
   * 
   * @param {Number} currentPixel the beginning of the 4 digit pixel RGBA value
   * @param {Number} nextPixel the beginning of the 4 digit pixel RGBA value below the off 
   * @param {Number} y the row of the next row below
   * @param {Number} d the pixel density
   */

  movePixelDown = function (currentPixel, nextPixel, x, y, d) {
    // empties current pixel
    p.pixels[currentPixel + 1] = 100
    // updatePixels();
    // occupies next pixel
    p.pixels[nextPixel + 1] = 255

    // get x, y, d of nextPixel and run it through equation again starting from shouldPixelMove
    let nextRow = y + 1
    let nextNextPixel = nextPixel + WIDTH * 4
    // console.log(nextPixelBelow)
    return [nextPixel, nextNextPixel, x, nextRow, d]
  }
}

new p5(sketch, 'sketch-container')