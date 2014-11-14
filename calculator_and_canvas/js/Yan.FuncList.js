// JavaScript Document
var Yan = Yan || new Object();
Yan.FuncList = function() {
	this.ele = Yan.getEle(Yan.DC.ID_FUNC_LIST);
	this.item = {}; // li element
	this.nextItemID = 0;
	this.add = null;
	
	this.template = null;

	this.createListItem = function(){
		var obj = this;
		if(null == obj.template){
			obj.template = $('<li data-role="i-func-item">\
					<span data-role="i-func-index">index</span>\
					<span data-role="i-func-color"></span> \
					<div data-role="i-func-body"> \
						<span style="display: inline-block; float: left;"> \
							<a data-role="button" data-inline="true" href="#" class="ui-yan-func-visiable">eye</a> \
						</span> \
						<param data-role="i-func-expr"></param> \
						<span data-role="i-func-del"> \
							<a data-role="button" data-inline="true" href="#" class="ui-yan-del-func">del</a> \
						</span> \
					</div> \
					<div class="clear"></div> \
				</li>');
		}
		return new Yan.FuncListItem(obj.template.clone());
	}
	this.height = function() {
		var obj = this;
		return obj.ele.outerHeight(true);
	}

	/**
	 * This function will be call when an item in obj.item been deleted(remove
	 * from list, delete from obj.item collection).
	 * The 'this' will be point to Yan.FuncList
	 * 
	 * @param id
	 *            The id of the item.
	 */
	this.onDelItemListener = null;
	this.addDelItemListener = function(callback){
		var obj = this;
		obj.onDelItemListener = callback;
	}
	
	this.delItem = function(id){
		var obj = this;
		var target = obj.item[id];
		if(target){
			target.remove();
			delete obj.item[id];
			obj.onDelItemListener && obj.onDelItemListener.call(obj, id);
			obj.resetIndex();
		}else{
			console.log('[id] is not in the obj.item');
		}
	}
	
	this.resetIndex = function(){
		var obj = this;
		var i = 1;
		for(key in obj.item){
			obj.item[key].setIndex(i++);
		}
		obj.add.setIndex(i);
	}
	
	this.addItem = function(){
		var obj = this;
		var newItem = obj.createListItem();
		if(null != newItem){
			obj.item[obj.nextItemID++] = newItem;
			(function(id){
				newItem.bindID(id);
				newItem.addOnChangeVisiableListener(function(e){
					var status = Yan.ExpressionController.changeVisiable(id);
					// true means visible
					if(status){
						newItem.visiable.removeClass('hide').addClass('visible');
					}else{
						newItem.visiable.removeClass('visible').addClass('hide');
					}
				});
				newItem.addOnDeleteListener(function(e){
					obj.delItem(id);
				});
			})(obj.nextItemID - 1);
			var color = Yan.DC.FUNC_COLOR[obj.nextItemID % Yan.DC.FUNC_COLOR.length];
			newItem.setFuncColor(color);
			obj.ele.append(newItem);
			newItem.refresh();
			obj.ele.listview( "refresh" );
			obj.resetIndex();
			
			Yan.ExpressionController.regist(obj.nextItemID - 1, color);
		}
	}
	
	this.init = function() {
		var obj = this;
		if (null != obj.ele) {
			obj.ele.addClass('ui-yan-func-list');
			var lis = obj.ele.children("li[data-role='i-func-item']");
			
			obj.createListItem();
			
			var n = 1;
			if (lis.length > 0) {
				lis.each(function(i, e) {
					var $this = lis.eq(i);
					var newItem = new Yan.FuncListItem($this);
					obj.item[i] = newItem;
					(function(id){
						newItem.bindID(id);
						newItem.addOnChangeVisiableListener(function(e){
							var status = Yan.ExpressionController.changeVisiable(id);
							// true means visible
							if(status){
								newItem.visiable.removeClass('hide').addClass('visible');
							}else{
								newItem.visiable.removeClass('visible').addClass('hide');
							}
						});
						newItem.addOnDeleteListener(function(e){
							obj.delItem(id);
						});
						var color = Yan.DC.FUNC_COLOR[id % Yan.DC.FUNC_COLOR.length];
						newItem.setFuncColor(color);
						Yan.ExpressionController.regist(id, color);
					})(i);
					obj.nextItemID = i + 1;
				});

				jQuery.each(obj.item, function(i) {
					var e = obj.item[i];
					e.setIndex(n);
					e.refresh();
					n++;
				});

			}

			obj.add = new Yan.FuncListItem(Yan.getEle(Yan.DC.ID_FUNC_ADD_NEW));
			obj.add.setIndex(n);
			obj.add.setFuncColor(Yan.DC.FUNC_COLOR[n % Yan.DC.FUNC_COLOR.length]);
			obj.add.refresh();
			obj.add.on('vclick', function(e) {
				e.stopPropagation();
				obj.addItem();
			});
		}
	}
	this.init();
}

Yan.FuncListItem = function(ele) {
	this.ele = ele;
	this.indexSpan = null;
	this.colorSpan = null;
	this.funcBody = null;
	this.exprSpan = null;
	this.delButton = null;

	this.visiable = null;
	this.del = null;

	this.setIndex = function(i) {
		var obj = this;
		obj.indexSpan.text(i);
	}
	this.setFuncColor = function(color) {
		var obj = this;
		obj.colorSpan.data('yanFuncColor', color);
		obj.colorSpan.css({
			'background-color' : color
		});
	}
	
	this.bindID = function(id){
		var obj = this;
		obj.exprSpan.data('yanFuncId', id);
	}
	
	this.getID = function(){
		var obj = this;
		return obj.exprSpan.data('yanFuncId');
	}
	

	this.height = function() {
		var obj = this;
		var itemHeight = obj.ele.outerHeight(true);
		return itemHeight;
	}
	
	this.refresh = function(){
		var obj = this;
		obj.ele.addClass('ui-yan-func-item');
		obj.indexSpan.addClass('ui-yan-func-index');
		obj.colorSpan.addClass('ui-yan-func-color');
		obj.funcBody.addClass('ui-yan-func-body');
		obj.exprSpan.addClass('ui-yan-func-expr textarea');
		obj.delButton.addClass('ui-yan-func-del');

		var h = obj.indexSpan.outerHeight(true);
		obj.indexSpan.css({
			'line-height' : h + 'px'
		});
		obj.colorSpan.css({
			'line-height' : h + 'px'
		});
		obj.funcBody.css({
			'height' : h + 'px',
			'line-height' : h + 'px'
		});
		
		obj.visiable.buttonMarkup('refresh');
		obj.del.buttonMarkup('refresh');
	}

	this.init = function() {
		var obj = this;
		if (null != obj.ele) {
			obj.indexSpan = obj.ele.children("span[data-role='i-func-index']");
			obj.colorSpan = obj.ele.children("span[data-role='i-func-color']");
			obj.funcBody = obj.ele.children("div[data-role='i-func-body']");
			obj.exprSpan = obj.funcBody.children("param[data-role='i-func-expr']");
			obj.delButton = obj.funcBody.children("span[data-role='i-func-del']");
			
			obj.visiable = $('.ui-yan-func-visiable', obj.funcBody);
			obj.visiable.on('vclick', function(e){
				var $this = this; // the 'this' point to the 'a' tag.
				obj.onChangeVisiableListener && obj.onChangeVisiableListener.call($this, e);
			});
			obj.del = $('.ui-yan-del-func', obj.funcBody);
			obj.del.on('vclick', function(e){
				var $this = this; // the 'this' point to the 'a' tag.
				// e['targetListItem'] = obj; // This line of code will lead to memory leaks
				obj.onDeleteListener && obj.onDeleteListener.call($this, e);
			});
			
			obj.exprSpan.on('vclick', function(e){
				e.stopPropagation();
				var inputValue = $(e.target);
				if(inputValue.length > 0 && inputValue.hasClass('inputValue')){
					//inputValue.after($('.blink'));
				} else {
					Yan.Frame.keyboard.show();
					$('.blink').remove();
					obj.exprSpan.append(Lyn.dc._blink);
				}
				return false;
			})
		}
	}
	this.init();
	
	this.onDeleteListener = null;
	this.addOnDeleteListener = function(callback){
		var obj = this;
		obj.onDeleteListener = callback;
	}
	
	this.onChangeVisiableListener = null;
	this.addOnChangeVisiableListener = function(callback){
		var obj = this;
		obj.onChangeVisiableListener = callback;
	}

	for (key in this.ele) {
		this[key] = this[key] ? this[key] : this.ele[key];
	}
}