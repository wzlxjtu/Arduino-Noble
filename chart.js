var BleUart = require('./ble-uart');
var noble = require('noble');
var bleSerial = new BleUart('nordic');
var splitData; //array
var dataBuf = "";
// time, left top, right top, left middle, right middle, bottom
var T, LT, RT, LM, RM, B;
var fs = require('fs');
var writeStream = fs.createWriteStream("C:/pMouse/Data/data.csv");

/********************************************************************************************************/
/*Start of Bluetooth functions*/
bleSerial.on('data', function(data){
	dataBuf += String(data);
	// if (dataBuf.length < 20) {
		// dataBuf += String(data);
	console.log(String(data));
	console.log(String(dataBuf));
	// }
	//console.log(String(data));
	// if (true) {
		
	  // splitData = dataBuf.split(',');

	  // if (splitData[0] != "" && splitData[0] != "\n") {
		  // T=splitData[0];
		  // }

	  // if (splitData[1] != "" && splitData[1] != "\n") {
		  // LT=splitData[1];
		  // }

	  // if (splitData[2] != "" && splitData[2] != "\n") {
		  // RT=splitData[2];
		  // }

	  // if (splitData[3] != "" && splitData[3] != "\n") {
		  // LM=splitData[3];
		  // }

	  // if (splitData[4] != "" && splitData[4] != "\n") {
		  // RM=splitData[4];
		  // }

	  // if (splitData[5] != "" && splitData[5] != "\n") {
		  // B=splitData[5];
		  // }
		
	// // console.log('T:'+T,' LT:'+LT,' RT:'+RT,' LM:'+LM,' RM:'+RM,' B:'+ B+'\n');
		// //console.log(dataBuf);
		// dataBuf = "";
		// update();
	  // // console.log(String(data));
	// //console.log(splitData);
	// }
	while (bufHasTwoPeriods()) {
	// while (dataBuf has more than one period)
		//console.log("buf:");
		//console.log(dataBuf);
		getOnePacket();
	}
		
	// if (dataBuf.length > 20) {
		// console.log("loss:");
		// 
		// dataBuf = "";
	// }
		
});
// return true if dataBuf contains at least two periods
function bufHasTwoPeriods() {
	if (dataBuf.length < 13) return false;
	var count = 0;
	for (i = 0; i < dataBuf.length; i++) {
		if (dataBuf.charAt(i) == '.') {
			count++;
			if (count == 2)
				return true;
		}
	}
	return false;
}
// extract one concrete bluetooth packet from the bluetooth buffer
// Assume dataBuf contains more than one "."
function getOnePacket() {
	var start = dataBuf.indexOf(".");
	var length = 1;
	while (dataBuf.charAt(start+length) != '.') length++;
	var onePacket = dataBuf.substr(start,length);
	dataBuf = dataBuf.substring(start+length);
	var splitData = onePacket.split(',');
	T = splitData[1] + '0';
	LT = splitData[2];
	RT = splitData[3];
	LM = splitData[4];
	RM = splitData[5];
	B = splitData[6];
	console.log('T:'+T,' LT:'+LT,' RT:'+RT,' LM:'+LM,' RM:'+RM,' B:'+ B+'\n');
	update();
}
// this function gets called when the program
// establishes a connection with the remote BLE radio:
bleSerial.on('connected', function(data){
  console.log("connected");
});

// thus function gets called if the radio successfully starts scanning:
bleSerial.on('scanning', function(status){
  console.log("radio status: " + status);
});

/********************************************************************************************************/
/*Start of Graphing functions*/
var sensora = new TimeSeries();
var seriesb =  new TimeSeries();
var seriesc =  new TimeSeries();
var seriesd =  new TimeSeries();
var seriese =  new TimeSeries();
var seriesf =  new TimeSeries();

function createTimeline() {
    var chartT = new SmoothieChart({minValue:0, maxValue:100});
    var chartLT = new SmoothieChart({minValue:0, maxValue:100});
    var chartRT = new SmoothieChart({minValue:0, maxValue:100});
    var chartLM = new SmoothieChart({minValue:0, maxValue:100});
    var chartRM = new SmoothieChart({minValue:0, maxValue:100});
    var chartB = new SmoothieChart({minValue:0, maxValue:100});
	
    chartT.addTimeSeries(sensora, { strokeStyle: 'rgb(0, 255, 0)',  lineWidth: 2 });
    chartT.streamTo(document.getElementById("chartT"), 500);
    chartLT.addTimeSeries(seriesb, { strokeStyle: 'rgb(255, 0, 0)',  lineWidth: 2 });
    chartLT.streamTo(document.getElementById("chartLT"), 500);
    chartRT.addTimeSeries(seriesc, { strokeStyle: 'rgb(0, 0, 255)',  lineWidth: 2 });
    chartRT.streamTo(document.getElementById("chartRT"), 500);
    chartLM.addTimeSeries(seriesd, { strokeStyle: 'rgb(0, 255, 255)',  lineWidth: 2 });
    chartLM.streamTo(document.getElementById("chartLM"), 500);
    chartRM.addTimeSeries(seriese, { strokeStyle: 'rgb(255, 0, 255)',  lineWidth: 2 });
    chartRM.streamTo(document.getElementById("chartRM"), 500);
    chartB.addTimeSeries(seriesf, { strokeStyle: 'rgb(255, 255, 0)',  lineWidth: 2 });
    chartB.streamTo(document.getElementById("chartB"), 500);
}

writeStream.write("Time1,Time2,Left_Click,Right_Click,Left_Side,Right_Side,Back\n");
function update() {
    // fs.appendFile('data.txt', [date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(),' LC:'+LC,' RC:'+RC,' LS:'+LS,' RS:'+RS,' LB:'+LB,' RB:'+ RB+'\n'], function (err) {
        // if (err) throw err;
    // });
	var date = new Date();
    sensora.append(date.getTime(),T);
    seriesb.append(date.getTime(),LT);
    seriesc.append(date.getTime(),RT);
    seriesd.append(date.getTime(),LM);
    seriese.append(date.getTime(),RM);
    seriesf.append(date.getTime(),B);
	writeStream.write(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+","+T+","+LT+","+RT+","+LM+","+RM+","+B+'\n');
}
