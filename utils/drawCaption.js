const textHeight = 64;

export function drawCaption(ctx, text){
  ctx.font = textHeight + "px sans-serif";

  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  if(text.length > 30){ // multine
    let wbr = text.indexOf(" ", 12);
    let line1 = text.substr(0, wbr);
    let line2 = text.substr(wbr+1);

    let wbr2 = line2.indexOf(" ", 12);
    let line3 = line2.substr(wbr2);
    line2 = line2.substr(0, wbr2);

    draw(ctx, line1, w/2, h/2-2*textHeight/1.3)
    draw(ctx, line2, w/2, h/2)
    draw(ctx, line3, w/2, h/2+2*textHeight/1.3)
  }
  else if(text.length > 18){ // multine
    let wbr = text.indexOf(" ", 12);
    let line1 = text.substr(0, wbr);
    let line2 = text.substr(wbr+1);
    draw(ctx, line1, w/2, h/2-textHeight/1.3)
    draw(ctx, line2, w/2, h/2+textHeight/1.3)
  } else {
    draw(ctx, text, w/2, h/2)
  }
}

function draw(ctx, text, x, y){
  let textWidth = ctx.measureText(text).width;
  x = x - textWidth/2;
  y = y - textHeight/2;
  const pY = 16;
  const pX = 20;

  ctx.fillStyle = "#000";
  ctx.fillRect(x - pX, y - pY, textWidth + pX*2, textHeight + pY*2)

  ctx.fillStyle = "#fff";
  ctx.fillText(text, x, y + textHeight / 1.3);
}