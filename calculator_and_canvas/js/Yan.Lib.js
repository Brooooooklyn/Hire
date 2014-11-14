// JavaScript Document

String.format = function(src){
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\%s+)\}/g, function(m, i){
        return args[i];
    });
};

/*
 * 用于描述网格标签的对象
 */
Yan.LableData = function(){
	this.text;	// 网格标签文字
    this.x;		// 网格标签x轴位置
    this.y;		// 网格标签y轴位置
}

/**
 * 记录点坐标<br />
 * 由于一个点可能并非只有一个像素，因此使用四个值表示一个点，分别为：<br/>
 * 1. 最左像素x值：{@link #cxl} <br/>
 * 2. 最右像素x值：{@link #cxr} <br/>
 * 3. 最上像素y值：{@link #cyt} <br/>
 * 4. 最下像素y值：{@link #cyb} <br/>
 * 
 * @author Yan
 * 
 */
Yan.ExtraPoint = function(){
    this.cxl;	// 最左像素x值
    this.cxr;	// 最右像素x值
    this.cyt;	// 最上像素y值
    this.cyb;	// 最下像素y值
	
    this.lx;	// 两指x轴相对距离
    this.ly;	// 两指y轴相对距离
    this.distance = 0;	// 原始距离
    this.roX;	// 缩放中心x坐标
    this.roY;	// 缩放中心y坐标
	
	/**
     * 计算其余细节，由于需要实时改变缩放中心位置，因此除了首次记录手指位置之外，不要调用本函数。
     */
    this.detail = function(width, height) {
		this.lx = Math.abs(this.cxl - this.cxr);
		this.ly = Math.abs(this.cyt - this.cyb);
		this.computZoomCenter(width, height);
		this.distance = Yan.distance(this.cxl, this.cyt, this.cxr, this.cyb);
    }
	
	this.clearDetail = function() {
		this.distance = this.lx = this.ly = this.roX = this.roY = 0;
    }
	
	/**
     * 计算缩放中心点坐标
     */
    this.computZoomCenter = function(width, height) {
		this.roX = width / 2;
		this.roY = height / 2;
    }
	
	
    this.toString = function() {
		return String.format("cxl:%s, cxr:%s, cyt:%s, cyb:%s, lx:%s, ly:%s, distance:%s, roX:%s, roY:%s",
			this.cxl, this.cxr, this.cyt, this.cyb, this.lx, this.ly, this.distance, this.roX, this.roY);
    }

    this.clone = function() {
		var obj = new Yan.ExtraPoint();
		obj.cxl = this.cxl;
		obj.cxr = this.cxr;
		obj.cyt = this.cyt;
		obj.cyb = this.cyb;
		return obj;
    }
}

/**
 * 画布对象
 */
Yan.CanvasView = function(id, flag){
	this.ele = $('#' + id);
	this.canvas = this.ele[0];
	
	this.cacheStr = null;	// 用于缓存当前画布图像的 base64编码图像
	this.cacheEle = document.createElement('img');	// 用于缓存当前画布图像的 img 对象
	this.paintFlag = flag;
	this.paintCache = false;
	/**
	 * 建立当前图层快照
	 * 
	 * @param x
	 *            中心修正量X
	 * @param y
	 *            中心修正量Y
	 * @param grid
	 *            格子大小
	 */
	this.cache = function(x, y, grid){
		var obj = this;
		obj.cacheStr = obj.getCanvasImage("png");
		obj.cacheEle.src = obj.cacheStr;
		obj.cacheEle.cx = x;
		obj.cacheEle.cy = y;
		obj.cacheEle.grid = grid
//		console.debug('cache', obj.cacheEle.cx, obj.cacheEle.cy, obj.cacheEle.grid);
	}
	/**
	 * 获取当前图层快照
	 */
	this.getCache = function(){
		var obj = this;
		return obj.cacheEle;
	}
	/**
	 * 绘制当前图层的方法的指针
	 */
	this.paint = null;
	
	for(i in this.ele){
		this[i] = this[i] ? this[i] : this.ele[i];
	}
}

Yan.CanvasSet = function(bg, fn, pt){
	this.canvasSet = [ new Yan.CanvasView(bg, true), new Yan.CanvasView(fn, true), new Yan.CanvasView(pt, false)];
	this.bgCanvasView = this.canvasSet[0]; // 背景画布对象
	this.fnCanvasView = this.canvasSet[1];	// 函数画布图像
	this.ptCanvasView = this.canvasSet[2];	// 点画布图像
	
	this.origin = new Yan.ExtraPoint(); // 记录网格原点(0,0)坐标的对象
	this.multiTouch = new Yan.ExtraPoint();	// 多点触控时两指坐标对象
	this.w;	// 画布宽度
	this.h; // 画布高度
	this.posX = Yan.DC.DEFAULT_X;	// X轴方向偏移量，决定偏离原点方向。若x为负数，则偏向屏幕左边，反之为屏幕右边.
	this.posY = Yan.DC.DEFAULT_X;	// Y轴方向偏移量，决定偏离原点方向。若y为负数，则偏向屏幕下方，反之为屏幕上方。
	this.baseLine = function(){
		return Yan.DC.FONT_SIZE * 0.4;	// 行高修正量
	}
	
	this.moving = false;
	this.ptVal = null;
	
	/**
     * 获取坐标原点相对于原始坐标的偏移量。画布原始坐标为，左上角(0,0)，横轴往右增加，纵轴往下增加。<br/>
     * 通过本方法获得原点(0,0)想对于原始坐标的偏移量，可方便做坐标空间转换。
     */
    this.computOriginCoordinate = function() {
		var height = parseInt(this.h / 2) * 2;	// 计算宽高为2的倍数
		var width = parseInt(this.w / 2) * 2;
		this.origin.cxl = parseInt(width / 2 + this.posX) //- .5; // 对于0.5的处理，桌面平台需要0.5用来使canvas的像素点精确。移动平台需要去掉0.5
		this.origin.cxr = (this.origin.cxl + Yan.DC.LINE_WEIGHT - 1);
		this.origin.cyt = parseInt(height / 2 + this.posY) //- .5;
		this.origin.cyb = (this.origin.cyt + Yan.DC.LINE_WEIGHT - 1);
		return this.origin;
    }
	

    /**
	 * 遍历CanvasSet。使用callback逐个对CanvasView对象进行访问。
	 * 
	 * @param callback
	 *            [func] 要对CanvasView进行访问的函数指针。注意此函数的this指向该CanvasView；
	 */
    this.foreachCanvas = function(callback){
    	var obj = this;
    	for(i in obj.canvasSet){
    		var canvasView = obj.canvasSet[i];
    		callback && callback.call(canvasView);
    	}
    }
    
	/**
	 * 设置中心点修正量X
	 */
	this.setPosX = function(x){
		var obj = this;
		obj.posX = x;
	}
	/**
	 * 改变中心点修正量
	 */
	this.changePosX = function(dx){
		var obj = this;
		obj.posX += dx;
	}
	
	/**
	 * 设置中心点修正量Y
	 */
	this.setPosY = function(y){
		var obj = this;
		obj.posY = y;
	}
	/**
	 * 改变中心点修正量
	 */
	this.changePosY = function(dy){
		var obj = this;
		obj.posY += dy;
	}

	/**
	 * 设置画布大小
	 */
	this.setSize = function(o){
		var obj = this;
		obj.w = o.width;
		obj.h = o.height;
		obj.foreachCanvas(function(){
			this.attr(o);
		});
	}

	/**
	 * 清除画布内容
	 */
	this.clear = function(){
		var obj = this;
		obj.foreachCanvas(function(){
			this.saveCanvas();
			this.clearCanvas();
			this.restoreCanvas();
		});
	}
		
	/**
	 * 设置图层绘制函数
	 * @param id 图层在图层集当中的id。
	 * @param callback 绘制函数，其中this指向当前图层
	 */
	this.setPaintFunc = function(id, callback){
		var obj = this;
		var canvasView = obj.canvasSet[id];
		canvasView.paint = callback;
	}
	
	this.getActionLayer = function(){
		var obj = this;
		return obj.ptCanvasView;
	}
	
	/**
	 * 绘制所有图层
	 * 
	 * @param flag
	 *            是否强制绘制图层
	 * @param reset
	 *            是否是重设状态。如果是，则会保留重回前图层的标志值。
	 */
	this.paint = null;
	
	this.onMessage = null;
	
	this.onDragInit = function(){
		var obj = this;
//		obj.ptCanvasView.clearCanvas();
		
	}
	
	this.onDragStart = function(){
		var obj = this;
		obj.moving = true;
	}
	this.onDragEnd = function(){
		var obj = this;
		obj.moving = false;
	}
	this.onZoom = function(){
		var obj = this;
	}
	this.onTapHold = function(){
		var obj = this;
	}
}

Yan.ExpressionController = {
		'expression' : {},
		'delete' : function(id){
			delete Yan.ExpressionController.expression[id];
		},
		'regist' : function(id, color){
			Yan.ExpressionController.expression[id] = new Yan.Expression(id, color);
		},
		'add' : function(id, expr){
			var _expr = Yan.ExpressionController.expression[id];
			if(_expr){
				_expr.expr = expr;
			}
		},
		'changeVisiable' : function(id){
			var _expr = Yan.ExpressionController.expression[id];
			if(_expr){
				_expr.visible = !_expr.visible;
				Yan.DC.POINT_STATUS = Yan.DC.POINT_STOP; // 通知绘图
				return _expr.visible;
			}
		}
}

Yan.Expression = function(id, color, expr){
	this.id = id;
	this.expr = expr;
	this.color = color;
	this.visible = true;
}
