let menu = new Alert();
menu.title = "Coupon ON/OFF";
menu.message = "Select menu";

menu.addAction("On");
menu.addAction("Off");
menu.addAction("Cancel"); // キャンセルボタンを追加

let requestData;
let status;

let selectedIndex = await menu.present();

if (selectedIndex === 0) {
  console.log("on状態");
  status = "Coupon On";
  requestData = {
    couponInfo: [
      {
        hduInfo: [
          {
            hduServiceCode: 'XXX',
            couponUse: true
          }
        ]
      }
    ]
  };
} else if (selectedIndex === 1) {
  console.log("off状態");
  status = "Coupon Off";
  requestData = {
    couponInfo: [
      {
        hduInfo: [
          {
            hduServiceCode: 'XXX',
            couponUse: false
          }
        ]
      }
    ]
  };
} else if (selectedIndex === 2) {
  // キャンセルが選択された場合
  console.log("キャンセル");
  return; // プログラムを終了
}

const apiUrl = 'https://api.iijmio.jp/mobile/d/v2/coupon/';

const headers = {
  'X-IIJmio-Developer': 'XXX',
  'X-IIJmio-Authorization': 'XXX',
  'Content-Type': 'application/json'
};

const req = new Request(apiUrl);
req.method = 'PUT';
req.headers = headers;
req.body = JSON.stringify(requestData);

const res = await req.loadJSON();
const returnStatus = res.returnCode;

console.log(returnStatus);

let alert = new Alert();
alert.title = status;
alert.message = "status: " + String(returnStatus);
alert.addAction("close");
alert.present();
