/*
 * SplitMultiLine for Photoshop
 * 2012.10.04 hisato
 */

#target photoshop

var userUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;

var BR = String.fromCharCode(13);

function SplitMultiLine() {
}

SplitMultiLine.prototype.execute = function() {

	var docRef = app.activeDocument;
	var targetLayer = docRef.activeLayer;

	if (targetLayer.kind != LayerKind.TEXT) {
		return this.__exit("テキストレイヤーを選択して下さい");
	}

	var elems = targetLayer.textItem.contents.split(BR);

	if (elems.length <= 1) {
		return this.__exit("複数行のテキストレイヤーを選択してください");
	}

	var winObj = new Window("dialog", "SplitMultiLine", [ 0, 0, 400, 150 ]);
	winObj.lPnl = winObj.add("panel",[ 20, 20, 380, 80 ],"行間を開ける場合は行送りを設定してください");
	winObj.lPnl.add("statictext", [ 30, 20, 30 + 30, 20 + 20 ], "行送り");
	winObj.lPnl.add("statictext", [ 120, 20, 120 + 30, 20 + 20 ], "px");
	winObj.lPnl.lineSpace = winObj.lPnl.add("edittext", [ 70, 20, 70 + 40, 20 + 20 ], "");
	winObj.btnOk = winObj.add("button", [ 110, 100, 110 + 80, 130 ], "OK", {
		name : "ok"
	});
	winObj.btnNo = winObj.add("button", [ 210, 100, 210 + 80, 130 ], "キャンセル", {
		name : "cancel"
	});
	winObj.center();

	if (winObj.show() == 2) {
		return this.__exit();
	}
	var lineSpace = parseInt(winObj.lPnl.lineSpace.text) < 1000 ? parseInt(winObj.lPnl.lineSpace.text) : 0;


	for ( var i = 0; i < elems.length; i++) {
		if (elems[i] == "") {
			continue;
		}
		var newObj = targetLayer.duplicate();
		newObj.name = '';
		newObj.textItem.contents = elems[i];
		if (lineSpace) {
			newObj.translate(null, lineSpace * i);
		}
	}
	this.__destructor();
};

SplitMultiLine.prototype.__destructor = function() {
	preferences.rulerUnits = userUnit;
};

SplitMultiLine.prototype.__exit = function(msg) {
	if (msg) {
		alert(msg);
	}
	this.__destructor();
};

var oSplitMultiLine = new SplitMultiLine;
oSplitMultiLine.execute();
delete o_splitMultiLine;

