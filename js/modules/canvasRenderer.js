// canvasRenderer.js - Canvas core graphics, asset management, and animation engine

export class CanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    this.newLogoImg = new Image();
    this.newLogoImg.crossOrigin = 'anonymous';
    this.newLogoImg.src = 'https://raw.githubusercontent.com/AhmedSharyph/whd-2026/main/new_logo.png';

    this.mascotTrImg = new Image();
    this.mascotTrImg.crossOrigin = 'anonymous';
    this.mascotTrImg.src = 'https://raw.githubusercontent.com/AhmedSharyph/whd-2026/main/mascot_tr.png';

    this.curve = {
      P0: { x: 0, y: 620 },
      P1: { x: 360, y: 380 },
      P2: { x: 720, y: 260 },
      P3: { x: 1080, y: 400 }
    };
  }

  bezierPoint(t) {
    const mt = 1 - t;
    const { P0, P1, P2, P3 } = this.curve;
    return {
      x: mt*mt*mt*P0.x + 3*mt*mt*t*P1.x + 3*mt*t*t*P2.x + t*t*t*P3.x,
      y: mt*mt*mt*P0.y + 3*mt*mt*t*P1.y + 3*mt*t*t*P2.y + t*t*t*P3.y
    };
  }

  bezierTangentAngle(t) {
    const mt = 1 - t;
    const { P0, P1, P2, P3 } = this.curve;
    const dx = 3*mt*mt*(P1.x-P0.x) + 6*mt*t*(P2.x-P1.x) + 3*t*t*(P3.x-P2.x);
    const dy = 3*mt*mt*(P1.y-P0.y) + 6*mt*t*(P2.y-P1.y) + 3*t*t*(P3.y-P2.y);
    return Math.atan2(dy, dx);
  }

  findTAtDistance(centerT, distancePx) {
    const centerPt = this.bezierPoint(centerT);
    const forward = distancePx >= 0;
    const absDist = Math.abs(distancePx);
    const step = 0.002;
    let t = centerT;
    let accumulated = 0;
    let prevPt = centerPt;

    for (let i = 0; i < 600; i++) {
      t += forward ? step : -step;
      if (t < 0.001 || t > 0.999) break;
      const pt = this.bezierPoint(t);
      accumulated += Math.hypot(pt.x - prevPt.x, pt.y - prevPt.y);
      prevPt = pt;
      if (accumulated >= absDist) break;
    }
    return Math.max(0.01, Math.min(0.99, t));
  }

  drawBackground(w, h) {
    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0.00, '#8a0018');
    bgGrad.addColorStop(0.35, '#d90429');
    bgGrad.addColorStop(1.00, '#6e0014');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, w, h);
  }

  draw(state) {
    const { w, h } = { w: this.canvas.width, h: this.canvas.height };
    const { userImage, userVideo, photoScale, photoOffsetX, photoOffsetY, sloganText, userName } = state;

    this.ctx.clearRect(0, 0, w, h);
    this.drawBackground(w, h);

    // Clip & Draw Media
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.curve.P0.x, this.curve.P0.y);
    this.ctx.bezierCurveTo(this.curve.P1.x, this.curve.P1.y, this.curve.P2.x, this.curve.P2.y, this.curve.P3.x, this.curve.P3.y);
    this.ctx.lineTo(this.curve.P3.x, h - 140);
    this.ctx.lineTo(this.curve.P0.x, h - 140);
    this.ctx.closePath();
    this.ctx.clip();

    if (userVideo && userVideo.readyState >= 2) {
      this.ctx.drawImage(userVideo, 0, 0, w, h);
    } else if (userImage) {
      const iw = userImage.naturalWidth || userImage.width;
      const ih = userImage.naturalHeight || userImage.height;
      const sourceAspect = iw / ih;
      let drawWidth = w, drawHeight = h;
      if (sourceAspect > (w / h)) { drawWidth = h * sourceAspect; } else { drawHeight = w / sourceAspect; }
      drawWidth *= photoScale;
      drawHeight *= photoScale;
      const x = (w / 2) - (drawWidth / 2) + photoOffsetX;
      const y = (h / 2) - (drawHeight / 2) + photoOffsetY;
      this.ctx.drawImage(userImage, x, y, drawWidth, drawHeight);
    } else {
      this.ctx.fillStyle = '#f5f5f7';
      this.ctx.fillRect(0, 0, w, h);
      this.ctx.fillStyle = '#d90429';
      this.ctx.font = 'bold 40px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Add your media below', w / 2, h / 2);
    }
    this.ctx.restore();

    // Slogan & Branding Text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '900 46px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(sloganText, 50, 200, 540);

    // Mascot
    if (this.mascotTrImg.complete && this.mascotTrImg.naturalHeight !== 0) {
      const targetHeight = 170;
      const aspect = this.mascotTrImg.width / this.mascotTrImg.height;
      this.ctx.drawImage(this.mascotTrImg, w - (targetHeight * aspect) - 25, h - targetHeight - 15, targetHeight * aspect, targetHeight);
    }

    // User Name
    if (userName) {
      this.ctx.fillStyle = '#fff0f3';
      this.ctx.font = '900 30px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(userName.toUpperCase(), w / 2, 1380);
    }
  }
}
