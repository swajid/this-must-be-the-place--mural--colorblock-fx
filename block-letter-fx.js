(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.blockLetterFX = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  var DEFAULT_OPTS = {
    faceColor: '#f0f0f0',
    midColor:  '#cc2200',
    deepColor: '#111111',
    depthPct:  0.09,
    spacing:   2,
    padding:   28,
  };

  function draw(canvas, text, opts) {
    opts = Object.assign({}, DEFAULT_OPTS, opts || {});
    text = (text || '').trim() || 'BLOCK LETTER FX';

    var ctx = canvas.getContext('2d');
    var DPR = window.devicePixelRatio || 1;
    var LETTER_SPACING = opts.spacing;
    var maxW = canvas.parentElement
      ? canvas.parentElement.clientWidth - opts.padding * 2
      : 600;

    var fontSize = Math.round(maxW * 0.11);
    ctx.font = 'normal ' + fontSize + 'px "Bebas Neue", Impact, sans-serif';
    var textW = ctx.measureText(text).width + LETTER_SPACING * text.length;
    while (textW > maxW && fontSize > 8) {
      fontSize--;
      ctx.font = 'normal ' + fontSize + 'px "Bebas Neue", Impact, sans-serif';
      textW = ctx.measureText(text).width + LETTER_SPACING * text.length;
    }

    var depth    = Math.round(fontSize * opts.depthPct);
    var padY     = Math.round(fontSize * 0.2);
    var cssW     = textW + opts.padding * 2;
    var cssH     = fontSize + padY * 2 + depth;

    canvas.width  = Math.round(cssW * DPR);
    canvas.height = Math.round(cssH * DPR);
    canvas.style.width  = cssW + 'px';
    canvas.style.height = cssH + 'px';

    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.font          = 'normal ' + fontSize + 'px "Bebas Neue", Impact, sans-serif';
    ctx.textBaseline  = 'top';
    ctx.letterSpacing = LETTER_SPACING + 'px';

    var x = opts.padding;
    var y = padY;

    for (var i = depth; i >= 1; i--) {
      ctx.fillStyle = opts.deepColor;
      ctx.fillText(text, x + i, y + i);
    }
    for (var i = Math.round(depth * 0.55); i >= 1; i--) {
      ctx.fillStyle = opts.midColor;
      ctx.fillText(text, x + i, y + i);
    }
    ctx.fillStyle = opts.faceColor;
    ctx.fillText(text, x, y);
  }

  function blockLetterFX(canvas, text, opts) {
    function render() { draw(canvas, text, opts); }
    if (document.fonts && document.fonts.load) {
      document.fonts.load('1em "Bebas Neue"').then(render);
    } else {
      setTimeout(render, 400);
    }
    window.addEventListener('resize', render);
    return { redraw: render };
  }

  return blockLetterFX;
});
