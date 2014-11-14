// JavaScript Document
var drawingStarted = {};
function DoEvent(e) {
	e.preventManipulation(); // 如果不加上这句, 则屏幕的拖动会代替绘图的动作
	var pointerId = e.pointerId;
	if (e.type == "MSPointerDown") {
		drawingStarted[pointerId] = true;
		startDraw(pointerId, e.pageX, e.pageY);
	} else if (e.type == "MSPointerMove") {
		if (drawingStarted[pointerId]) {
			extendDraw(pointerId, e.pageX, e.pageY);
		}
	} else if (e.type == "MSPointerUp") {
		delete drawingStarted[pointerId];
		endDraw(pointerId);
	}
}

/**
 * 绘制直线
 * 
 * @param start
 *            [Number] 起始点坐标
 * @param max
 *            [Number] 坐标最大值
 * @param min
 *            [Number] 坐标最小值
 * @param dp
 *            [Number] 坐标增量
 * @param ddp
 *            [Number] 加粗线间隔
 * @param sta
 *            [String] 固定绘制范围的轴名，x或y
 * @param staMin
 *            [Number] 固定绘制范围的轴的最小值
 * @param staMax
 *            [Number] 固定绘制范围的轴的最大值
 * @param flo
 *            [String] 会变化的轴名，x或y
 */
this._drawGridLines = function(start, max, min, dp, ddp, sta, staMin, staMax,
		flo, color) {
	var obj = this;
	var lineWidth;
	var padding = start;
	var i = 0;
	properties = [ [], [] ];
	while (padding < max && padding > min) {
		var property = {};
		padding += dp;

		property[sta + '1'] = staMin;
		property[sta + '2'] = staMax;
		property[flo + '1'] = padding;
		property[flo + '2'] = padding;
		i++;
		if (i == ddp) {
			i = 0;
			properties[0].push(property);
		} else {
			properties[1].push(property);
		}
	}
	obj.ele.draw(function(ctx) {
		ctx.lineWidth = Yan.DC.WIDE_LINE_WEIGHT;
		var points = properties[0];
		ctx.strokeStyle = color ? color : Yan.DC.LINE_GRAY_COLOR;
		for (i in points) {
			var property = points[i];
			ctx.beginPath();
			ctx.moveTo(property['x1'], property['y1']);
			ctx.lineTo(property['x2'], property['y2']);
			ctx.stroke();
		}

		points = properties[1];
		ctx.strokeStyle = color ? color : Yan.DC.LINE_LIGHT_COLOR;
		for (i in points) {
			var property = points[i];
			ctx.beginPath();
			ctx.moveTo(property['x1'], property['y1']);
			ctx.lineTo(property['x2'], property['y2']);
			ctx.stroke();
		}
	});
}

this._drawLines = function(points, color, lineWidth) {
	obj.ele.draw(function(ctx) {
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		for (i in points) {
			var property = points[i];
			ctx.moveTo(property['x1'], property['y1']);
			ctx.lineTo(property['x2'], property['y2']);
		}
		ctx.stroke();
	});
}

/**
 * 绘制网格
 */
this.drawGrid = function() {
	var obj = this;
	var translate = obj.getCenterOnOriginal();
	var cx = translate.x;
	var cy = translate.y;

	var dx = obj.grid.currentGridWidth; // 细网格间距
	var dy = obj.grid.currentGridWidth;
	var ddx = Yan.DC.PRIMARY_LINE_INTERVL[Yan.DC.LABEL_LIST[obj.lableListItr]]; // 粗线间距
	var ddy = Yan.DC.PRIMARY_LINE_INTERVL[Yan.DC.LABEL_LIST[obj.lableListItr]];
	obj.ele.saveCanvas();
	obj.setOriginToDefault();

	// 往原点右边画竖线
	obj._drawGridLines(cx, obj.w, cx - 1, dx, ddx, 'y', 0, obj.h, 'x');
	// 往原点左边画竖线
	obj._drawGridLines(cx, cx + 1, 0, -dx, ddx, 'y', 0, obj.h, 'x');
	// 往原点下方画横线
	obj._drawGridLines(cy, obj.h, cy - 1, dy, ddy, 'x', 0, obj.w, 'y');
	// 往原点上方画横线
	obj._drawGridLines(cy, cy + 1, 0, -dy, ddy, 'x', 0, obj.w, 'y');

	obj.ele.restoreCanvas();
}

/**
 * 绘制坐标轴
 */
this.drawAxis = function() {
	var obj = this;
	var translate = obj.getCenterOnOriginal();
	var cx = translate.x;
	var cy = translate.y;

	var dx = obj.grid.currentGridWidth; // 细网格间距
	var dy = obj.grid.currentGridWidth;

	obj.ele.saveCanvas();
	obj.setOriginToDefault();

	// 画Y轴
	obj._drawGridLines(cx - dx, cx, cx - dx - 1, dx, 0, 'y', 0, obj.h, 'x',
			Yan.DC.LINE_DARK_COLOR);
	// 画X轴
	obj._drawGridLines(cy - dy, cy, cy - dy - 1, dy, 0, 'x', 0, obj.w, 'y',
			Yan.DC.LINE_DARK_COLOR);

	obj.ele.restoreCanvas();
}

/**
 * 绘制坐标轴标签
 * 
 * @param start
 *            [Number] 起始点坐标
 * @param end
 *            [Number] 终点坐标
 * @param dp
 *            [Number] 坐标增量
 * @param ddp
 *            [Number] 标签增量
 * @param ldp
 *            [Number] 标签小数位数
 * @param sta
 *            [String] 不改变的坐标轴，x或y
 * @param staP
 *            [Number] 不改变的坐标轴标签的坐标
 * @param flo
 *            [String] 改变的坐标轴，x或y
 */
this._drawLabel = function(start, end, dp, ddp, ldp, sta, staP, flo) {
	var obj = this;
	var _lp = Math.abs(end - start);
	var _dp = Math.abs(dp);
	var count = 0;
	var p = start;
	var tp = 0;
	if (ldp > 6)
		ldp = 6;
	var properties = [];

	while (count < _lp) {
		p += dp;
		tp += ddp;
		var property = {};
		property['text'] = tp.toFixed(ldp);
		property[sta] = staP;
		property[flo] = p;
		properties.push(property);
		count += _dp;
	}
	obj.ele.draw(function(ctx) {
		ctx.fillStyle = Yan.DC.LINE_DARK_COLOR;
		ctx.font = Yan.DC.FONT;
		ctx.textAlign = Yan.DC.TEXT_ALIGN;
		for (i in properties) {
			var property = properties[i];
			ctx.fillText(property['text'], property['x'], property['y']);
		}
	});
}

/**
 * 绘制坐标轴标签
 */
this.drawLabel = function() {
	var obj = this;
	var translate = obj.getCenterOnOriginal();
	var cx = translate.x;
	var cy = translate.y;

	var dx = Yan.DC.PRIMARY_LINE_INTERVL[Yan.DC.LABEL_LIST[obj.lableListItr]]
			* obj.grid.currentGridWidth;
	var dy = Yan.DC.PRIMARY_LINE_INTERVL[Yan.DC.LABEL_LIST[obj.lableListItr]]
			* obj.grid.currentGridWidth;
	var ddx = obj.grid.currentNumIncr; // 标签增量
	var ddy = obj.grid.currentNumIncr;

	var ldx = Yan.getDotPos(ddx);
	var ldy = Yan.getDotPos(ddy);

	obj.ele.saveCanvas();
	obj.setOriginToDefault();
	obj._drawLabel(cx, obj.w, dx, ddx, ldx, 'y', (cy + 15), 'x'); // 从原点往右
	obj._drawLabel(cx, 0, -dx, -ddx, ldx, 'y', (cy + 15), 'x'); // 从原点往左
	obj._drawLabel(cy, obj.h, dy, -ddy, ldy, 'x', (cx - 10), 'y'); // 从原点往下
	obj._drawLabel(cy, 0, -dy, ddy, ldy, 'x', (cx - 10), 'y'); // 从原点往上

	// 显示原点
	obj._drawLabel(cy - dx + 15, cy, dy, 0, 0, 'x', (cx - 10), 'y');

	obj.ele.restoreCanvas();
}

$('.triangle').on('vclick', function() {// methods of triangle button when
	// click
	var blink = $('.blink');
	var prev = blink.prev();
	var method = null;
	if (prev.hasClass('bracket_') || prev.hasClass('valueNum') || 
			prev.hasClass('variable') || prev.hasClass('triangle')) {
		method = $('<span class="inputValue method">×</span>');
	}
	/*
	 * <span class="inputValue method">×</span>
	 * <span class="method_triangle inputValue"> name </span>
	 * <span class="value_triangle">
	 *  <span class="bracket inputValue">( </span>
	 *  <blink></blink>
	 *  <span class="inputValue bracket_"> )</span>
	 * </span>
	 */ 
	
	var fn0 = $('<span class="method_triangle inputValue">' + $(this).text() + "</span>");
	if(null != method){
		fn0.before(method);
	}
	var bracket_l = $('<span class="bracket inputValue">( </span>');
	var bracket_r = $('<span class="inputValue bracket_"> )</span>');
	var fn1 = $('<span class="value_triangle"></span>');
	
	blink.after(fn0);
	fn0.after(fn1);
	fn1.append(bracket_l).append(bracket_r);
	
	bracket_l.after(blink);
});
// numbers.
$('.num_btn').on('vclick', function() {
	var blink = $('.blink');
	var html = $("<span class='inputValue valueNum'>" + $(this).text() + "</span>");
	blink.after(html);
	html.after(blink);
});
// original method.
$('.method_btn').on('vclick', function() {
	var blink = $('.blink');
	if (!blink.prev().hasClass('method')) {
		var html = $("<span class='inputValue method'>" + $(this).text() + "</span>");
		blink.after(html);
		html.after(blink);
	}
});
// only less and large.
$('.other_btn').on('vclick', function() {
//	var blink = $('.blink');
//	var html = $("<span class='inputValue other'>" + $(this).text() + "</span>");
//	blink.after(html);
//	html.after(blink);
	return false;
});
$('.variable_btn').on('vclick', function() {
	var blink = $('.blink');
	/*
	 * judge the prev in the input array and use different ways to add value to the input
	 * array when prev input value is ')' ,'number','variable' add '*variable' to
	 * input array
	 */ 
	var prev = blink.prev();
	var method = null;
	if (prev.hasClass('bracket_') || prev.hasClass('valueNum')
			|| prev.hasClass('variable') || prev.hasClass('triangle')) {
		method = $("<span class='inputValue method'> × </span>");
	}
	var html = $("<span class='inputValue variable'><var>" + $(this).text() + "</var></span>");
	blink.after(html);
	if(null != method){
		html.before(method);
	}
	html.after(blink);
});
$('.equal_btn').on('vclick', function() {
	var blink = $('.blink');
	if (blink.prev().length != 0) {
		var html = $("<span class='inputValue method_equal'> = </span>");
		blink.after(html);
		html.after(blink);
	}
});
$('.point').on('vclick', function() {
	var blink = $('.blink');
	/*
	 * judge the prev in the input array and use different ways to add value to the input array
	 */
	if (blink.prev().hasClass('valueNum')) {
		var html = $("<span class='inputValue'>.</span>");
		blink.after(html);
		html.after(blink);
	}
});
$('.btn_bracket').on('vclick', function() {
	var blink = $('.blink');
	/*
	 * judge the prev in the input array and use different ways to add value to the input array
	 */
	var prev = blink.prev();
	var method = null;
	if (prev.hasClass('bracket_') || prev.hasClass('valueNum')
			|| prev.hasClass('variable') || prev.hasClass('triangle')) {
		method = $("<span class='inputValue method'> × </span>");
	}
	var html = $("<span class='inputValue bracket'>(</span>");
	blink.after(html);
	if(null != method){
		html.before(method);
	}
	html.after(blink);
	
});
$('.btn_bracket_').on('vclick', function() {
	var blink = $('.blink');
	var html = $("<span class='inputValue bracket_'>)</span>");
	blink.after(html);
	html.after(blink);
});
$('.method_divide').on('vclick', function() {
	var blink = $('.blink');
	var html = $("<span class='inputValue divide'> ÷ </span>");
	blink.after(html);
	html.after(blink);
});
$('.method_radical').on('vclick', function() {
	var blink = $('.blink');
	var prev = blink.prev();
	var method = null;
	if (prev.hasClass('bracket_') || prev.hasClass('valueNum')
			|| prev.hasClass('variable') || prev.hasClass('triangle')) {
		method = $("<span class='inputValue method'> × </span>");
	} 
	var html = $('<span class="radical_area"><span class="inputValue redical">√</span></span>'); 
	var radicalControl = $('<expr class="radical_control"></expr>');
	blink.after(html);
	html.append(radicalControl);
	if(null != method){
		html.before(method);
	}
	radicalControl.append(blink);
});
$('.method_pow').on('vclick', function() {
	var blink = $('.blink');
	//blink.after(pow2);
	var prev = blink.prev();
	var _prev = prev;
	if (prev.hasClass('bracket_')) {
		while(!_prev.hasClass('bracket')){
			prev = prev.add(_prev);
			_prev = _prev.prev();
		}
		prev.add(_prev);
	} else {
		do{
			_prev = _prev.prev();
			if(_prev.length != 0 && !_prev.hasClass('value_abs') && 
					!_prev.hasClass('method_equal') && 
					!_prev.hasClass('method') &&
					!_prev.hasClass('method_divide') && 
					!_prev.hasClass('value_ceil') &&
					!_prev.hasClass('value_log1') &&
					!_prev.hasClass('value_log2') &&
					!_prev.hasClass('value_ln') &&
					!_prev.hasClass('value_exp') &&
					!_prev.hasClass('value_fac') &&
					!_prev.hasClass('value_triangle')
					){
				prev = prev.add(_prev);
			} else {
				break;
			}
		}while(true); 
	}
	var pow0 = $('<pow class="inputValue valuePow"></pow>');
	var pow1 = $('<span class="value_pow1"></span>');
	var pow2 = $('<sup class="value_pow2 pow_sup"></sup>');
	pow1.append(prev);
	pow0.append(pow1);
	pow0.append(pow2);
	blink.after(pow0);
	pow2.append(blink);
	
	$('.pow_sup').html(blink);
	$('.value_pow1').addClass('valuePow1').removeClass('value_pow1');
	$('.value_pow2').addClass('valuePow2').removeClass('value_pow2');
	$('.pow_sup').addClass('powSup').removeClass('pow_sup');
});
$('.method_log').on('vclick', function() {
	var blink = $('.blink');
	var prev = blink.prev();
	var method = null;
	if (prev.hasClass('bracket_') || prev.hasClass('valueNum')
			|| prev.hasClass('variable') || prev.hasClass('triangle')) {
		method = $("<span class='inputValue method'> × </span>");
	}
	var log0 = $('<span class="value_log">'+ $(this).text() + '</span>');
	if(null != method){
		log0.prepend(method);
	}
	var bracket_l = $('<span class="bracket inputValue">( </span>');
	var bracket_r = $('<span class="inputValue bracket_"> )</span>');
	var sub = $('<sub class="log_"></sub>')
	var log1 = $('<span class="value_log1"></span>');
	var log2 = $('<span class="value_log2"><span class="bracket inputValue">( </span><span class="inputValue bracket_">)</span></span>');
	blink.after(log0);
	log0.after(log1);
	log1.append(sub);
	log1.after(log2);
	sub.append(bracket_l).append(bracket_r);
	bracket_l.after(blink);
});
$('.method_ln').on('vclick',function() {
	var blink = $('.blink');
	var prev = blink.prev();
	var method = null;
	if (prev.hasClass('bracket_') || prev.hasClass('valueNum')
			|| prev.hasClass('variable') || prev.hasClass('triangle')) {
		method = $("<span class='inputValue method'> × </span>");
	}
	var ln0 = $('<span class="methodLn">ln</span>');
	if(null != method){
		ln0.prepend(method);
	}
	
	var bracket_l = $('<span class="bracket inputValue">( </span>');
	var bracket_r = $('<span class="inputValue bracket_"> )</span>');
	var ln1 = $('<span class="value_ln"></span>');
	
	blink.after(ln0);
	ln0.after(ln1);
	ln1.append(bracket_l).append(bracket_r);

	bracket_l.after(blink);
});
$('.method_exp').on('vclick', function() {
	var blink = $('.blink');
	var prev = blink.prev();
	var method = null;
	if (prev.hasClass('bracket_') || prev.hasClass('valueNum')
			|| prev.hasClass('variable') || prev.hasClass('triangle')) {
		method = $("<span class='inputValue method'> × </span>");
	}
	var exp0 = $('<span class="inputValue methodExp">exp</span>');
	if(null != method){
		exp0.prepend(method);
	}
	
	var bracket_l = $('<span class="bracket inputValue">( </span>');
	var bracket_r = $('<span class="inputValue bracket_"> )</span>');
	var exp1 = $('<span class="value_exp"></span>');
	
	blink.after(exp0);
	exp0.after(exp1);
	exp1.append(bracket_l).append(bracket_r);
	bracket_l.after(blink);
});
$('.method_ceil').on('vclick', function() {
	var blink = $('.blink');
	var prev = blink.prev();
	var method = null;
	if (prev.hasClass('bracket_') || prev.hasClass('valueNum')
			|| prev.hasClass('variable') || prev.hasClass('triangle')) {
		method = $("<span class='inputValue method'> × </span>");
	}
	var ceil0 = $('<span class="inputValue methodCeil">ceil</span>');
	if(null != method){
		ceil0.prepend(method);
	}
	
	var bracket_l = $('<span class="bracket inputValue">( </span>');
	var bracket_r = $('<span class="inputValue bracket_"> )</span>');
	var ceil1 = $('<span class="value_ceil"></span>');
	
	blink.after(ceil0);
	ceil0.after(ceil1);
	ceil1.append(bracket_l).append(bracket_r);
	bracket_l.after(blink);
});
$('.method_abs').on('vclick', function() {
	var blink = $('.blink');
	var prev = blink.prev();
	var method = null;
	if (prev.hasClass('bracket_') || prev.hasClass('valueNum')
			|| prev.hasClass('variable') || prev.hasClass('triangle')) {
		method = $("<span class='inputValue method'> × </span>");
	}
	var abs0 = $('<span class="inputValue methodAbs">abs</span>');
	if(null != method){
		abs0.prepend(method);
	}
	
	var bracket_l = $('<span class="bracket inputValue">( </span>');
	var bracket_r = $('<span class="inputValue bracket_"> )</span>');
	var abs1 = $('<span class="value_abs"></span>');
	
	blink.after(abs0);
	abs0.after(abs1);
	abs1.append(bracket_l).append(bracket_r);
					
	bracket_l.after(blink);
});
$('.method_fac').on('vclick', function() {
	var blink = $('.blink');
	
	var prev = blink.prev();
	var _prev = prev.prev();
	if (prev.hasClass('bracket_')) {
		while(!_prev.hasClass('bracket')){
			prev = prev.add(_prev);
			_prev = _prev.prev();
		}
		prev.add(_prev);
	} else {
		do{
			if(_prev.length != 0 && !_prev.hasClass('value_abs') && !_prev.hasClass('method_equal') && 
					!_prev.hasClass('method') && !_prev.hasClass('method_divide') && 
					!_prev.hasClass('value_ceil') && !_prev.hasClass('value_log1') &&
					!_prev.hasClass('value_log2') && !_prev.hasClass('value_ln') &&
					!_prev.hasClass('value_exp') && !_prev.hasClass('value_fac') &&
					!_prev.hasClass('value_triangle')
					){
				prev = prev.add(_prev);
				_prev = _prev.prev();
			} else {
				break;
			}
		}while(true); 
	}
	
	var facSing = $('<span class="inputValue methodFac">!</span>');					
	var fac0 = $('<fac class="inputValue value_fac"></fac>');
	fac0.append(prev).append(facSing);
	blink.after(fac0);
	fac0.after(blink);
});
$('.arrow_t').on('vclick', function() {
	var blink = $('.blink');
	if(blink.parent().hasClass('log_')){
		blink.parents('.value_log1').first().next('span').children('span.bracket').first().after(blink);
	}
});
$('.arrow_l').on('vclick', function() {
	var blink = $('.blink');
	var prev = blink.prev('span');
	if (prev.length != 0) {
		prev.before(blink);
	} else {
		var parent = blink.parents('span').first();
		if(!parent.hasClass('textarea')){
			parent.before(blink);
		}
	}
});
$('.arrow_b').on('vclick', function() {
	var blink = $('.blink');
	var parent = blink.parent('.value_log2');
	if(parent.length > 0){
		var prev = parent.prev();
		var ele = $('span.bracket_', prev).last();
		if(ele.length > 0){
			ele.before(blink);
		}
	}
});
$('.arrow_r').on('vclick',	function(e) {
	var blink = $('.blink');
	var next = blink.next('span');
	if (next.length != 0) {
		next.after(blink);
	} else {
		var parent = blink.parents('span').first();
		if(!parent.hasClass('textarea')){
			parent.after(blink);
		}
	}
});
$('.enter').on('vclick', function() {
	var blink = $('.blink');
	Lyn.user.transInput();
	blink.remove();
});
$('#delete').on('vclick', function() {
	var blink = $('.blink'); // get the blink.
	var textarea = $('.textarea'); // get the root.
	
	var prev = blink.prev();
	if(prev.length > 0){
		var item = prev.find('span').last();
		if(item.length > 0){
			item.before(blink);
			item.remove();
		} else {
			prev.before(blink);
			prev.remove();
		}
	} else {
		var parent = blink.parent();
		var _parent = parent;
		while(parent.length > 0 && !parent.hasClass('textarea')){
			var pPrev = parent.prev();
			if(pPrev.length > 0){
				parent.before(blink);
				parent.remove();
				return;
			}else{
				_parent = parent;
				parent = parent.parent();
			}
		}
		if(!_parent.hasClass('textarea')){
			_parent.before(blink);
			_parent.remove();
		}
	}
});