const total = 10000;
const canvSize = 200;
const canvTextSize = 48;
const canvWidth =8;
const canvRadius = 75;
const canvas = new DrawContext();
canvas.opaque = false;
canvas.size = new Size(canvSize, canvSize);
canvas.respectScreenScale = true;

// Get Coupon Info
const url = "https://api.iijmio.jp/mobile/d/v2/coupon/";
const headers = {
  "X-IIJmio-Developer": "XXX",
  "X-IIJmio-Authorization": "XXX"
};

const req = new Request(url);
req.headers = headers;
// volume information response
const res = await req.loadJSON();
const returnStatus = res.returnCode;
const couponStatus = ((res.couponInfo[0]).hduInfo[0]).couponUse;
log(returnStatus);
log(couponStatus);

// Status Ok or Not
if(res.returnCode=="OK"){
  // coupon sum
  couponInfo = (res.couponInfo[0]).coupon
  var vol = 0;
  var ro = 0;
  for (var i=0; i<couponInfo.length; i++){
    vol+=couponInfo[i].volume;
    ro=couponInfo[0].volume;
  }
  // widget exe
  let widget = createWidget(vol,ro);
  if(config.runsInWidget){
    Script.setWidget(widget);
    Script.complete();
  }else{
    widget.presentSmall();
  }
}else{
  // widget_error exe
  let widget = createWidget_error(returnStatus);
  if(config.runsInWidget){
    Script.setWidget(widget);
    Script.complete();
  }else{
    widget.presentSmall();
  }
}

// widget function
function createWidget(volume, rollover){
  console.log("Volume: "+volume);
  console.log("Rolloverd: "+ rollover);
  
   // nightmode
  const daynight = new Date();
	if(daynight>=0){
    bgColor = "#000000"
	fontColor = "#FFFFFF"
  }

  let w = new ListWidget();
  w.backgroundColor = new Color(bgColor);

  /*
  // Title
  let titleTxt = w.addText("Mobile Data Balance");
  titleTxt.textColor = new Color(fontColor);
  titleTxt.font = Font.boldSystemFont(8);
  titleTxt.centerAlignText();
  */
  w.addSpacer(2);
  // progress bar
  let curr = volume
  if(curr>total){
    curr=total;
  }

  // Data txt
  if(volume>=1000){
      volume=Math.round(volume/10)/100;
      volume = String(volume+"GB")
    }else{
      volume = String(volume+"MB")
    }
    if(rollover>=1000){
      rollover=Math.round(rollover/10)/100;
      rollover = String(rollover+"GB")
    }else{
      rollover = String(rollover+"MB")
    }

  let deg = Math.floor(curr/total*100*3.6);
  let text1 = volume
  let text2 = (" / 5.0GB")

  const fillColor = new Color('#33cc33');
  const strokeColor = new Color('#555555');
  drawArc(deg, fillColor, strokeColor, text1, text2)
  w.addImage(canvas.getImage())
  w.addSpacer(1);


  /*
  // status
  const status = w.addText("status: "+String(couponStatus));
  status.textColor = new Color(fontColor);
  status.font = Font.systemFont(12);
  status.centerAlignText();
  w.addSpacer(1);
  */
  
  let mode = "-"
  
  if(couponStatus==1){
    mode = "mode : ON"
  }else{
    mode = "mode : OFF"
  }

  // updated time
  const format = new DateFormatter();
  format.dateFormat = "HH:mm";
  const time = new Date();
  const lastloaded = w.addText(""+mode+"      \n"+format.string(time)+"      ");
  lastloaded.textColor = new Color(fontColor);
  lastloaded.font = Font.systemFont(12);
  lastloaded.centerAlignText();
  w.addSpacer(5);
  
  w.setPadding(0,8,0,0);
  return w;
}

// error code status
function createWidget_error(returnStatus){
  console.log("Status: "+String(returnStatus));
  let w = new ListWidget();
  w.backgroundColor = new Color("#000000");
  let error_txt = w.addText("returnCode: "+String(returnStatus));
  error_txt.textColor = Color.white();
  error_txt.font = Font.systemFont(10);
  error_txt.leftAlignText();
  w.addSpacer(20);
  const format = new DateFormatter();
  format.dateFormat = "HH:mm";
  const time = new Date();
  const lastloaded = w.addText(format.string(time));
  lastloaded.textColor = Color.white();
  lastloaded.font = Font.systemFont(8);
  lastloaded.centerAlignText();
  w.setPadding(0,8,0,12);
  return w;
}

function sinDeg(deg) {
  return Math.sin((deg * Math.PI) / 180);
}

function cosDeg(deg) {
  return Math.cos((deg * Math.PI) / 180);
}

function drawArc(deg, fillColor, strokeColor, text1, text2) {
    let txtColor = new Color('#ffffff');
    
    // 中心点をキャンバスの中心に設定
    let ctr = new Point((canvSize / 2)+16, canvSize / 2);
    
    // 円の描画範囲の計算 (中心から半径に基づく)
    let bgx = ctr.x - canvRadius;
    let bgy = ctr.y - canvRadius;
    let bgd = 2 * canvRadius; // 直径（半径の2倍）
    let bgr = new Rect(bgx, bgy, bgd, bgd); // 円を描画する矩形範囲
    
    // 円弧の描画
    canvas.setFillColor(fillColor);
    canvas.setStrokeColor(strokeColor);
    canvas.setLineWidth(canvWidth);
    canvas.strokeEllipse(bgr);
  
    // 円弧部分の描画
    for (let t = 0; t < deg; t++) {
      let rect_x = ctr.x + canvRadius * sinDeg(t) - canvWidth / 2;
      let rect_y = ctr.y - canvRadius * cosDeg(t) - canvWidth / 2;
      let rect_r = new Rect(rect_x, rect_y, canvWidth, canvWidth);
      canvas.fillEllipse(rect_r);
    }
  
    // フォントサイズの調整
    const largeFontSize = 28; // メインテキスト用（大きいフォント）
    const smallFontSize = 18; // サブテキスト用（小さいフォント）
  
    // テキストの描画
    const canvText1Rect = new Rect(
      0,
      (canvSize / 2) - 25, // 上側に表示 (大きなテキストの位置)
      canvSize+28,
      canvTextSize
    );
    const canvText2Rect = new Rect(
      0,
      (canvSize / 2) + 15, // 下側に表示 (小さなテキストの位置)
      canvSize+32,
      canvTextSize
    );
  
    // メインテキストに大きな通常フォントを適用
    canvas.setFont(Font.systemFont(largeFontSize)); // 通常の大きなフォント
    canvas.setTextAlignedCenter();
    canvas.setTextColor(txtColor);
    canvas.drawTextInRect(text1, canvText1Rect);
  
    // サブテキストに小さな通常フォントを適用
    canvas.setFont(Font.systemFont(smallFontSize)); // 通常の小さなフォント
    canvas.drawTextInRect(text2, canvText2Rect);
  }
  