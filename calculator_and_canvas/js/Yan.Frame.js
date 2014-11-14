// JavaScript Document
var Yan = Yan || new Object();
var $ = jQuery.noConflict();
Yan.Frame = function() {
	this.w = -1;
	this.h = -1;
	this.nav = null;
	this.page = null;

	this.canvasController = null;
	this.panelController = null;
	
	this.funcList = null;

	this.index = null;
	this.indexState = true; // true means show.
	this.btn_hide = null;
	this.btn_show = null;
	this.btn_home = null;

	this._setFrameSize = function(e) {
		var obj = this;
		e = e || {};
		var doc = $(document);
		var pageH = doc.height();
		var pageW = doc.width();
		e['documentWidth'] = pageW;
		e['documentHeight'] = pageH;
		e['headerHeight'] = obj.nav.header.outerHeight(true);
		e['footerHeight'] = obj.nav.footer.outerHeight(true);
		
		// 设置框架的大小和位置
		obj.page.height(pageH);
		
		obj.canvasController.resize(e);
		obj.panelController.resize(e);
		
		Yan.Frame.keyboard.resize(e);
	}

	this._home = function() {
		var obj = this;
		obj.canvasController.reset(true);
	}

	this.windowResize = function(e) {
		var obj = this;
		obj._setFrameSize(e);
	}

	this.orientationChange = function(e) {
		var obj = this;
		obj._setFrameSize(e);
	}

	this.init = function() {
		var obj = this;
		// TODO 检查环境支持，譬如 html worker

		// 获取DOM对象句柄
		obj.page = Yan.getEle(Yan.DC.ID_PAGE);
		// init the setting controller.
		Yan.Frame.SettingController = new Yan.SettingController();
		// inti the canvas controller.
		obj.canvasController = new Yan.CanvasController(Yan.DC.ID_CANVAS_BG, Yan.DC.ID_CANVAS_FN, Yan.DC.ID_CANVAS_PT);
		obj.canvasController.addOnResizeListener(function(e){
			var $this = this;
			$this.w = e.documentWidth;
			$this.h = e.documentHeight;
			var size = {'width' : $this.w, 'height' : $this.h};
			$this.canvasSet.setSize(size);
			$this.reset(false);
		});
		// init the canvas controller.
		obj.panelController = new Yan.IPanelController(Yan.DC.ID_CONTENT);
		obj.panelController.addOnResizeListener(function(e){
			var $this = this;
			$this.container.css({'top' : 0, 'bottom' : e.footerHeight});
		});
		obj.panelController.addOnPanelStatusChange(function(e){
			var $this = this;
			if($this.status){
				if(Yan.Frame.keyboard && Yan.Frame.keyboard.keyboardStatus){
					var h = obj.panelController.getPanelHeight();
					h = h - Yan.Frame.keyboard.keyboardPanel.height();
					obj.panelController.fixPanelHeight(h);
				}else{
					var h = obj.panelController.getPanelHeight();
					obj.panelController.fixPanelHeight(h);
				}
				obj.nav.hideHeader();
			}else{
				if(Yan.Frame.keyboard && Yan.Frame.keyboard.keyboardStatus){
					Yan.Frame.keyboard.hide();
				}
				if(obj.nav.status){
					obj.nav.showHeader();
				}
			}
		});
		
		obj.nav = new Yan.Navigation();

		var buttons = $("[data-role='i-button']");
		buttons.each(function(i, e) {
			var $this = buttons.eq(i);
			var icon = $this.data('yanIcon');
			if (true == icon) {
				$this.addClass('ui-yan-icon');
				var defaultPosition = $this.data('yanIconDefault');
				$this.css({
					'background-position-x' : defaultPosition.x,
					'background-position-y' : defaultPosition.y
				});
				$this.on('vmousedown', function(e) {
					$this.css({
						'opacity' : 0.5
					});
				});
				$this.on('vmouseup vmouseout vmousecancel', function(e) {
					$this.css({
						'opacity' : 1
					});
				});
			}

			$this.on('vclick', function(e) {
				e.stopPropagation();
				var action = $this.data('yanAction');
				switch (action) {
				case 'i-panel':
					var targetID = $this.attr('href');
					var r = obj.panelController.toggle(targetID, true);
					break;
				case 'i-home':
					obj._home();
					break;
				case 'i-full':
					obj.nav.toggle(!obj.panelController.status);
					break;
				case 'i-keybard':
					Yan.Frame.keyboard.toggle();
					break;
				default:
					$this.trigger('vclick');
				}

				if (!obj.nav.status) {
					obj.nav.hide();
				}
				return false;
			});
		});
		
		$('.ui-yan-hide-ipanel').on('vclick', function(e) {
			obj.panelController.hide(null, true);
			if(obj.nav.status)
				obj.nav.showHeader();
		});
		
		Yan.Frame.keyboard = new Lyn.Frame.keyboard(Yan.DC.ID_KEYBOARD_PANEL, Yan.DC.ID_KEYBOARD);
		Yan.Frame.keyboard.onKeyboardStatusChange = function(){
			var $this = this;
			if($this.keyboardStatus && obj.panelController.status){
				var h = obj.panelController.getPanelHeight();
				h = h - $this.keyboardPanel.height();
				obj.panelController.fixPanelHeight(h);
			}else{
				var h = obj.panelController.getPanelHeight();
				obj.panelController.fixPanelHeight(h);
			}
		}
		Yan.Frame.keyboard.addOnResizeListener(function(e){
			var $this = this;
			var areaH = e.documentHeight * 0.5;
			var areaW = parseInt(e.documentWidth / 3);
			
			$this.keyboardPanel.height(areaH);
			jQuery.each($this.area, function(i, e) {
				var item = $this.area[i];
				item.width(areaW);
			});
			$this.area[Lyn.dc.SCREEN_AREA_NAME_EXTRA_FUNC].width(areaW * 2);
			
			var buttonW = areaW / 3 - 4;
			var buttonH = areaH / 4 - 4;
			var lineHeight = buttonH + 'px';
			jQuery.each($this.controller, function(i, e) {
				var area = $this.controller[i];
				jQuery.each(area, function(i, e){
					var item = area[i];
					item.width(buttonW).height(buttonH);
					item.css({'line-height' : lineHeight});
				});
			});
			//$this.controller[Lyn.dc.SCREEN_AREA_NAME_FEATURE][Lyn.dc.KEY_ENTER].height(buttonH * 2);
			$this.keyboardPanel.css({
				'bottom' : e.footerHeight
			});
		});
		
		Yan.Frame.keyboard.addOnEnterClickListener(function () {
            obj.panelController.hide();
        });
		
//		Lyn.controller.listener.init();

		/* 计算动态布局参数 */
		obj._setFrameSize(event);
		obj.panelController.show('#func_list_panel');
		
		$('#about').on('vclick', function(){
			$('#about_content').html('<h1>Next Version?</h1>\
			<p>\
				The next <span id="hunt"></span> version coming soon...\
			</p>');
			setTimeout(function(){
				$('#hunt').text('"JJ BURST SKY"');
			}, 2000);
		});
	}

	this.init();
}

Yan.Frame.keyboard = null;
Yan.Frame.SettingController = null;

Yan.Navigation = function() {
	this.header = Yan.getEle(Yan.DC.ID_ACTION_BAR);
	this.footer = Yan.getEle(Yan.DC.ID_FOOTER);
	this.iButtons = {};

	this.status = true; // 标识导航栏当前状态，true为显示，false为隐藏。
	
	this.hideHeader = function(){
		var obj = this;
		obj.header.stop().animate({
			'top' : -obj.header.outerHeight(true)
		});
	}
	this.showHeader = function(){
		var obj = this;
		obj.header.stop().animate({
			'top' : 0
		});
	}
	
	/**
	 * 隐藏导航栏
	 */
	this.hide = function() {
		var obj = this;
		obj.hideHeader();
		obj.footer.stop().fadeTo('normal', 0.2);
		obj.status = false;
		var btn = obj.iButtons['#btn_full_screen'];
		var bgPosition = btn.data('yanIconAction');
		btn.css({
			'background-position-x' : bgPosition.x,
			'background-position-y' : bgPosition.y
		});
	}
	/**
	 * 显示导航栏
	 * @param flag 
	 *				set true to show header.
	 */
	this.show = function(flag) {
		var obj = this;
		if(flag)
			obj.showHeader();
		obj.footer.stop().fadeTo('normal', 1);
		obj.status = true;
		var btn = obj.iButtons['#btn_full_screen'];
		var bgPosition = btn.data('yanIconDefault');
		btn.css({
			'background-position-x' : bgPosition.x,
			'background-position-y' : bgPosition.y
		});
	}
	/**
	 * switch menu status.
	 * @param flag 
	 *				set true to show header.
	 */
	this.toggle = function(flag) {
		var obj = this;
		if (obj.status) {
			obj.hide();
		} else {
			obj.show(flag);
		}
	}

	/**
	 * 给导航栏管理的按钮添加click事件的监听器
	 * 
	 * @param id
	 *            要添加的按钮的id。注意要带上#符号
	 * @param listener
	 *            要添加的监听器。
	 */
	this.addVClickListener = function(id, listener) {
		var obj = this;
		var e = obj.iButtons[id];
		if (undefined != e) {
			e.on('vclick', listener);
		}
	}

	/**
	 * 初始化函数
	 */
	this.init = function() {
		var obj = this;

		var buttons = $("[data-role='i-button']",
				"[data-yan-contain='i-button']");
		buttons.each(function(i, e) {
			var $this = buttons.eq(i);
			obj.iButtons['#' + e.id] = $this;
			$this.addClass('i-btn');
		});

		if (obj.status) {
			obj.show();
		} else {
			obj.hide();
		}
	}

	this.init();
}
