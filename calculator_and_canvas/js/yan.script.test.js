// JavaScript Document
// 说明，对画布进行任何改变时，首先需要save当前设置和状态，绘制完成自后记得restore。不要贪图方便不进行保存和重置。
var Yan = Yan || new Object();
var $ = jQuery.noConflict();
/**
 * 获取小数点后后多少位
 * 
 * @param [in]
 *            num 要判断小数位数的数字
 * @return 小数点后数字的位数，若num不为小数，则返回0
 */
Yan.getDotPos = function(num){
    var s = num.toString().split('.')[1];
	// console.log(s);
	if(typeof s != 'undefined'){
		return s.length;
	}else{
		return 0;
	}
}

/*
格子类
	将采用预渲染机制提高效率。
	格子标签数字总共有3个，由 Yan.DC.GRID.LABEL_LIST 指示，起始数字为 Yan.DC.GRID.DEFAULT_LABEL_LIST_TIR ，每个数字的大格子包含的小格子数由 Yan.DC.GRID.PRIMARY_LINE_INTERVAL 保存。
	每个小格子大小范围在 Yan.DC.GRID.MIN_GRID_WIDTH 与 Yan.DC.GRID.MAX_GRID_WIDTH 之间。最大和最小之间的切片数由 Yan.DC.GRID.GRID_WIDTH_SPLIT 指定。

	预渲染机制：
	考虑到格子放大缩小是一系列格子大小的循环，而移动仅仅是计算中心坐标偏移量再重新渲染，预渲染机制即预先渲染每个数字的每个切片的大格子，然后将其作为一张图片重复渲染平铺整个画布。
	考虑到单像素渲染的问题，预先约定，坐标线条宽度一律为2px，主线条和从线条使用不同深浅颜色区别开。
	canvas的宽度只能是偶数像素，中点为直线 (width/2, width/2+1) 和 (height/2, height/2+1) 交汇处。
	绘制切片图片时，中间小格子的线条使用2px，切片边缘线条使用1px，拼合之后即为2px。
*/
Yan.DC.GRID = function() {
    /**
	 * 部分静态常量
	 */

    Yan.DC.GRID.LABEL_LIST = [5, 2, 1];     // 标签数字
    Yan.DC.GRID.DEFAULT_LABEL_LIST_TIR = 1;
    Yan.DC.GRID.LABEL_LIST_ITR = Yan.DC.GRID.DEFAULT_LABEL_LIST_TIR;    	    // 指示当前标签数字的指针
    Yan.DC.GRID.PRIMARY_LINE_INTERVAL = { '1' : 4, '2' : 4, '5' : 5 };   // 各标签数字的主线间隔，其中的数字为间隔的格子数

    Yan.DC.GRID.DEFAULT_GRID_WIDTH = 20;	// 默认格子大小
    Yan.DC.GRID.MIN_GRID_WIDTH = 20;	    // 格子的最小大小
    Yan.DC.GRID.MAX_GRID_WIDTH = 40;	    // 格子的最大大小
    Yan.DC.GRID.GRID_WIDTH_SPLIT = 10;	    // 将最小值和最大值差值切片的切片数
    Yan.DC.GRID._GRID_WIDTH_SPLIT = Math.ceil((Yan.DC.GRID.MAX_GRID_WIDTH - Yan.DC.GRID.MIN_GRID_WIDTH) / Yan.DC.GRID.GRID_WIDTH_SPLIT);   // 方便用于计算的切片因数
    Yan.DC.GRID.MOUSEWHEEL_TIMES = 5;   // 其中5的常数为鼠标滚轮滚动几次会使标签数字改变
    Yan.DC.GRID.MOUSEWHEEL_INCREASE = parseInt((Yan.DC.GRID.GRID_WIDTH_SPLIT / Yan.DC.GRID.MOUSEWHEEL_TIMES));  // 每次鼠标滚轮调用increase次数，

    Yan.DC.GRID.LABEL_MUTIPLE = 0;  // 标签倍数，即显示是是原来的 Math.pow(10, LABEL_MUTIPLE)
									// 倍.
    Yan.DC.GRID.MIN_TIMES = -6;     // 标签最小倍数，为 10^-6
    Yan.DC.GRID.MAX_TIMES = 6;      // 标签最大倍数，为 10^6

    /**
	 * 当前格子的宽度
	 */
    this.currentGridWidth = -1;

	// 切片数组
	this.slices = [];
	// 当前切片指针
	this.currentSlicesItr = -1;
	/**
	 * 当前数字倍数，以10为底。
	 */
    this._times = 0;

    this._default = function(){
        var obj = this;
        Yan.DC.GRID.LABEL_LIST_ITR = Yan.DC.GRID.DEFAULT_LABEL_LIST_TIR; 
        obj.currentGridWidth = Yan.DC.GRID.DEFAULT_GRID_WIDTH;
		obj.currentSlicesItr = Yan.DC.GRID.DEFAULT_LABEL_LIST_TIR * Yan.DC.GRID.GRID_WIDTH_SPLIT + ((Yan.DC.GRID.DEFAULT_GRID_WIDTH - Yan.DC.GRID.MIN_GRID_WIDTH) / Yan.DC.GRID._GRID_WIDTH_SPLIT);
		obj._times = Yan.DC.GRID.LABEL_MUTIPLE;
        obj.currentNumIncr = obj._getNumIncr();
    }

    /*
	 * 格子宽度的增减应该是一个过程，每次运行增减1。 如果要进行跳跃式设置，则应该进行增减操作之后获得最后参数再绘图
	 * 
	 * 初始化为默认标签和间距，每次增加和减小的单位 (1/Yan.DC.GRID.GRID_WIDTH_SPLIT)，
	 * 鼠标和手势的变化量有不同，具体表现在鼠标为离散型变化，在windows下，鼠标滚轮每次提供±120的增减值，而手势的增减值不定。
	 * 对应增减单位的换算由具体方法进行转换
	 * 
	 * 放大和缩小操作分为分为三个级别：
     * 每次增加(放大)时： 
     * 1. 格子宽度增加一个单位， 
     * 2. 当格子宽度增加完成一个循环后，标签指针向前递增1，
	 * 3. 当标签指针递增完成一个循环，标签倍数缩小一个底数(10)。 
     * 
     * 每次减小(缩小)时： 
     * 1. 格子宽度减小一个单位, 
     * 2. 当格子宽度减小完成一个循环后，标签指针向后递减1，
     * 3. 当标签指针递减完成一个循环，标签倍数增大一个底数(10)。
	 */

    /**
	 * 获取当前标签增量
	 */
    this._getNumIncr = function(n){
        var obj = this;
        var result =  n * Math.pow(10, obj._times);
        if(obj._times < 0){
            var t = Math.abs(obj._times);
            result = result.toFixed(t);
        }
        return Number(result);
    }

    /**
	 * 放大坐标的方法 鼠标滚轮向上，或者触屏手势的放大操作，即为放大坐标
     * 放大坐标具体表现为，格子宽度增加，坐标轴数字变小。
     * 每次增加(放大)时：
     *  1. 格子宽度增加一个单位， 
     *  2. 当格子宽度增加完成一个循环后，标签指针向前递增1， 
     *  3. 当标签指针递增完成一个循环，标签倍数缩小一个底数(10)。
	 */
    this._increase = function(n){
        var obj = this;
        n = n?n:1;
		obj.currentSlicesItr += 1;
		if(obj.currentSlicesItr >= obj.slices.length){
			obj.currentSlicesItr -= obj.slices.length;
			// 当指针递增完成一个循环，标签倍数缩小一个底数(10)。
			obj._times -= 1;
			if(obj._times < Yan.DC.GRID.MIN_TIMES){
				obj._times = Yan.DC.GRID.MIN_TIMES;
			}
		}
    }

    /**
	 * 缩小坐标的方法
     * 鼠标滚轮向下，或者触屏手势的缩小操作，即为缩小坐标
     * 缩小坐标具体表现为，格子宽度减小，坐标轴数字变大。
     * 每次减小(缩小)时： 
     *  1. 格子宽度减小一个单位, 
     *  2. 当格子宽度减小完成一个循环后，标签指针向后递减1， 
     *  3. 当标签指针递减完成一个循环，标签倍数增大一个底数(10)。
	 */
    this._decrease = function(){
        var obj = this;		
		obj.currentSlicesItr -= 1;
		if(obj.currentSlicesItr < 0){
			obj.currentSlicesItr += obj.slices.length;
			// 当指针递减完成一个循环，标签倍数增大一个底数(10)。
			obj._times += 1;
			if(obj._times > Yan.DC.GRID.MAX_TIMES){
				obj._times = Yan.DC.GRID.MAX_TIMES;
			}
		}
    }

    this.onMouseWheel = function(e){
		var obj = this;
		var delta = e.wheelDelta;
		// TODO 鼠标滚轮事件的跨浏览器兼容

        // delta每次为±120，这里设置个常量，
        if((delta < 0 && obj._times >= Yan.DC.GRID.MAX_TIMES) || (delta > 0 && obj._times <= Yan.DC.GRID.MIN_TIMES)){
            return;
        }
        // 每次鼠标滚轮都增加 (1 / Yan.DC.GRID.MOUSEWHEEL_TIMES)
		// 的(Yan.DC.GRID.MAX_GRID_WIDTH - Yan.DC.GRID.MIN_GRID_WIDTH)
        var fn = null;
        if(delta > 0){
            fn = obj._increase;
        }else{
            fn = obj._decrease;
        }
        for(var i=0; i < Yan.DC.GRID.MOUSEWHEEL_INCREASE; i++){
            fn.call(obj);
        }        
	}

    this.onGestureChange = function(e){
        var obj = this;
        var scale = e.scale;
        $('#tttt').text(scale);
    }



	/*
		预渲染机制：
		考虑到格子放大缩小是一系列格子大小的循环，而移动仅仅是计算中心坐标偏移量再重新渲染，预渲染机制即预先渲染每个数字的每个切片的大格子，然后将其作为一张图片重复渲染平铺整个画布。
		考虑到单像素渲染的问题，预先约定，坐标线条宽度一律为2px，主线条和从线条使用不同深浅颜色区别开。。
		绘制切片图片时，中间小格子的线条使用2px，切片边缘线条使用1px，拼合之后即为2px。


	*/


	this.preRendered = function(){
		var obj = this;
		var slicesProperty = {};
		// 为每个切片准备渲染数据
		for(var i = 0; i < Yan.DC.GRID.LABEL_LIST.length; i++){
			slicesProperty[Yan.DC.GRID.LABEL_LIST[i]] = [];
			// 小格子个数
			var interval = Yan.DC.GRID.PRIMARY_LINE_INTERVAL[Yan.DC.GRID.LABEL_LIST[i]];
			for(var j = 0; j < Yan.DC.GRID.GRID_WIDTH_SPLIT; j++){
				// 小格子和大格子宽度。注意，这里宽度是不包含线宽的。
				// 也就是说，假设大格子中有4个小格子，那么大格子的宽度应该是 bSideLength 基础上加上(2*3+2)，其中，第一个2为每线宽为2px，第一个3为中间有(4 - 1)条分隔线，第二个2为大格子边缘1px宽度边线。
				var sSideLength = Yan.DC.GRID.MIN_GRID_WIDTH + j * Yan.DC.GRID._GRID_WIDTH_SPLIT;
				var bSideLength = sSideLength * interval;

				var property = {
					'label' : Yan.DC.GRID.LABEL_LIST[i],
					'interval' : interval,
					'sSideLength' : sSideLength,
					'bSideLength' : bSideLength
				};

				slicesProperty[Yan.DC.GRID.LABEL_LIST[i]].push(property);
			}
		}

		var slicesLength = Yan.DC.GRID.LABEL_LIST.length * Yan.DC.GRID.GRID_WIDTH_SPLIT;
		for(var i = 0; i < Yan.DC.GRID.LABEL_LIST.length; i++){
			var properties = slicesProperty[Yan.DC.GRID.LABEL_LIST[i]];
			for(var j = 0; j < properties.length; j++){
				var property = properties[j];
				var mCanvas = document.createElement('canvas');
				obj.slices.push({
					'label' : property['label'],
					'interval' : property['interval'],
					'gridWidth' : property['sSideLength'],
					'canvas' : mCanvas
				});
				mCanvas.width = property['bSideLength'] + (2 * (property['interval'] - 1) + 2);
				mCanvas.height = property['bSideLength'] + (2 * (property['interval'] - 1) + 2);
				var ctx = mCanvas.getContext('2d');

				// 绘制边缘线条。
				ctx.save();
				ctx.strokeStyle = Yan.DC.lineGrayColor;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(mCanvas.width, 0);
				ctx.lineTo(mCanvas.width, mCanvas.height);
				ctx.lineTo(0, mCanvas.height);
				ctx.lineTo(0, 0);
				ctx.stroke();
				ctx.restore();

				// 绘制中间分隔线
				ctx.save();
				ctx.strokeStyle = Yan.DC.lineLightColor;
				ctx.lineWidth = 2;
				ctx.beginPath();
				var startX = 0; var startY = 1;
				for(var k = 1; k < property['interval']; k++){
					startX += (property['sSideLength'] + 2);
					ctx.moveTo(startX, startY);
					ctx.lineTo(startX, mCanvas.height - 1);
				}
				startX = 1; startY = 0;
				for(var k = 1; k < property['interval']; k++){
					startY += (property['sSideLength'] + 2);
					ctx.moveTo(startX, startY);
					ctx.lineTo(mCanvas.width - 1, startY);
				}
				ctx.stroke();
				ctx.restore();
			}
		}
	}



	this.getCurrentSlices = function(){
		var obj = this;
		var slice = obj.slices[obj.currentSlicesItr];
		return slice;
	}


	this.init = function(){
		var obj = this;
        obj._default();
		obj.preRendered();
	}

	this.init();

};

/**
 * 
 */
Yan.Canvas = function(id){
	this.ele = $('#'+id);
	this.h = -1;
	this.w = -1;
	this.grid = null;

	this.x = Yan.DC.DEFAULT_X;    // X轴方向偏移量，决定偏离原点方向。若x为负数，则偏向屏幕右边，反之为屏幕左边。
	this.y = Yan.DC.DEFAULT_Y;	// Y轴方向偏移量，决定偏离原点方向。若y为负数，则偏向屏幕下方，反之为屏幕上方。

    this.currentMousePosX = -1;
    this.currentMousePosY = -1;
    this.lastX = 0;
    this.lastY = 0;
    this.isBindEvent = false;

    /**
	 * 背景图层名
	 */
    this.BACKGROUND_LAYER_NAME = 'background_layer';

	/**
	 * 进行坐标转换
	 */
	this.fixPosX = function(x){
		return x - this.x;
	}
	/**
	 * 进行坐标转换
	 */
	this.fixPosY = function(y){
		return y - this.y;
	}

	/**
	 * 清除画布内容
	 */
	this.clear = function(){
		var obj = this;
		obj.ele.saveCanvas();
		obj.ele.clearCanvas();
		obj.ele.restoreCanvas();
	}


	/**
	 * 进行用户坐标和画布坐标的转换
	 * 
	 * @param [in]
	 *            x
	 * @param [in]
	 *            y
	 * @returns {x, y}
	 */
	this.fixPos = function(x, y){
		var $this = this;
		var result = {
				'x' : $this.fixPosX(x),
				'y' : $this.fixPosY(y)
		};

		//console.log(obj);
		return obj;
	}

	/**
	 * 获取坐标原点相对于原始坐标的偏移量
	 */
	this.getCenterOnOriginal = function(){
		var obj = this;

		var cxl = ~~((obj.ele.width() / 2) + 0.5);
		var cxr = ~~((cxl + 1) + 0.5);
		var cyt = ~~((obj.ele.height() / 2) + 0.5);
		var cyb = ~~((cyt + 1) + 0.5);

		var result = {
				cxl : cxl - obj.x,
				cxr : cxr - obj.x,
				cyt : cyt - obj.y,
				cyb : cyb - obj.y
		}
		return result;
	}

	/**
	 * 设定画布的物理原点与逻辑原点重合。 绘制完成坐标轴后，逻辑原点由{@link #getCenterOnOriginal()}提供，是坐标轴的原点位置。
	 * 画布物理原点即在初始状态下左上角的(0,0)点。本函数改变画布物理原点，使其与坐标轴原点重合。
	 */
	this.setOriginToCenter = function(){
		var obj = this;
		var translate = obj.getCenterOnOriginal();
		obj.ele.translateCanvas({
			translateX : translate.x,
			translateY : translate.y
		});
	}

	/**
	 * 设置坐标原点为(0, 0)
	 */
	this.setOriginToDefault = function(){
		var obj = this;
		obj.ele.translateCanvas({
			translateX : 0,
			translateY : 0
		});
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
	this._drawLabel = function(start, end, dp, ddp, ldp, sta, staP, flo){
		var obj = this;
		var _lp = Math.abs(end - start);
		var _dp = Math.abs(dp);
		var count = 0;
		var p = start;
		var tp = 0;
		if(ldp > 6) ldp = 6;
		var properties = [];

		while(count < _lp){
			p += dp;
			tp += ddp;
            var property = {};
			property['text'] = tp.toFixed(ldp);
			property[sta] = staP;
			property[flo] = p;
			properties.push(property);
			count += _dp;
		}
		return properties;
	}

    /**
	 * 绘制背景图层
	 * 
	 * @param flag
	 *            [bool] 是否强制刷新，若为true，则强制刷新canvas。
	 */
	this.paintBg = function(flag){
		var obj = this;
        flag = flag ? true : false;

        // TODO 保存已绘制的函数的图像快照，一并将函数图层移出图层队列。作移动和缩放时只同步移动和缩放快照。
        obj.ele.removeLayers();

		obj.ele.addLayer({
			'type'	: 'function',
			'name'	: obj.BACKGROUND_LAYER_NAME,
			'fn'	: function(ctx) {
				var translate = obj.getCenterOnOriginal();
				var cXl = translate.cxl;
				var cXr = translate.cxr;
				var cYt = translate.cyt;
				var cYb = translate.cyb;

				// 绘制网格
				var w = obj.ele.width();
				var h = obj.ele.height();
				var l = w > h ? w : h;			
				var slice = obj.grid.getCurrentSlices();
				var canvas = slice['canvas'];

				ctx.save();
				ctx.translate(cXr, cYb);
				var pat = ctx.createPattern(canvas, "repeat");
				ctx.fillStyle = pat;

				var x1 = x2 = x3 = x4 = y1 = y2 = y3 = y4 = 0;
				var lx1, lx2, lx3, lx4, ly1, ly2, ly3, ly4;
				lx1 = obj.ele.height() - cYb; lx2 = cXl; lx3 = cYt; lx4 = obj.ele.width() - cXr; 
				ly1 = lx2; ly2 = lx3; ly3 = lx4; ly4 = lx1;
				if(cXr >= obj.ele.width()){
					lx4 = 0; ly3 = 0;
					y1 = x2 = cXr - obj.ele.width();
				}else if(cXr <= 0){
					ly1 = 0; lx2 = 0;
					x4 = y3 = -cXr;
				}
				if(cYb >= obj.ele.height()){
					lx1 = 0; ly4 = 0;
					y2 = x3 = cYb - obj.ele.height();
				}else if(cYb <= 0){
					ly2 = 0; lx3 = 0;
					x1 = y4 = -cYb;
				}
				var edge = [{'x' : x1, 'y' : y1, 'lx' : lx1, 'ly' : ly1}, 
				{'x' : x2, 'y' : y2, 'lx' : lx2, 'ly' : ly2}, 
				{'x' : x3, 'y' : y3, 'lx' : lx3, 'ly' : ly3}, 
				{'x' : x4, 'y' : y4, 'lx' : lx4, 'ly' : ly4}];


				for(var i = 0; i < 4; i++){
					//ctx.save();
					//ctx.rotate((Math.PI*2 / 4) * i);
					ctx.rotate((Math.PI*2 / 4));
					ctx.fillRect(edge[i].x, edge[i].y, edge[i].lx, edge[i].ly);
					//ctx.restore();
				}
				ctx.restore();

				// 绘制坐标轴
				ctx.save();
				ctx.strokeStyle = Yan.DC.lineDarkColor;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(cXr, 0);
				ctx.lineTo(cXr, obj.ele.height());
				ctx.moveTo(0, cYb);
				ctx.lineTo(obj.ele.width(), cYb);
				ctx.stroke();
				ctx.restore();

				// 添加坐标
				var dx = canvas.width;
				var dy = canvas.height;
				var ddx = obj.grid._getNumIncr(slice['label']); // 标签增量
				var ddy = ddx;

				var ldx = Yan.getDotPos(ddx);
				var ldy = Yan.getDotPos(ddy);

				ctx.save();
				var tmp = new Array();
				var properties = tmp.concat(
					obj._drawLabel(cXr, obj.w, dx, ddx, ldx, 'y', (cYb + 15), 'x'),		// 从原点往右
					obj._drawLabel(cXl, 0, -dx, -ddx, ldx, 'y', (cYb + 15), 'x'),		// 从原点往左
					obj._drawLabel(cYb, obj.h, dy, -ddy, ldy, 'x', (cXl - 10), 'y'),	// 从原点往下
					obj._drawLabel(cYt, 0, -dy, ddy, ldy, 'x', (cXl - 10), 'y'),		// 从原点往上
					obj._drawLabel(cYb - dx + 15, cYb, dy, 0, 0, 'x', (cXl - 10), 'y')	// 显示原点
				);
				ctx.fillStyle = Yan.DC.lineDarkColor;
				ctx.font = Yan.DC.font;
				ctx.textAlign = Yan.DC.TEXT_ALIGN;
				for(i in properties){
					var property = properties[i];
					ctx.fillText(property['text'], property['x'], property['y']);
				}

				ctx.restore();
			}
		});

        // TODO 将函数图层添加回图层队列，并绘制函数图象。注意设置绘图延时。
        if(flag){
            // obj.ele.drawLayer(obj.BACKGROUND_LAYER_NAME);
            obj.paint();
        }
	}

    /**
	 * 绘制所有缓存的图层
	 */
	this.paint = function(){
		var obj = this;
		obj.ele.drawLayers();
		/*obj.ele.draw(function(ctx){
			var slices = obj.grid.slices;
			var bx = 0; var by = 0;
			for(var i in slices){
				var slice = slices[i];
				var w = slice.width;
				var h = slice.height;
				ctx.drawImage(slice, bx, by);
				bx += w;
				if(bx >= obj.ele.width()){
					bx = 0;
					by += h;
				}
			}
		});*/
	}

	this.draw = function(param){
		var obj = this;
		for(itr in param){
			var item = param[itr];
			var name = item['name'];
			var fn = item['fn'];
			obj.ele.addLayer({
				'type' : 'function',
				'name' : name,
				'fn' : function(){
					for(i in fn){
						var _fn = fn[i];
						_fn();
					}
				}
			});
		}
		obj.ele.drawLayers();
	}

    this._bindDragStart = function(){
        var obj = this;
        $(document).bind('mousemove touchmove', function(e){
            console.log(e.type);
            obj._onDragStart(e);
        });
    }

    this._unbindDragStart = function(){
        $(document).unbind('mousemove');
        $(document).unbind('touchmove');
    }

    this.prevX = -1;
    this.prevY = -1;

    /**
	 * 画布mousedown、touchstart事件代理函数，但这两个事件发生时，分别对document对象绑定mousemove和touchmove事件。
     * 当在移动设备当中进行缩放等高级手势操作时，会多次触发上述两个事件。因此在高级手势处理方法当中，应当戒除绑定
     * mousemove和touchmove事件。
	 * 
	 * @param e
	 *            [Object] mousedown事件对象
	 */
    this._onDragInit = function(e){
        var obj = this;
        if(obj.isBindEvent){
            return;
        }else{
            obj.isBindEvent = true;
        }

        obj.currentMousePosX = e.offsetX;
    	obj.currentMousePosY = e.offsetY;
        obj.lastX = obj.x;
        obj.lastY = obj.y;
        obj.prevX = e.offsetX;
        obj.prevY = e.offsetY;
        obj._bindDragStart();

    }

    /**
	 * 画布mouseup事件代理方法
	 * 
	 * @param e
	 *            [Object] mouseup事件对象
	 */
    this._onDragEnd = function(e){
        var obj = this;
        obj._unbindDragStart();
        obj.isBindEvent = false;
    }

    /**
	 * document 的 mousemove事件代理函数
	 * 
	 * @param e
	 *            [Object] mousemove事件对象
	 */
    this._onDragStart = function(e){
        var obj = this;
		e.preventDefault();	// 禁止浏览器默认touch move事件，一般为页面拖拽
        var _x = e.offsetX;
        var _y = e.offsetY;
        var dx = _x - obj.currentMousePosX;
        var dy = _y - obj.currentMousePosY;

        obj.x = obj.lastX - dx;
        obj.y = obj.lastY - dy;
        //if(Math.abs(e.offsetX - obj.prevX) > 5 || Math.abs(e.offsetY - obj.prevY) > 5){
            //console.log(Math.abs(e.offsetX - obj.prevX) + ' ' + Math.abs(e.offsetY - obj.prevY));
        //    obj.prevX = e.offsetX;
        //    obj.prevY = e.offsetY;
            obj.paintBg(true);
            return;
        //}
    }

    /**
     * gesturestart事件代理函数。
     * 当两根以上手指同时触击屏幕时会触发gesturestart事件。处理gesturestart事件是需要暂时屏蔽
     * 拖拽事件，否则容易出错。
     * @param e [Object] gesturestart事件对象
     */
    this._onGestureStart = function(e){
        var obj = this;
        // 先禁用拖拽事件
        obj._unbindDragStart();
        // 同时需要设置绑定标志位，避免后来的触击事件导致再次绑定拖拽事件
        obj.isBindEvent = true;
        // 绑定gesturechange事件
        $(document).bind('gesturechange', function(e){
            obj._onGestureChange(e);
        });

    }

    this._onGestureChange = function(e){
        var obj = this;
        obj.grid.onGestureChange(e);
        obj.paintBg(true);
        console.log(e);
    }

    this._onGestureEnd = function(e){
        var obj = this;

        // 解绑gesturechange事件
        $(document).unbind('gesturechange');
        // 重设绑定标志位，让后来的触击事件再次绑定拖拽事件
        obj.isBindEvent = false;
    }


	/**
	 * 重新绘制画布
	 */ 
	this.reset = function(){
		var obj = this;
		// 恢复基本参数设置
        obj.x = Yan.DC.DEFAULT_X;
        obj.y = Yan.DC.DEFAULT_Y;
        obj.grid._default();

		// 清空画布
		obj.clear();
        // 绘制背景
		obj.paintBg();

		obj.paint();
	}

    /**
	 * 鼠标滚轮事件委托方法
	 * 
	 * @param e
	 *            [Object] 鼠标滚轮事件
	 */
    this._onMouseWheel = function(e){
        var obj = this;

        obj.grid.onMouseWheel(e);
        obj.paintBg(true);
    }

    /**
	 * resize事件委托方法
	 * 
	 * @param e
	 *            [Object] resize事件
	 */
	this.resize = function(e){
		var obj = this;
		obj.w = parseInt(obj.ele.width());
		obj.h = parseInt(obj.ele.height());
		obj.paintBg();
		obj.paint();
	}

	/**
	 * 初始化函数
	 */
	this.init = function(){
		var obj = this;
		// 初始化各参数

		obj.ele.saveCanvas();
		obj.h = obj.ele.height();
		obj.w = obj.ele.width();
		obj.grid = new Yan.DC.GRID();

		obj.ele.bind('mousewheel', function(e){
			var mouseWheelEvent = window.event;
			// TODO 处理兼容问题
			obj._onMouseWheel(mouseWheelEvent);
		});

        obj.ele.bind('mousedown touchstart', function(e){
            console.log(e.type);
            obj._onDragInit(e);
        });

        obj.ele.bind('mouseup mouseleave touchend touchcancel', function(e){
            console.log(e.type);
            obj._onDragEnd(e);
        });

        obj.ele.bind('gesturestart', function(e){
            obj._onGestureStart(e);
        });

        obj.ele.bind('gestureend', function(e){
            obj.__onGestureEnd(e);
        });
    }

    this.init();
}
