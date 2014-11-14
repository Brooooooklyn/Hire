// JavaScript Document
// 说明，对画布进行任何改变时，首先需要save当前设置和状态，绘制完成自后记得restore。不要贪图方便不进行保存和重置。
var Yan = Yan || new Object();
var $ = jQuery.noConflict();

/**
 * 画布控制器
 */
Yan.CanvasController = function(bg, fn, pt){
	this.canvasSet = new Yan.CanvasSet(bg, fn, pt);
	this.grid = null;	// 网格对象

	this.h = -1;	// 画布高度
	this.w = -1;	// 画布宽度


	this.x = Yan.DC.DEFAULT_X;    // X轴方向偏移量，决定偏离原点方向。若x为负数，则偏向屏幕右边，反之为屏幕左边。
	this.y = Yan.DC.DEFAULT_Y;	// Y轴方向偏移量，决定偏离原点方向。若y为负数，则偏向屏幕下方，反之为屏幕上方。

    this.currentMousePosX = -1;	// 当前焦点X坐标
    this.currentMousePosY = -1;	// 当前焦点Y坐标
    this.lastX = 0;
    this.lastY = 0;
    this.isBindEvent = false;
	this.touchMode = Yan.DC.TOUCH_MODE_NONE;

	this.requestId;
	this.startTime = -1;
	this.fnTimeStamp = Yan.DC.FN_TIMEOUT_TIMER;
	this.timeStampDiff = 0;

	this.worker = new Worker('js/Yan.PointComputWorker.js');
	this.workerId = null;
	
	/**
	 * 次要网格线的点集。
	 */
    this.minorPts = null;
    /**
	 * 次要网格线点集数组{@link #minorPts}当前元素下标。
	 */
    this.minorPtsItr;
    /**
	 * 主要网格线的点集
	 */
    this.primaPts = null;
    /**
	 * 主要网格线点集数组{@link #primaPts}当前元素下标。
	 */
    this.primaPtsItr;
    /**
	 * 坐标轴点集数组
	 */
    this.axisPts = null;
    /**
	 * 指示坐标轴点集数组{@link #axisPts}当前元素下标。
	 */
    this.axisPtsItr;
    /**
	 * 坐标标签元素集数组，{@link #LableData}类型。注意这里应该是二维数组。 lables[0] 为横坐标，文字居中对其
	 * lables[1] 为纵坐标，文字右对齐。 横纵坐标区别在于字符对其方式。
	 */
    this.lables = new Array(2);
    /**
	 * 指示坐标轴标签元素集数组{@link #lables}当前元素的下标。
	 */
    this.lablesItr = new Array(2);
	/**
	 * 指示坐标标签是否越出显示区域
	 */
	this.lablesOverFlow = [false, false];

    /**
	 * 背景图层名
	 */
    Yan.CanvasController.BACKGROUND_LAYER_NAME = 'background_layer';

	/**
	 * 获取多点触控时代表两个手指坐标点的对象
	 */
	this.getMultiThouch = function(){
		var obj = this;
		return obj.canvasSet.multiTouch;
	}
	/**
	 * 计算坐标纸原点在画布当中的坐标。
	 */
	this.computOriginCoordinate = function(){
		var obj = this;
		obj.canvasSet.computOriginCoordinate();
	}

	this.changePosX = function(dx){
		var obj = this;
		obj.canvasSet.changePosX(dx);
	}

	this.changePosY = function(dy){
		var obj = this;
		obj.canvasSet.changePosY(dy);
	}

	/**
	 * 清除画布内容
	 */
	this.clear = function(){
		var obj = this;
		obj.canvasSet.clear();
	}

	/**
	 * 绘制网格
	 */
	this.drawGrid = function(ctx){
		var obj = this;
		var width = obj.w;
		var height = obj.h;
		var interval = obj.grid.getInterval();
		obj.prepareMinorPts(width, height, interval);
		obj.preparePrimaPts(width, height, interval);
		ctx.save();
		ctx.lineWidth = Yan.DC.LINE_WEIGHT;
		ctx.strokeStyle = Yan.DC.LINE_LIGHT_COLOR;
		var i = 0;
		for(i = 0; i < obj.minorPtsItr; i++){
			var property = obj.minorPts[i];
			ctx.beginPath();
			ctx.moveTo(property['x1'], property['y1']);
			ctx.lineTo(property['x2'], property['y2']);
			ctx.stroke();
		}
		ctx.strokeStyle = Yan.DC.LINE_GRAY_COLOR;
		for(i = 0; i < obj.primaPtsItr; i++){
			var property = obj.primaPts[i];
			ctx.beginPath();
			ctx.moveTo(property['x1'], property['y1']);
			ctx.lineTo(property['x2'], property['y2']);
			ctx.stroke();
		}

		ctx.strokeStyle = Yan.DC.LINE_DARK_COLOR;
		for(i = 0; i < obj.axisPtsItr; i++){
			var property = obj.axisPts[i];
			ctx.beginPath();
			ctx.moveTo(property['x1'], property['y1']);
			ctx.lineTo(property['x2'], property['y2']);
			ctx.stroke();
		}
		ctx.restore();
	}

	/**
	 * 绘制坐标轴标签
	 */
	this.drawLabel = function(ctx){
		var obj = this;
		var width = obj.w;
		var height = obj.h;
		obj.prepareLables(width, height);
		ctx.save();
		ctx.font = Yan.DC.FONT;
		var i = 0, j = 0;
		for(i = 0; i < obj.lablesItr.length; i++){
			var l = obj.lablesItr[i];
			if (obj.lablesOverFlow[i]) {
				ctx.fillStyle = Yan.DC.LINE_DARK_GRAY_COLOR;
			} else {
				ctx.fillStyle = Yan.DC.LINE_DARK_COLOR;
			}
			ctx.textAlign = Yan.DC.TEXT_ALIGN[i];
			for(j = 0; j < l; j++){
				var property = obj.lables[i][j];
				ctx.fillText(property['text'], property['x'], property['y']);
			}
		}

		ctx.restore();
	}	

    /**
	 * 绘制所有缓存的图层
	 */
	this.paint = function(flag, reset){
		var obj = this;
		obj.canvasSet.paint(flag, reset);
	}
	
	/**
	 * 绑定焦点移动事件
	 */
    this._bindDragStart = function(){
        var obj = this;
        obj.canvasSet.getActionLayer().on('mousemove touchmove', function(e){
            obj._onDragStart(e);
        });
    }
    /**
	 * 解绑焦点移动事件
	 */
    this._unbindDragStart = function(){
    	var obj = this;
    	obj.canvasSet.getActionLayer().off('mousemove').off('touchmove');
    }
	/**
	 * 在画布获取焦点（点击或触摸）时，记录焦点状态的方法。
	 */
	this._recordMouse = function(e){
		var obj = this;
		obj.currentMousePosX = e.offsetX;
    	obj.currentMousePosY = e.offsetY;
        obj.lastX = obj.canvasSet.posX;
        obj.lastY = obj.canvasSet.posY;
	}
	
	/**
	 * 获取以当前手指位置x值为自变量的函数的值。
	 * 若有多个函数，则将返回一个数组。
	 */
	this._computFuncVal = function(e){
    	var obj = this;
    	var _x, _y;
    	if(e){
    		_x = e.offsetX; // 手指在屏幕上X坐标
    		_y = e.offsetY;	// 手指在屏幕上Y坐标
    	}else{
    		_x = obj.currentMousePosX;
    		_y = obj.currentMousePosY;
    	}    	
		
		// 计算适配参数等
		var incrPerPix = obj.grid.getIndrPerPix();
		var l = _x - obj.canvasSet.origin.cxl; // 获取当前点距离原点的像素值
		var x = l * incrPerPix; // 通过像素值计算函数自变量值
		var d = x; // 做弧度和角度的变换
		var y = new Array();
		// 计算x坐标下函数值
		for (i in Yan.ExpressionController.expression){
			var item = Yan.ExpressionController.expression[i];
			var expr = item.expr;
			Lyn.math.X = d;
			eval(expr);
			var _cy = Lyn.math.Y;	// _cy为函数因变量值
			var s = obj.canvasSet.origin.cyt - (_cy / incrPerPix);	// s为该点在画布上的坐标
			
			// x轴坐标，y轴坐标，屏幕x位置，屏幕y位置
			y.push([x, _cy, _x, s]);
		}
		// 通知描点
		return y;
    }

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
		if (event.targetTouches) {
			var touchLength = event.targetTouches.length;
		} else {
			var touchLength = 1;
		}
		if(Yan.DC.POINT_STATUS_LOCK)
			return;
		Yan.DC.POINT_STATUS = Yan.DC.POINT_DOWN;
		obj.canvasSet.onDragInit();

		if(2 == touchLength){
			obj.touchMode = Yan.DC.TOUCH_MODE_ZOOM;
			var multiPoint = obj.getMultiThouch();
			var touch0 = event.touches[0];
			var touch1 = event.touches[1];
			multiPoint.cxl = touch0.pageX;
			multiPoint.cyt = touch0.pageY;
			multiPoint.cxr = touch1.pageX;
			multiPoint.cyb = touch1.pageY;
			multiPoint.detail(obj.w, obj.h); // 缩放中心初始位置为两指中点
		} else if (1 == touchLength) {
			obj.touchMode = Yan.DC.TOUCH_MODE_DRAG;
			obj._recordMouse(e);
		}
		if(!obj.isBindEvent){
			obj.isBindEvent = true;
            obj._bindDragStart();
        }
    }

	/**
	 * document 的 mousemove事件代理函数
	 * 
	 * @param e
	 *            [Object] mousemove事件对象
	 */
    this._onDragStart = function(e){
        var obj = this;
		if (obj.touchMode == Yan.DC.TOUCH_MODE_NONE){
			return;
		}
		e.preventDefault();	// 禁止浏览器默认touch move事件，一般为页面拖拽
		if(Yan.DC.POINT_STATUS_LOCK)
			return;
		Yan.DC.POINT_STATUS = Yan.DC.POINT_MOVE;
		obj.canvasSet.onDragStart();
		
		
		if(obj.touchMode == Yan.DC.TOUCH_MODE_HOLD) {
			// 通知描点
			obj.canvasSet.ptVal = obj._computFuncVal(e);
		} else if(obj.touchMode == Yan.DC.TOUCH_MODE_DRAG) {
			var _x = e.offsetX; // 手指在屏幕上X坐标
			var _y = e.offsetY;	// 手指在屏幕上Y坐标
			
			var dx = _x - obj.currentMousePosX;
			var dy = _y - obj.currentMousePosY;
			var absDx = Math.abs(dx); var absDy = Math.abs(dy);
			if (absDx < 2 && absDy < 2) {
				return;
			}
			obj.changePosX(dx);
			obj.changePosY(dy);
// console.log('pos-info', obj.canvasSet.posX, obj.canvasSet.posY);
			obj.currentMousePosX = _x;
			obj.currentMousePosY = _y;

		} else if (obj.touchMode == Yan.DC.TOUCH_MODE_ZOOM) {
			obj._touchZoom(obj.getMultiThouch(), e);
		}

        return;
    }

    /**
	 * 画布mouseup事件代理方法
	 * 
	 * @param e
	 *            [Object] mouseup事件对象
	 */
    this._onDragEnd = function(e){
        var obj = this;
        if(Yan.DC.POINT_STATUS_LOCK)
			return;
        Yan.DC.POINT_STATUS = Yan.DC.POINT_LEAVE;
		obj._unbindDragStart();

		obj.isBindEvent = false;
		obj.touchMode = Yan.DC.TOUCH_MODE_NONE;
		obj.getMultiThouch().clearDetail();

		obj.fnTimeStamp = 0;
		obj.canvasSet.onDragEnd();
    }
    
    this._onTapHold = function(e){
    	var obj = this;
    	if(!obj.canvasSet.moving){
	    	obj.touchMode = Yan.DC.TOUCH_MODE_HOLD;
	    	obj.canvasSet.onTapHold();
	    	// TODO 震一下
	    	
	    	// 通知描点
			obj.canvasSet.ptVal = obj._computFuncVal();
	    }
    }

	/**
	 * 画布渲染线程。模拟用于渲染画布的后台线程。
	 */
	this._drawThread = function(timestamp){
		var obj = this;
		if(-1 == obj.startTime){
			obj.startTime = timestamp;
		}
		// 计算时间间隔
		obj.timeStampDiff = timestamp - obj.startTime;

		obj.startTime = timestamp;
		obj.paint(true);

		obj.requestId = window.requestAFrame(function(timestamp){
			obj._drawThread(timestamp)
		});
	}

	/**
	 * 完成触摸缩放效果的方法。
	 */
	this._touchZoom = function(multi, e){
		var obj = this;
		// 获取移动后手指坐标
		var newX0 = event.touches[0].pageX;
		var newY0 = event.touches[0].pageY;
		var newX1 = event.touches[1].pageX;
		var newY1 = event.touches[1].pageY;
		// 计算两指坐标距离
		var distence = Yan.distance(newX0, newY0, newX1, newY1); 
		if (Math.abs(distence - multi.distance) > 3) {
			obj._zoom((distence > multi.distance), 1, multi.roX, multi.roY);
			multi.distance = distence;
		}
	}

    /**
	 * 鼠标滚轮事件委托方法 delta每次为±120，这里设置个常量，每次鼠标滚轮都增加 (1 / Yan.DC.MOUSEWHEEL_TIMES) 的
	 * (Yan.DC.MAX_GRID_WIDTH - Yan.DC.MIN_GRID_WIDTH) 即
	 * Yan.DC.MOUSEWHEEL_INCREASE 的 Yan.DC.ZOOM_SPEED
	 * 
	 * @param e
	 *            [Object] 鼠标滚轮事件
	 */
    this._onMouseWheel = function(e){
        var obj = this;
		obj._recordMouse(e);
		// TODO 鼠标滚轮事件的跨浏览器兼容
		var delta = e.wheelDelta;
        obj._zoom((delta > 0), Yan.DC.MOUSEWHEEL_INCREASE, obj.currentMousePosX, obj.currentMousePosY);
    }

    /**
	 * 对画布进行缩放
	 * 
	 * @param flag
	 *            缩放方法。true为放大，false为缩小。
	 * @param n
	 *            要缩放多少个基本单位。
	 * @param x
	 *            缩放中心x坐标
	 * @param y
	 *            缩放中心y坐标
	 */
    this._zoom = function(flag, n, x, y){
    	var obj = this;
    	Yan.DC.POINT_STATUS = Yan.DC.POINT_MOVE;
    	obj.canvasSet.onZoom();
    	var scale = 1;
        // 缩放前缩放中心与原点相对距离
        var _x = obj.canvasSet.origin.cxl - x;
        var _y = obj.canvasSet.origin.cyt - y;

        if (obj.grid.zoom(flag, n)){
			scale = (n * Yan.DC.ZOOM_SPEED) / obj.grid.currentGridWidth;
		} else {
			scale = -(n * Yan.DC.ZOOM_SPEED) / obj.grid.currentGridWidth;
		}
        {// 缩放点不动，因而要计算新的原点位置
			obj.changePosX(_x * scale);
			obj.changePosY(_y * scale);
		}
    }

	/**
	 * 重设画布状态
	 */ 
	this.reset = function(flag){
		var obj = this;
		// console.log(flag);
		if(flag){
			// 恢复基本参数设置
			obj.x = Yan.DC.DEFAULT_X;
			obj.y = Yan.DC.DEFAULT_Y;
			obj.grid._default();
			obj.canvasSet.setPosX(obj.x);
			obj.canvasSet.setPosY(obj.y);
		}
		// 清空画布
		obj.clear();
		obj.paint(true, true);
	}
	/**
	 * 初始化函数
	 */
	this.init = function(){
		var obj = this;
		// 初始化各参数
		obj.grid = new Yan.DC.GRID();

		// 绑定各事件
		obj.canvasSet.getActionLayer().on('mousewheel', function(e){
			var mouseWheelEvent = window.event;
			obj._onMouseWheel(mouseWheelEvent);
		});

        obj.canvasSet.getActionLayer().on('mousedown touchstart', function(e){
            obj._onDragInit(e);
        });

        obj.canvasSet.getActionLayer().on('mouseup mouseout touchend touchcancel', function(e){
            obj._onDragEnd(e);
        });
        
        obj.canvasSet.getActionLayer().on('taphold', function(e){
        	obj._onTapHold(e);
        });
        
        // 注册后台线程回调函数
        obj.worker.addEventListener("message", function (oEvent) {
        	obj.canvasSet.onMessage(oEvent);
		}, false);
		
		obj.worker.addEventListener('error', function(e){
			console.log(e);
		});
        
        
        var prevPt = null;
        obj.canvasSet.paint = function (flag, reset) {
            var $this = this;
            Yan.DC.POINT_STATUS_LOCK = true;
            if(reset){
            	obj.fnTimeStamp = 0;
            	Yan.DC.POINT_STATUS = Yan.DC.POINT_STOP; 
            }
            $this.computOriginCoordinate();
            
            if (Yan.DC.POINT_DOWN == Yan.DC.POINT_STATUS) {
                $this.fnCanvasView.clearCanvas();
                $this.ptCanvasView.clearCanvas();
                var img = $this.fnCanvasView.getCache();
                $this.bgCanvasView.draw(function (ctx) {
                	// 计算缩放倍率
                    var incrPerPix = obj.grid.getIndrPerPix();
                    var scale = img.grid / incrPerPix;
                    // 计算位移
                    ctx.drawImage(img, $this.origin.cxl - img.cx * scale, $this.origin.cyt - img.cy * scale, obj.w * scale, obj.h * scale);
                });
                Yan.DC.POINT_STATUS = Yan.DC.POINT_NONE;
            } else if (Yan.DC.POINT_STOP == Yan.DC.POINT_STATUS) {
                // if timeout.
                if (obj.fnTimeStamp <= 0) {
                    obj.fnTimeStamp = Yan.DC.FN_TIMEOUT_TIMER;
                    $this.fnCanvasView.removeLayers();
                    // 请求计算点集（异步） 目前暂时不做分片
                    var incrPerPix = obj.grid.getIndrPerPix();
                    obj.workerId = (new Date()).getTime();
                    //console.log(Yan.ExpressionController);
                    var param = {
                        startPX: 0, // '分片起始点在画布上的X坐标',
                        endPX: obj.w, // '分片结束点在画布上的X坐标',
                        pXIncr: 1,
                        xIncr: incrPerPix, // '每增长 1 像素，坐标轴值增加的数字。',
                        minY: 0 - ((obj.h - obj.canvasSet.origin.cyb) * incrPerPix), // 'y轴最小值',
                        maxY: obj.canvasSet.origin.cyt * incrPerPix, // 'y轴最大值',
                        func: Yan.ExpressionController.expression,
                        origin: obj.canvasSet.origin,
                        timestamp: obj.workerId
                    };
                    obj.worker.postMessage(JSON.stringify(param));
                }
            } else if (Yan.DC.POINT_MOVE == Yan.DC.POINT_STATUS) {
            	obj.fnTimeStamp = Yan.DC.FN_TIMEOUT_TIMER; // on moving status, reset tht timer.
            	if (obj.touchMode == Yan.DC.TOUCH_MODE_HOLD && null != obj.canvasSet.ptVal) {
    				var val = $this.ptVal;
    				$this.ptVal = null;
    				
    				$this.ptCanvasView.draw(function(ctx){
    					ctx.save();
    					ctx.beginPath();
    					if(null != prevPt){
    						for(i in prevPt){
    							var item = prevPt[i];
    							ctx.clearRect(item[2] - 70, item[3] - 30, 140, 60);
    						}
    					}
    					
    					for(i in val){
    						// x轴坐标，y轴坐标，屏幕x位置，屏幕y位置
    						var item = val[i];
    						var x = item[0];
    						var y = item[1];
    						var _x = item[2];
    						var _y = item[3];
    						ctx.moveTo(_x, _y);
    						ctx.arc(_x, _y, 5, 0, 2 * Math.PI, true);
							
							ctx.save();
							ctx.fillStyle = Yan.DC.LINE_DARK_COLOR;
							ctx.font = Yan.DC.FONT;
							ctx.textAlign = Yan.DC.TEXT_ALIGN_MODEL['center'];
							ctx.fillText(x.toFixed(4)+','+y.toFixed(4), _x, _y - 10);
							ctx.restore();
    					}
    					ctx.fill();
    					ctx.restore();
    				});
    				prevPt = val;
    			} else {
    				$this.fnCanvasView.clearCanvas();
                    $this.bgCanvasView.draw(function (ctx) {
                        ctx.save();
                        ctx.clearRect(0, 0, obj.w, obj.h);
                        ctx.restore();

                        obj.drawGrid(ctx);	// 绘制网格
                        obj.drawLabel(ctx);	// 添加坐标

                        // 绘制函数图层的快照
                        var img = obj.canvasSet.fnCanvasView.getCache();
                        ctx.save();
                        // 计算缩放倍率
                        var incrPerPix = obj.grid.getIndrPerPix();
                        var scale = img.grid / incrPerPix;
                        // 计算位移
                        ctx.drawImage(img, $this.origin.cxl - img.cx * scale, $this.origin.cyt - img.cy * scale, obj.w * scale, obj.h * scale);
                        ctx.restore();
                    });
    			}
                Yan.DC.POINT_STATUS = Yan.DC.POINT_STOP; //
            } else if (Yan.DC.POINT_LEAVE == Yan.DC.POINT_STATUS) {
            	console.log('point leave');
                $this.ptCanvasView.clearCanvas();
                obj.fnTimeStamp = 0;
            	Yan.DC.POINT_STATUS = Yan.DC.POINT_STOP;
            }
            Yan.DC.POINT_STATUS_LOCK = false;
            // timing all the time.
            obj.fnTimeStamp -= obj.timeStampDiff + 10;
			if(obj.fnTimeStamp < -10){
				obj.fnTimeStamp = -10;
			}
        }
        
        obj.canvasSet.onMessage = function (oEvent) {
            var $this = this;

            if (Yan.DC.POINT_STOP != Yan.DC.POINT_STATUS) {
                return;
            }

            var data = oEvent.data;

            var param = data.param;
            var timestamp = param.timestamp;
            var origin = param.origin
            console.log(obj.workerId + ' - ' + timestamp);
            if (timestamp != obj.workerId) {
                console.log('timestamp error.');
                return;
            }
            console.log('timestamp match.');
            
            $this.fnCanvasView.removeLayers();
            var resultSet = data.result;
            for(key in resultSet){
            	var result = resultSet[key];
            	
            	var points = result.points;
                var length = result.length;
                var color = result.lineColor;
                (function(points, color, length, result){
                	// 遍历计算好的点集并重绘
                    $this.fnCanvasView.addLayer({
                        type: 'function',
                        name: result.name,
                        fn: function (ctx) {
                            ctx.save();
                            ctx.lineWidth = Yan.DC.LINE_WEIGHT * 1.5;
                            ctx.strokeStyle = color; 
                            var i = 0;
                            ctx.beginPath();
                            ctx.moveTo(points[i++], points[i++]);
                            while (i < length) {
                                ctx.lineTo(points[i++], points[i++]);
                            }
                            ctx.stroke();
                            ctx.restore();
                        }
                    });
                })(points, color, length, result);
            }
            
            $this.fnCanvasView.drawLayers();
            $this.fnCanvasView.cache(origin.cxl, origin.cyt, param.xIncr);

            $this.bgCanvasView.draw(function (ctx) {
                ctx.save();
                ctx.clearRect(0, 0, obj.w, obj.h);
                ctx.restore();

                obj.drawGrid(ctx);	// 绘制网格
                obj.drawLabel(ctx);	// 添加坐标
            });

            Yan.DC.POINT_STATUS = Yan.DC.POINT_NONE;
            
        }

        // 开启渲染线程
		obj.requestId = window.requestAFrame(function(timestamp){
			obj._drawThread(timestamp);
		});
    }

    this.init();
    
    
    this.onResizeListener = null;
	
    /**
	 * 画布resize事件的委托方法
	 */
	this.resize = function(param){
		var obj = this;
		obj.onResizeListener && obj.onResizeListener.call(obj, param);
	};
	
	this.addOnResizeListener = function(callback){
		var obj = this;
		obj.onResizeListener = callback;
	}

	/**
	 * 准备次要线条的方法。
	 */
	this.prepareMinorPts = function(width, height, interval) {
		var obj = this;
		var gridW = obj.grid.currentGridWidth + Yan.DC.LINE_WEIGHT;
		var lineCount = Math.ceil(((height / gridW)
			+ (width / gridW) + 2));
		if (null == obj.minorPts || obj.minorPts.length < lineCount) {
			obj.minorPts = new Array(lineCount);
			// console.log("new a Array");
		}
		obj.minorPtsItr = 0;

		// 横轴
		var j = 1;
		var iPos = obj.canvasSet.origin.cxr + 1;
		if (iPos < 0) {
			var l = 0 - iPos;
			var a = obj.grid.currentGridWidth + Yan.DC.LINE_WEIGHT;
			var n = Math.floor(l / a);
			var m = n % interval;
			j = m + 1;
			iPos += n * a;
		}
		while ((iPos += obj.grid.currentGridWidth) < width) {
			if (j == interval) {
				j = 1;
			} else {
				j++;
				var o = obj.minorPts[obj.minorPtsItr];
				if(null == o){
					o = {};
				}
				o.x1 = iPos; o.y1 = 0; o.x2 = iPos; o.y2 = height;
				obj.minorPts[obj.minorPtsItr] = o;
				obj.minorPtsItr++;
			}
			iPos += Yan.DC.LINE_WEIGHT;
		}

		j = 1;
		var dPos = obj.canvasSet.origin.cxl - 1;
		if (dPos > width) {
			var l = dPos - width;
			var a = obj.grid.currentGridWidth + Yan.DC.LINE_WEIGHT;
			var n = Math.floor(l / a);
			var m = n % interval;
			j = m + 1;
			dPos -= n * a;
		}
		while ((dPos -= obj.grid.currentGridWidth) > 0) {
			if (j == interval) {
				j = 1;
			} else {
				j++;
				var o = obj.minorPts[obj.minorPtsItr];
				if(null == o){
					o = {};
				}
				o.x1 = dPos; o.y1 = 0; o.x2 = dPos; o.y2 = height;
				obj.minorPts[obj.minorPtsItr] = o;
				obj.minorPtsItr++;
			}
			dPos -= Yan.DC.LINE_WEIGHT;
		}
		// 纵轴
		j = 1;
		iPos = obj.canvasSet.origin.cyb + 1;
		if (iPos < 0) {
			var l = 0 - iPos;
			var a = obj.grid.currentGridWidth + Yan.DC.LINE_WEIGHT;
			var n = Math.floor(l / a);
			var m = n % interval;
			j = m + 1;
			iPos += n * a;
		}
		while ((iPos += obj.grid.currentGridWidth) < height) {
			if (j == interval) {
				j = 1;
			} else {
				j++;
				var o = obj.minorPts[obj.minorPtsItr];
				if(null == o){
					o = {};
				}
				o.x1 = 0; o.y1 = iPos; o.x2 = width; o.y2 = iPos;
				obj.minorPts[obj.minorPtsItr] = o;
				obj.minorPtsItr++;
			}
			iPos += Yan.DC.LINE_WEIGHT;
		}
		j = 1;
		dPos = obj.canvasSet.origin.cyt - 1;
		if (dPos > height) {
			var l = dPos - height;
			var a = obj.grid.currentGridWidth + Yan.DC.LINE_WEIGHT;
			var n = Math.floor(l / a);
			var m = n % interval;
			j = m + 1;
			dPos -= n * a;
		}
		while ((dPos -= obj.grid.currentGridWidth) > 0) {
			if (j == interval) {
				j = 1;
			} else {
				j++;
				var o = obj.minorPts[obj.minorPtsItr];
				if(null == o){
					o = {};
				}
				o.x1 = 0; o.y1 = dPos; o.x2 = width; o.y2 = dPos;
				obj.minorPts[obj.minorPtsItr] = o;
				obj.minorPtsItr++;
			}
			dPos -= Yan.DC.LINE_WEIGHT;
		}
	}

	/**
	 * 准备主要线条数据的方法。
	 */
    this.preparePrimaPts = function(width, height, interval) {
		var obj = this;
		var pad = (obj.grid.currentGridWidth + Yan.DC.LINE_WEIGHT)
			* (interval - 1) + obj.grid.currentGridWidth;
		var lineCount = Math.ceil(((height / pad)
			+ (width / pad) + 2));
		if (null == obj.primaPts || obj.primaPts.length < lineCount) {
			obj.primaPts = new Array(lineCount);
		}
		obj.primaPtsItr = 0;
		var center = obj.canvasSet.origin;

		// 横轴
		obj._preparePrimaPtsX(center.cxr + 1, center.cxl - 1, pad, width, height);
		// 纵轴
		obj._preparePrimaPtsY(center.cyb + 1, center.cyt - 1, pad, width, height);

		// 坐标轴
		if(obj.axisPts == null)
			obj.axisPts = new Array(2);
		obj.axisPtsItr = 0;
		// y轴
		var o = obj.axisPts[obj.axisPtsItr];
		if(o == null){
			o = {};
		}
		o.x1 = obj.canvasSet.origin.cxl;
		o.y1 = 0;
		o.x2 = obj.canvasSet.origin.cxl;
		o.y2 = height;
		obj.axisPts[obj.axisPtsItr] = o;
		obj.axisPtsItr++;
		// x轴
		o = obj.axisPts[obj.axisPtsItr];
		if(o == null){
			o = {};
		}
		o.x1 = 0;
		o.y1 = obj.canvasSet.origin.cyt;
		o.x2 = width;
		o.y2 = obj.canvasSet.origin.cyt;
		obj.axisPts[obj.axisPtsItr] = o;
		obj.axisPtsItr++;
    }

    /**
	 * 准备横轴粗纹数据的方法
	 * 
	 * @param iStart
	 *            坐标值增加方向的起始坐标
	 * @param dStart
	 *            坐标值减少方向的起始坐标
	 * @param incr
	 *            坐标增加的单位
	 */
    this._preparePrimaPtsX = function(iStart, dStart, incr, width, height) {
		var obj = this;
		var iPos = iStart;
		if (iPos < 0) {
			var l = 0 - iPos;
			var a = incr + Yan.DC.LINE_WEIGHT;
			var n = Math.floor(l / a);
			iPos += n * a;
		}
		while ((iPos += incr) < width) {
			var o = obj.primaPts[obj.primaPtsItr];
			if(null == o){
				o = {};
			}
			o.x1 = iPos; o.y1 = 0; o.x2 = iPos; o.y2 = height;
			obj.primaPts[obj.primaPtsItr] = o;
			obj.primaPtsItr++;
			iPos += Yan.DC.LINE_WEIGHT;
		}

		var dPos = dStart;
		if (dPos > width) {
			var l = dPos - width;
			var a = incr + Yan.DC.LINE_WEIGHT;
			var n = Math.floor(l / a);
			dPos -= n * a;
		}
		while ((dPos -= incr) > 0) {
			var o = obj.primaPts[obj.primaPtsItr];
			if(null == o){
				o = {};
			}
			o.x1 = dPos; o.y1 = 0; o.x2 = dPos; o.y2 = height;
			obj.primaPts[obj.primaPtsItr] = o;
			obj.primaPtsItr++;
			dPos -= Yan.DC.LINE_WEIGHT;
		}
    }
    /**
	 * 准备纵轴粗纹数据的方法
	 * 
	 * @param iStart
	 *            坐标值增加方向的起始坐标
	 * @param dStart
	 *            坐标值减少方向的起始坐标
	 * @param incr
	 *            坐标增加的单位
	 */
    this._preparePrimaPtsY = function(iStart, dStart, incr, width, height) {
		var obj = this;
		var iPos = iStart;
		if (iPos < 0) {
			var l = 0 - iPos;
			var a = incr + Yan.DC.LINE_WEIGHT;
			var n = Math.floor(l / a);
			iPos += n * a;
		}
		while ((iPos += incr) < height) {
			var o = obj.primaPts[obj.primaPtsItr];
			if(null == o){
				o = {};
			}
			o.x1 = 0; o.y1 = iPos; o.x2 = width; o.y2 = iPos;
			obj.primaPts[obj.primaPtsItr] = o;
			obj.primaPtsItr++;
			iPos += Yan.DC.LINE_WEIGHT;
		}
		var dPos = dStart;
		if (dPos > height) {
			var l = dPos - height;
			var a = incr + Yan.DC.LINE_WEIGHT;
			var n = Math.floor(l / a);
			dPos -= n * a;
		}
		while ((dPos -= incr) > 0) {
			var o = obj.primaPts[obj.primaPtsItr];
			if(null == o){
				o = {};
			}
			o.x1 = 0; o.y1 = dPos; o.x2 = width; o.y2 = dPos;
			obj.primaPts[obj.primaPtsItr] = o;
			obj.primaPtsItr++;
			dPos -= Yan.DC.LINE_WEIGHT;
		}
    }

    /**
	 * 准备标签数据的方法
	 */
    this.prepareLables = function(width, height){
		var obj = this;
		var incr = obj.grid.computNumIncr();
		var center = obj.canvasSet.origin;
		var pad = (obj.grid.currentGridWidth + Yan.DC.LINE_WEIGHT)
			* (obj.grid.getInterval() - 1) + obj.grid.currentGridWidth;
		var lineCountX = Math.ceil(obj.w / pad +　1);
		var lineCountY = Math.ceil(obj.h / pad + 1);
		if ((null == obj.lables[0] || obj.lables[0].length < lineCountX)){
			obj.lables[0] = new Array(lineCountX);
		} 
		if (null == obj.lables[1] || obj.lables[1].length < lineCountY) {
			obj.lables[1] = new Array(lineCountY);
		}
		obj.lablesItr[0] = obj.lablesItr[1] = 0;

		var iX; var dX; var iY; var dY;
		var dx; var dy; 
		// x轴标签
		iX = center.cxr; dX = center.cxl; iY = center.cyb + 15; dY = center.cyb + 15;
		dx = pad; dy = 0;
		obj._prepareLable(incr, iX, dX, iY, dY, dx, dy, 0, width, height);
		// y轴标签
		iX = center.cxl - 10; dX = center.cxl - 10; iY = center.cyb; dY = center.cyt;
		dx = 0; dy = pad;
		obj._prepareLable(-incr, iX, dX, iY, dY, dx, dy, 1, width, height);

		var lableItem = obj.lables[1][obj.lablesItr[1]];
		if (null == lableItem) {
			lableItem = new Yan.LableData();
		}
		lableItem.text = "0";
		lableItem.x = center.cxl - 10;
		lableItem.y = center.cyb + 15 + obj.canvasSet.baseLine();
		obj.lables[1][obj.lablesItr[1]] = lableItem;
		obj.lablesItr[1] += 1;
    }

    /**
	 * 准备标签数据的方法
	 * 
	 * @param incr
	 *            坐标增加值
	 * @param iX
	 *            x轴正方向起始坐标
	 * @param dX
	 *            x轴负方向起始坐标
	 * @param iY
	 *            y轴正方向起始坐标
	 * @param dY
	 *            y轴负方向起始坐标
	 * @param dx
	 *            x轴变化量
	 * @param dy
	 *            y轴变化量
	 * @param pos
	 *            lables指针。
	 */
    this._prepareLable = function(incr, iX, dX, iY, dY, dx, dy, pos, width, height) {
		var obj = this;
		var num = 0;
		var lableItem;
		var n = obj.grid.getPic();

		iY += obj.canvasSet.baseLine();
		dY += obj.canvasSet.baseLine();
		Yan.DC.TEXT_ALIGN[0] = Yan.DC.TEXT_ALIGN_MODEL['center'];
		Yan.DC.TEXT_ALIGN[1] = Yan.DC.TEXT_ALIGN_MODEL['right'];

		// 制作 y 轴坐标标签， y 轴坐标标签的 x 轴坐标，均由 iX 指定。
		if (dx == 0) {
			if (iX < 5) {
				// 左半屏在屏幕外，标签显示在屏幕左边缘
				iX = 5;
				obj.lablesOverFlow[1] = true;
				Yan.DC.TEXT_ALIGN[1] = Yan.DC.TEXT_ALIGN_MODEL['left'];
			} else if (iX > width - 5) {
				// 右半屏在屏幕外，标签显示咋屏幕右边缘
				obj.lablesOverFlow[1] = true;
				iX = width - 5;
			} else {
				obj.lablesOverFlow[1] = false;
			}
			num = 0;
			if (iY < 0) {
				var l = 0 - iY;
				var a = (dy + Yan.DC.LINE_WEIGHT);
				var m = Math.floor(l / a);
				iY += m * a;
				num = m * incr;
			} 
			while (iY < height) {
				iY += dy;
				num += incr;
				lableItem = obj.lables[1][obj.lablesItr[1]];
				if (null == lableItem) {
					lableItem = new Yan.LableData();
				}
				lableItem.text = num.toFixed(n);
				lableItem.x = iX;
				lableItem.y = iY;
				obj.lables[1][obj.lablesItr[1]] = lableItem;
				obj.lablesItr[1] += 1;
				
				iY += ((dy > 0) ? Yan.DC.LINE_WEIGHT : 0);
			}
			num = 0;
			if (dY > height) {
				var l = dY - height;
				var a = (dy + Yan.DC.LINE_WEIGHT);
				var m = Math.floor(l / a);
				dY -= m * a;
				num = -(m * incr);
			}
			while (dY > 0) {
				dY -= dy;
				num -= incr;
				lableItem = obj.lables[1][obj.lablesItr[1]];
				if (null == lableItem) {
					lableItem = new Yan.LableData();
				}
				lableItem.text = num.toFixed(n);
				lableItem.x = iX;
				lableItem.y = dY;
				obj.lables[1][obj.lablesItr[1]] = lableItem;
				obj.lablesItr[1] += 1;
				dY -= ((dy > 0) ? Yan.DC.LINE_WEIGHT : 0);
			}
		}
		// 制作 x 轴坐标标签， x 轴坐标标签的 y 轴坐标，均由 iY 指定。
		if (dy == 0) {
			if (iY < 15) {
				// 上半屏在屏幕外，标签显示在屏幕上边缘
				iY = 15;
				obj.lablesOverFlow[0] = true;
			} else if (iY > height - 30) {
				// 下半屏在屏幕外，标签显示咋屏幕下边缘
				iY = height - 30;
				obj.lablesOverFlow[0] = true;
			} else {
				obj.lablesOverFlow[0] = false;
			}
			num = 0;
			if (iX < 0) {
				var l = 0 - iX;
				var a = (dx + Yan.DC.LINE_WEIGHT);
				var m = Math.floor(l / a);
				iX += m * a;
				num = m * incr;
			}
			while (iX < width) {
				iX += dx;
				num += incr;
				lableItem = obj.lables[0][obj.lablesItr[0]];
				if (null == lableItem) {
					lableItem = new Yan.LableData();
				}
				lableItem.text = num.toFixed(n);
				lableItem.x = iX;
				lableItem.y = iY;
				obj.lables[0][obj.lablesItr[0]] = lableItem;
				obj.lablesItr[0] += 1;
				iX += ((dx > 0) ? Yan.DC.LINE_WEIGHT : 0);
			}

			num = 0;
			if (dX > width) {
				var l = dX - width;
				var a = (dx + Yan.DC.LINE_WEIGHT);
				var m = Math.floor(l / a);
				dX -= m * a;
				num = -(m * incr);
			}
			while (dX > 0) {
				dX -= dx;
				num -= incr;
				lableItem = obj.lables[0][obj.lablesItr[0]];
				if (null == lableItem) {
					lableItem = new Yan.LableData();
				}
				lableItem.text = num.toFixed(n);
				lableItem.x = dX;
				lableItem.y = iY;
				obj.lables[0][obj.lablesItr[0]] = lableItem;
				obj.lablesItr[0] += 1;
				dX -= ((dx > 0) ? Yan.DC.LINE_WEIGHT : 0);
			}
		}
    }

}