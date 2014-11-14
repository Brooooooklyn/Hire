// JavaScript Document
self.importScripts('Yan.js', 'lyn.dc.js', 'Yan.Lib.js', 'json2.js');

/**
	本版本采用逐像素求值的方法计算函数值。
	传递进来的参数为
	{
		name	: 图层名字
		id		: 图层id
		startPX : 分片起始点在画布上的X坐标
		endPX	: 分片结束点在画布上的X坐标
		pXIncr	: 像素值增加单位
		xIncr	: 每增长 1 * pXIncr 像素，坐标轴值增加的数字。
		minY	: y轴最小值
		maxY	: y轴最大值
		expr	: 表达式对象，用于通过x求得y,
		origin	: 中心点
		}
	其中xIncr的计算方法为
	xIncr = currentNumIncr / ((currentGridWidth + lineWidth) * interval) 	

	回传点集时，最好使用Float32Array以及Transferable objects技术(chrome only？？)
 */

var paramData;

onmessage = function (oEvent) {
	paramData = JSON.parse(oEvent.data);
	var func = paramData.func;	// 获取表达式列表
	var origin = paramData.origin;
	var data = {}
	data['param'] = paramData;
	data['result'] = {};
	for (j in func) {
		var visible = func[j].visible;
		var expr = func[j].expr;
		if(!visible || !expr){
			continue;
		}
		//console.log(expr);
		var layerName = 'FN_LAYOUT_' + j;
		var i = 0;
		var begin = paramData.startPX;	// 起始坐标
		var result = new Float32Array((paramData.endPX - paramData.startPX + 1) * 2);

		for( ; begin < paramData.endPX; begin += paramData.pXIncr){
			result[i++] = begin;
			var l = begin - origin.cxl; // 获取当前点距离原点的像素值
			var x = l * paramData.xIncr; // 通过像素值计算坐标值
			Lyn.math.X = x; // 做弧度和角度的变换
			eval(expr);
			var s = -(Lyn.math.Y / paramData.xIncr);
			result[i++] = s + origin.cyt;
			//console.log(begin, l, x, Lyn.math.X, Lyn.math.Y, s);
		}

		data['result'][j] = {'points' : result, 'length' : i, 'name' : layerName, 'id' : j, 'lineColor' : func[j].color}
	}

	postMessage(data);
};