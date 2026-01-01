const GRAPHICS_LAYER = Object.freeze({
  TOP_UI: 0,
  UI: 1,
  FOREGROUND: 2,
  MIDGROUND: 3,
  BACKGROUND: 4
});
const ATTEMPT = Object.freeze({
  SUCCESS: true,
  FAIL: false
});

class GRAPHICS {
  constructor(canvas, pixelPerfect) {
    this.canvas = canvas; 
    this.ctx = canvas.getContext("2d");
    if (pixelPerfect) {
      this.ctx.imageSmoothingEnabled = false; 
    }
  }
  sanityCheck() {
    if (!(this.canvas)) { console.error("No canvas present for drawing!"); return ATTEMPT.FAIL; }
    if (!(this.ctx)) { console.error("No context present for drawing!"); return ATTEMPT.FAIL; }
    return ATTEMPT.SUCCESS;
  }
  clearDisplay() {
    if (this.sanityCheck()) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return ATTEMPT.SUCCESS;
    } else { return ATTEMPT.FAIL; }
  }
  drawPixel(x, y, col) {
    if (this.sanityCheck()) {
      this.ctx.fillStyle = col;
      this.ctx.fillRect(x, y, 1, 1);
      return ATTEMPT.SUCCESS;
    } else { return ATTEMPT.FAIL; }
  }
  getGradientColor(rgb1, rgb2, lerpF) {
    const r = ((rgb2.r - rgb1.r) * lerpF) + rgb1.r;
    const g = ((rgb2.g - rgb1.g) * lerpF) + rgb1.g;
    const b = ((rgb2.b - rgb1.b) * lerpF) + rgb1.b;
    return this.rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  }
  drawGradient(x, y, w, h, col1, col2, usingHeight) {
    if (this.sanityCheck()) {
      let result = true;
      const a = usingHeight ? h : w;
      const newWH = {};
      newWH[0] = usingHeight ? w : 1;
      newWH[1] = usingHeight ? 1 : h;
      const rgb1 = this.hexToRgb(col1);
      const rgb2 = this.hexToRgb(col2);
      for (let i = 0; i < a - 1; i++) {
        const lerp = i / a;
        const col = this.getGradientColor(rgb1, rgb2, lerp);
        const nextX = usingHeight ? x : x + i;
        const nextY = usingHeight ? y + i : y;
        result = this.drawRect(nextX, nextY, newWH[0], newWH[1], col) ? result : false;
      }
      if (result) { return ATTEMPT.SUCCESS; } else { return ATTEMPT.FAIL; }
     } else { return ATTEMPT.FAIL; }
  }
  drawRect(x, y, w, h, col) {
    if (this.sanityCheck()) {
      if (Array.isArray(col)) {
        return this.drawGradient(x, y, w, h, col[0], col[1], col[2]);
      }
      this.ctx.fillStyle = col;
      this.ctx.fillRect(x, y, w, h);
      return ATTEMPT.SUCCESS;
    } else { return ATTEMPT.FAIL; }
  }
  drawLine(x1, y1, x2, y2, w, col) {
    if (this.sanityCheck()) {
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.lineWidth = w.toString();
      this.ctx.strokeStyle = col;
      this.ctx.stroke();
      return ATTEMPT.SUCCESS;
    } else { return ATTEMPT.FAIL; }
  }
  drawOutline(x, y, w, h, s, col) {
    if (this.sanityCheck()) {
      this.ctx.strokeStyle = col;
      this.ctx.lineWidth = s;
      this.ctx.beginPath();
      this.ctx.rect(x, y, w, h);
      this.ctx.stroke();
      return ATTEMPT.SUCCESS;
    } else { return ATTEMPT.FAIL; }
  }
  drawTexture(x, y, w, h, img) {
    if (this.sanityCheck()) {
      this.ctx.drawImage(img, x, y, w, h); 
      return ATTEMPT.SUCCESS;
    } else { return ATTEMPT.FAIL; }
  }
  drawText(x, y, text, font, color) {
    if (this.sanityCheck()) {
      this.ctx.font = font;
      this.ctx.fillStyle = color;
      this.ctx.fillText(text, x, y);
      return ATTEMPT.SUCCESS;
    } else { return ATTEMPT.FAIL; }
  }
  drawTextOutline(x, y, w, text, font, color) {
     if (this.sanityCheck()) {
      this.ctx.font = font;
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = w;
      this.ctx.strokeText(text, x, y);
      return ATTEMPT.SUCCESS;
    } else { return ATTEMPT.FAIL; }
  }
  createTexture(path) {
    const img = new Image();
    img.src = path;
    return img;
  }
  createGradient(hex1, hex2, heightWise) {
    const col1 = hexToRgb(hex1);
    const col2 = hextToRgb(hex2);
    return [col1, col2, heightWise];
  }
  hexToRgb(hex) {
    var result = /^#?([a-fd]{2})([a-fd]{2})([a-fd]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  rgbToHex(r, g, b) {
    function convertHex(c) {
      // Convert from number to hexadecimal string
      const hex = c.toString(16); 
      // Add 0 to beginning if hex is too short (e.g. A -> 0A)
      return hex.length === 1 ? "0" + hex : hex;
    }
    return "#" + convertHex(r) + convertHex(g) + convertHex(b);
  }
}