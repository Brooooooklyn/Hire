// JavaScript Document

Yan.DC.GRID = function() {
    this.lableListItr = Yan.DC.DEFAULT_LABEL_LIST_TIR;	// 指示当前标签数字的指针
    this.currentGridWidth = -1;	// 当前格子的宽度
    this.numMut = 0;	// 当前数字倍数，以10为底。

    this._default = function(){
        var obj = this;
        obj.lableListItr = Yan.DC.DEFAULT_LABEL_LIST_TIR; 
        obj.currentGridWidth = Yan.DC.DEFAULT_GRID_WIDTH;
		obj.numMut = Yan.DC.LABEL_MUTIPLE;
		// TODO 将使用变量的地方均换成使用方法返回
        //obj.currentNumIncr = obj._getNumIncr();
    }

    /*
	 * 格子宽度的增减应该是一个过程，每次运行增减1。 如果要进行跳跃式设置，则应该进行增减操作之后获得最后参数再绘图
	 * 
	 * 初始化为默认标签和间距，每次增加和减小的单位 (1/Yan.DC.GRID_WIDTH_SPLIT)，
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
    this._getNumIncr = function(){
        var obj = this;
        var result = Yan.DC.LABEL_LIST[obj.lableListItr] * Math.pow(10, obj.numMut);
        if(obj.numMut < 0){
            var t = Math.abs(obj.numMut);
            result = result.toFixed(t);
        }
        return Number(result);
    }
	
	/**
     * comput number incremental
     * 
     * @return minber incremental.
     */
    this.computNumIncr = function() {
		var obj = this;
		var result = Yan.DC.LABEL_LIST[obj.lableListItr] * Math.pow(10, obj.numMut);
		return result;
    }
    
    /**
     * 获取当前每像素代表的x轴增量。
     */
    this.getIndrPerPix = function(){
    	var obj = this;
    	return (obj.computNumIncr() / ((obj.currentGridWidth + Yan.DC.LINE_WEIGHT) * obj.getInterval()));
    }

    /**
	 * 放大坐标的方法 鼠标滚轮向上，或者触屏手势的放大操作，即为放大坐标
     * 放大坐标具体表现为，格子宽度增加，坐标轴数字变小。
     * 每次增加(放大)时：
     *  1. 格子宽度增加一个单位， 
     *  2. 当格子宽度增加完成一个循环后，标签指针向前递增1， 
     *  3. 当标签指针递增完成一个循环，标签倍数缩小一个底数(10)。
	 */
    this._increase = function(){
        var obj = this;
        // 格子增加n个单位
        obj.currentGridWidth += Yan.DC.ZOOM_SPEED;
        if(obj.currentGridWidth > Yan.DC.MAX_GRID_WIDTH){
            obj.currentGridWidth -= (Yan.DC.MAX_GRID_WIDTH - Yan.DC.MIN_GRID_WIDTH);
            // 当递增完成一个循环后，标签指针向前递增1
            obj.lableListItr += 1;
            if(obj.lableListItr >= Yan.DC.LABEL_LIST.length){
                obj.lableListItr = 0;
                // 当标签指针递增完成一个循环，标签倍数缩小一个底数(10)。
                obj.numMut -= 1;
                if(obj.numMut < Yan.DC.MIN_MUTIPLE){
                    obj.numMut = Yan.DC.MIN_MUTIPLE;
                }
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
        // 格子减少一个单位
        obj.currentGridWidth -= Yan.DC.ZOOM_SPEED;
        if(obj.currentGridWidth < Yan.DC.MIN_GRID_WIDTH){
            obj.currentGridWidth += (Yan.DC.MAX_GRID_WIDTH - Yan.DC.MIN_GRID_WIDTH);
            // 当格子宽度减小完成一个循环后，标签指针向后递减1，
            obj.lableListItr -= 1;
            if(obj.lableListItr < 0){
                obj.lableListItr += Yan.DC.LABEL_LIST.length;
                // 当标签指针递减完成一个循环，标签倍数增大一个底数(10)。
                obj.numMut += 1;
                if(obj.numMut > Yan.DC.MAX_MUTIPLE){
                    obj.numMut = Yan.DC.MAX_MUTIPLE;
                }
            }
        }
    }
    
    /**
	 * 进行缩放
	 * 
	 * @param flag
	 *            缩放的方式。true为放大，坐标标签为减小。false为缩小，坐标标签变大。
	 * @param n
	 *            要缩放多少个单位
	 */
    this.zoom = function(flag, n){
		var obj = this;
		if ((flag && obj.numMut <= Yan.DC.MIN_MUTIPLE) || 
			(!flag && obj.numMut >= Yan.DC.MAX_MUTIPLE)
			){
			return;
		}
		var fn = null;
		if (flag){
			if (
		    		obj.numMut == Yan.DC.MIN_MUTIPLE && 
		    		obj.lableListItr == (Yan.DC.LABEL_LIST.length - 1) && 
		    		obj.currentGridWidth == Yan.DC.MAX_GRID_WIDTH
		    	){
		    	return;
		    }
			fn = obj._increase;
		} else {
			if (
		    		obj.numMut == Yan.DC.MAX_MUTIPLE && 
		    		obj.lableListItr == 0 && 
		    		obj.currentGridWidth == Yan.DC.MIN_GRID_WIDTH
		    	){
		    	return;
		    }
			fn = obj._decrease;
		}
		for(var i=0; i < n; i++){
			fn && fn.call(obj);
		}
		if(flag){
		    return true;
		}else{
		    return false;
		}
    }

	/**
     * Get interval
     * 
     * @return the interval.
     */
    this.getInterval = function() {
		return Yan.DC.PRIMARY_LINE_INTERVL[Yan.DC.LABEL_LIST[this.lableListItr]];
	}
	
	/**
     * 获取要保留的小数位数。
     * 
     * @return 要保留的小数位数
     */
    this.getPic = function() {
		if (this.numMut < 0) {
			return Math.abs(this.numMut);
		}
		return 0;
    }

    this.onGestureChange = function(e){
        var obj = this;
        var scale = e.scale;
        alert(scale);
    }

	this.init = function(){
		var obj = this;
        obj._default();
	}

	this.init();

};
