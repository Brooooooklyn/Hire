// JavaScript Document

if (!importScripts) {
	var importScripts = (function (globalEval) {
		var xhr = new XMLHttpRequest;
		return function importScripts () {
			var args = Array.prototype.slice.call(arguments)
				,len = args.length
				,i = 0
				,meta
				,data
				,content
			;
			
			for (; i < len; i++) {
				if (args[i].substr(0, 5).toLowerCase() === "data:") {
					data = args[i];
					content = data.indexOf(",");
					meta = data.substr(5, content).toLowerCase();
					data = decodeURIComponent(data.substr(content + 1));
					
					if (/;\s*base64\s*[;,]/.test(meta)) {
						data = atob(data); // decode base64
					}
					if (/;\s*charset=[uU][tT][fF]-?8\s*[;,]/.test(meta)) {
						data = decodeURIComponent(escape(data)); // decode UTF-8
					}
				} else {
					xhr.open("GET", args[i], false);
					xhr.send(null);
					data = xhr.responseText;
				}
				globalEval(data);
			}
		};
	}(eval));
}

var Yan = new Object();

Yan.getEle = function(id){
	return $('#' + id);
}
/**
 * 获取小数点后后多少位
 * 
 * @param [in]
 *            num 要判断小数位数的数字
 * @return 小数点后数字的位数，若num不为小数，则返回0
 */
Yan.getDotPos = function(num){
	try{
		var s = num.toString().split('.')[1];
	}catch(e){
		return 0;
	}
	// console.log(s);
	if(typeof s != 'undefined'){
		return s.length;
	}else{
		return 0;
	}
}

/**
 * 计算两点间距离
 * 
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @return 两点间距离。
 */
Yan.distance = function(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}