// JavaScript Document
var Yan = Yan || new Object();
Yan.IPanelController = function(id) {
	/**
	 * The panel container.
	 */
	this.container = Yan.getEle(id);
	/**
	 * Panels collection.
	 */
	this.iPanels = {};
	/**
	 * The panel's status，the true is showing，the false is hiding. default status is hiding. 
	 */
	this.status = false;
	/**
	 * The id of the panel current showing.
	 * It update only when call Yan.IPanelController.show()(also when function Yan.IPanelController.toggle() do the same).
	 */
	this.currentPanelID = null;
	
	/**
	 * This function will be call when panel visiable status change(hide or show).
	 */
	this.onPanelStatusChange = null;
	
	this.addOnPanelStatusChange = function(callback){
		var obj = this;
		obj.onPanelStatusChange = callback;
	}
	
	/**
	 * this function will been call when window resize.
	 * 
	 * @param e
	 *            The window resize Event object.
	 */
	this.onResizeListener = null;

	/**
	 * The window resize agency.
	 * @param e the Window resize Event.
	 */
	this.resize = function(e) {
		var obj = this;
		obj.onResizeListener && obj.onResizeListener.call(obj, e);
	};

	/**
	 * Add OnResizeListener
	 * 
	 * @param callback
	 *            The OnResizeListener.
	 */
	this.addOnResizeListener = function(callback) {
		var obj = this;
		obj.onResizeListener = callback;
	}
	

	/**
	 * Get a panel by it's id.
	 * 
	 * @param id
	 *            The panel dom id. if 'id' is an jQuery object and it
	 *            contain more than an element, the function will simply
	 *            return it.
	 * @returns an jQuery object. A element in obj.iPenels or just the original param.
	 */
	this.get = function(id) {
		var obj = this;
		var e = ('object' == typeof id) ? id : obj.iPanels[id];
		if (undefined != e && e.length > 0) {
			return e;
		}
		return null;
	}
	/**
	 * show 
	 */
	this.show = function(id) {
		var obj = this;
		var e = obj.get(id);
		if (null != e) {
			obj.currentPanelID = ('object' == typeof id) ? '#' + id.attr('id') : id;
			obj.container.show();
			jQuery.each(obj.iPanels, function(i, e) {
				obj.iPanels[i].hide();
			});
			e.show();
			obj.status = true;
		} else {
			obj.status = false;
		}
		obj.onPanelStatusChange && obj.onPanelStatusChange.call(obj);
		return obj.status;
	}

	this.hide = function(id, flag) {
		var obj = this;
		var e = obj.get(id);
		if (null != e) {
			e.hide();
			if (flag)
				obj.container.hide();
		} else if(null == id) {
			jQuery.each(obj.iPanels, function(i, e){
				obj.iPanels[i].hide();
			});
			obj.container.hide();
		}
		obj.status = false;
		obj.onPanelStatusChange && obj.onPanelStatusChange.call(obj);
		return obj.status;
	}

	this.toggle = function(id, flag) {
		var obj = this;
		if(null != id){
			var e = obj.get(id);
			if (null != e) {
				if (e.status) {
					obj.hide(e, flag);
				} else {
					obj.show(e);
				}
				obj.status = e.status;
				return obj.status;
			}
		} 
		
		jQuery.each(obj.iPanels, function(i, e){
			obj.iPanels[i].hide();
		});
		obj.container.hide();
		obj.status = false;
		obj.onPanelStatusChange && obj.onPanelStatusChange.call(obj);
		return obj.status;
	}

	this.init = function() {
		var obj = this;
		/*
		 * Add the panels to a collection. the collection using the panel dom id as key.
		 * And if the panel id is not exist, it will remove it from HTML doc.
		 */
		var iPanels = $("[data-role='i-panel']");
		iPanels.each(function(i, e) {
			if(e.id){
				var id = '#' + e.id;
				var iPanel = new Yan.IPanel(iPanels.eq(i), id, obj);
				obj.iPanels[id] = iPanel;
				iPanel.hide();
			}else{
				iPanels.eq(i).remove();
			}
		});
		
		obj.container.hide();
	}
	this.init();
	
	this.fixPanelHeight = function(height){
		var obj = this;
		var item = obj.get(obj.currentPanelID);
		if(item){
			item.fixHeight(height);
		}
	}
	
	this.getPanelHeight = function(){
		var obj = this;
		var item = obj.get(obj.currentPanelID);
		if(item){
			return item.height();
		}
		return 0;
	}
	
	this.getPanelContentHeight = function(){
		var obj = this;
		var item = obj.get(obj.currentPanelID);
		if(item){
			return item.content.height();
		}
		return 0;
	}
}

Yan.IPanel = function(e, id, controller) {
	this.ele = e;
	this.controller = controller;
	this.id = id;

	this.content = null;
	this.speEle = null;	// a special element wrap in.
	this.scroll = null;
	this.title = null;
	this.status = false; // panel's status，the true is showing，the false is hiding. default status is hiding.

	this.mouseY;
	this.currentScrollPosition = 0;
	this.enableScroll = false;
	
	this.fixHeight = function(panelHeight){
		var obj = this;
		if(!panelHeight){
			panelHeight = obj.ele.height()
		}
		var titleHeight = obj.title.outerHeight(true);
		var visiableHeight = panelHeight - titleHeight;
		
		obj.content && obj.content.height(panelHeight);
		obj.scroll && obj.scroll.height(visiableHeight);
	}

	this.init = function() {
		var obj = this;
		obj.content = obj.ele.children("[data-role='i-panel-content']").first();
		if (obj.content.length > 0) {
			obj.content.addClass('ui-yan-panel-content');
			var wrap = obj.content.data('yanWrap');
			switch (wrap) {
			case 'i-func-list':
				obj.speEle = new Yan.FuncList();
				obj.speEle.addDelItemListener(function(id){
					var $this = this;
					Yan.ExpressionController.delete(id);
				});
				break;
			case 'i-settings':
				obj.speEle = Yan.getEle('settings_panel');
				break;

			default:
				obj.speEle = null;
				break;
			}
			obj.title = obj.content.children("[data-role='i-panel-title']")
					.first();
			if (obj.title.length > 0) {
				obj.title.addClass('ui-yan-panel-title');
			} else {
				obj.title = null;
			}

			obj.scroll = obj.content.children(
					"[data-role='i-panel-scroll-panel']").first();
			if (obj.scroll.length > 0) {
				obj.scroll.addClass('ui-yan-panel-scroll-panel');
				obj.scroll.css({
					'top' : obj.currentScrollPosition
				});
			} else {
				obj.scroll = null;
			}
		} else {
			obj.content = null;
		}
		
		jQuery.each([ 'fadeIn', 'show', 'slideDown' ], function(i, name) {
			obj[name] = function(speed, easing, callback) {
				obj.status = true;
				obj.ele[name](speed, easing, callback);
				obj.fixHeight();
				return true;
			}
		});
		jQuery.each([ 'fadeOut', 'hide', 'slideUp' ], function(i, name) {
			obj[name] = function(speed, easing, callback) {
				obj.status = false;
				obj.ele[name](speed, easing, callback);
				return false;
			}
		});
	}
	this.init();

	for (i in this.ele) {
		this[i] = this[i] ? this[i] : this.ele[i];
	}

}