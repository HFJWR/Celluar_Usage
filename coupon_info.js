const width = 125;
const height = 8;
const barColor = "#67CE67";
const backColor = "#48484A";
const total = 5000;
let bgColor = "#FFFFFF"
let fontColor = "#000000"

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
  w.addSpacer(12);
  
  // Title
  let titleTxt = w.addText("Mobile Data Balance");
  titleTxt.textColor = new Color(fontColor);
  titleTxt.font = Font.boldSystemFont(13);
  titleTxt.centerAlignText();
  w.addSpacer(10);
  
  
  // status
  const status = w.addText("status: "+String(couponStatus)+"	");
  status.textColor = new Color(fontColor);
  status.font = Font.systemFont(13);
  status.rightAlignText();
  w.addSpacer(2);
  
  
    // progress bar
  let curr = volume
  if(curr>total){
    curr=total;
  }
  const progressBar = w.addImage(createProgress(total, curr));
  progressBar.imageSize = new Size(width, height);
  progressBar.centerAlignImage();
  w.addSpacer(10);

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


  // Stackを作成
  let stack = w.addStack();
  stack.addSpacer(10);
  stack.bottomAlignContent();
  // 左側のテキスト
  let descriptionTxt = stack.addText(String(volume));
  descriptionTxt.textColor = new Color(fontColor);
  descriptionTxt.font = Font.systemFont(21);
  descriptionTxt.leftAlignText();
  // 右側のテキスト
  let description1 = stack.addText(" / 5.00GB");
  description1.textColor = new Color(fontColor);
  description1.font = Font.systemFont(13);
  description1.rightAlignText();
  
	stack.addSpacer(2);
  w.addSpacer(5);
  
  let description2 = " (Rollovered: "+String(rollover)+") ";
  let descriptionTxt2 = w.addText(description2);
  descriptionTxt2.textColor = new Color(fontColor);
  descriptionTxt2.font = Font.systemFont(12);
  descriptionTxt2.centerAlignText();
  w.addSpacer(8);


 	// updated time
  const format = new DateFormatter();
  format.dateFormat = "HH:mm";
  const time = new Date();
  const lastloaded = w.addText(format.string(time));
  lastloaded.textColor = new Color(fontColor);
  lastloaded.font = Font.systemFont(11);
  lastloaded.centerAlignText();
  // w.addSpacer(10);
  
  
  w.setPadding(0,5,0,0);
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
  w.setPadding(0,5,0,0);
  return w;
}

function createProgress(total, current_val){
	const context = new DrawContext()

	context.size = new Size(width, height)
	context.opaque = false
	context.respectScreenScale = true
	context.setFillColor(new Color(backColor))

	const base = new Path()
	base.addRoundedRect(new Rect(0, 0, width, height), height/2, height)
	context.addPath(base)
	context.fillPath()
	context.setFillColor(new Color(barColor))

	const fill = new Path()
	fill.addRoundedRect(new Rect(0, 0, width * current_val/total, height), height/2, height)
	context.addPath(fill)
	context.fillPath()

	return context.getImage()
}