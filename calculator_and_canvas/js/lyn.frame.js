(function($) {
	// set frame
	Lyn.Frame = {
		keyboard : function(panelID, keyboardID) {
			this.controller = {};
			this.area = {};
			this.keyboardPanel = null;
			this.keyboardStatus = false;
			this.keyboardAreaPoint = [];
			
			this.onKeyboardStatusChange = null;

			this.onEnterClick = null;
			this.addOnEnterClickListener = function (callback) {
			    var obj = this;
			    obj.onEnterClick = callback;
			}
			
			this.show = function() {
				var obj = this;
				obj.keyboardPanel.show();
				obj.keyboardStatus = true;
				obj.onKeyboardStatusChange && obj.onKeyboardStatusChange.call(obj);
			}

			this.hide = function() {
				var obj = this;
				obj.keyboardPanel.hide();
				obj.keyboardStatus = false;
				obj.onKeyboardStatusChange && obj.onKeyboardStatusChange.call(obj);
			}

			this.toggle = function() {
				var obj = this;
				if (obj.keyboardStatus) {
					obj.hide();
				} else {
					obj.show();
				}
			}
			
			this.onResizeListener = null;
			
			this.resize = function(param){
				var obj = this;
				obj.onResizeListener && obj.onResizeListener.call(obj, param);
			};
			
			this.addOnResizeListener = function(callback){
				var obj = this;
				obj.onResizeListener = callback;
			}
			
			
			
			this.mutiple = $('<span class="inputValue method">×</span>')
			
			this.createMutiple = function(){
				return this.mutiple.clone();
			}
			
			this.createSemanticTag = function(tag, text){
				var tag = document.createElement(tag);
				var $tag = $(tag);
				$tag.text(text);
				return $tag;
			}
			
			this.inputValue = $(document.createElement('span'));
			this.inputValue.addClass('inputValue');
			this.createInputValue = function(clazz){
				var clone = this.inputValue.clone();
				clone.addClass(clazz);
				return clone;
			}
			
			this.paramTag = $(document.createElement('param'));
			this.createParamTag = function(){
				return this.paramTag.clone();
			}
			
			this.bracket_l;
			this.bracket_r;
			{
				/*
				 * Lyn.dc.KEY_LEFT_PARE = 17; Lyn.dc.KEY_RIGHT_PARE = 18;
				 */
				var bracket_lData = Lyn.dc.INPUT[Lyn.dc.KEY_LEFT_PARE];
				this.bracket_l = this.createInputValue(bracket_lData['tag-clazz']);
				this.bracket_l.text(bracket_lData['value']);
				
				var bracket_rData = Lyn.dc.INPUT[Lyn.dc.KEY_RIGHT_PARE];
				this.bracket_r = this.createInputValue(bracket_rData['tag-clazz']);
				this.bracket_r.text(bracket_rData['value']);
			}
			
			
			this.bindInput = function(){
				var obj = this;
				for(areaName in obj.controller){
					var area = obj.controller[areaName];
					for(key in area){
						var button = area[key];
						button.on('vclick', {'key' : key}, function(e){
							var blink = $('.blink');
							var prev = blink.prev();
							var method = null;
							
							var key = e.data.key; // get the key
							var data = Lyn.dc.INPUT[key]; // get the button data.
							
							var tagClass = data['tag-clazz'];
							var inputValue = obj.createInputValue(tagClass); // create the inputValue span and add the class.
							var text = data['value']
							// switch type
							switch(data['func-type']){
							
								case Lyn.dc.NOTE_TYPE_VARIABLE:
								case Lyn.dc.NOTE_TYPE_LEFT_PARENTHESIS:
									if (prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_RIGHT_PARE]['tag-clazz']) ||
										prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_NUMBER_0]['tag-clazz']) || 
										prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_X]['tag-clazz']) ||
										prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_ASIN]['tag-clazz']) ||
										prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_LOG]['tag-clazz'])) {
										method = obj.createMutiple();
									}
								case Lyn.dc.NOTE_TYPE_NUMBER:
								case Lyn.dc.NOTE_TYPE_RIGHT_PARENTHESIS:
									inputValue.text(text);
									blink.after(inputValue);
									if(null != method){
										inputValue.before(method);
									}
									inputValue.after(blink);
									break;
								case Lyn.dc.NOTE_TYPE_ARITHMETIC:
									if (prev.hasClass('method')) {
										break;
									}
									inputValue.text(text);
									blink.after(inputValue);
									if(null != method){
										inputValue.before(method);
									}
									inputValue.after(blink);
									break;
								case Lyn.dc.NOTE_TYPE_BINOCULAR_FUNCTION:
									var param2 = obj.createParamTag();
								case Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION:
									if (prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_RIGHT_PARE]['tag-clazz']) ||
										prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_NUMBER_0]['tag-clazz']) || 
										prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_X]['tag-clazz']) ||
										prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_ASIN]['tag-clazz']) ||
										prev.hasClass(Lyn.dc.INPUT[Lyn.dc.KEY_LOG]['tag-clazz'])) {
										method = obj.createMutiple();
									}
									var param1 = obj.createParamTag();
									var semanticTag = obj.createSemanticTag(data['tag'], text);
									inputValue.append(semanticTag).append(obj.bracket_l.clone()).append(param1).append(obj.bracket_r.clone());
									if(param2){
										inputValue.append(obj.bracket_l.clone()).append(param2).append(obj.bracket_r.clone());
									}
									blink.after(inputValue);
									if(null != method){
										inputValue.before(method);
									}
									param1.append(blink);
									break;
								case Lyn.dc.NOTE_TYPE_FAC:
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
									var semanticTag = obj.createSemanticTag(data['tag'], text);
									var param1 = obj.createParamTag();
									param1.append(prev);
									inputValue.append(param1).append(semanticTag);
									blink.after(inputValue);
									inputValue.after(blink);
									break;
								case Lyn.dc.NOTE_TYPE_POW:
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
									var param1 = obj.createParamTag();
									param1.append(prev);
									var param2 = obj.createParamTag();
									inputValue.append(param1).append(param2);
									blink.after(inputValue);
									param2.append(blink);
									break;
							}
						});
					}
				}
				
				
				$('.arrow_l').on('vclick', function(e) {
					var blink = $('.blink');
					var param = blink.parent('param');
					var index = blink.index();
					
					var prev = null;
					
					prev = obj.findPrevInParam(param, index);
					if(null != prev){
						prev = obj.findLastEleInSpan(prev);
						// 找到直接前驱，直接将光标移到前驱前边
						prev.before(blink);
						return;
					}else {
						// 当找不到在param内的直接前驱时，需要进入blink标签的父标签所在的param层
						// 在这个param层里，寻找blink的父标签(成为当前param)的直接前驱(另一个param标签)
						var span = param.parent('span.inputValue'); // get current param-tag's parent. It is a span.inputValue.
						if(span.length == 0){
							// if parent is not exist, that means the blink-tag is in the most top lever
							// and there is any elements before it, than, do nothing.
							return;
						} else {
							// if parent is exist, find the prev param-tag of current param-gat;
							param = obj.findPrevParamInSpan(span, param.index());
							if(null == param){
								// if prev param is not exist, it means it must find the prev element in a higher lever.
								span.before(blink);
								return;
							} else {
								// prev param is exist, find the rightmost element of the param, move the blink before it or if this
								// param is empty, move the blink into it.
								var last = obj.findPrevInParam(param, -1);
								if(last.length > 0){
									last.before(blink); // TODO 这里可能有bug
 								} else {
									param.append(blink);
								}
								return;
							}
						}
					}
				});
				
				$('.arrow_r').on('vclick',	function(e) {
					var blink = $('.blink');
					var param = blink.parent('param');
					var index = blink.index();
					
					var next = null;
					next = obj.findNextInParam(param, index);
					if(null != next){
						// find the next element. move the blink after it.
						next = obj.findFirstEleInSpan(next);
						next.after(blink);
						return;
					} else {
						// 当找不到在param内的直接后继时，需要进入blink标签的父标签所在的param层
						// 在这个param层里，寻找blink的父标签(成为当前param)的直接前驱(另一个param标签)
						var span = param.parent('span.inputValue'); // get current param-tag's parent. It is a span.inputValue.
						if(span.length == 0){
							// if parent is not exist, that means the blink-tag is in the most top lever
							// and there is any elements after it, than, do nothing.
							return;
						}else {
							// if parent is exist, find the next param-tag of current param-gat;
							param = obj.findNextParamInSpan(span, param.index());
							if(null == param){
								// if next param is not exist, it means it must find the prev element in a higher lever.
								span.after(blink);
								return;
							} else {
								// next param is exist, find the leftmost element of the param, move the blink after it or if this
								// param is empty, move the blink into it.
								var last = obj.findNextInParam(param, -1);
								if(last.length > 0){
									last.after(blink); // TODO 这里可能有bug
 								} else {
									param.append(blink);
								}
								return;
							}
						}
					}
				});
				
				$('.arrow_t').on('vclick', function(e) {
					var blink = $('.blink');
					var span = blink.parents('span.inputValue').first();
					var param = span.children('param');
					
					if(param.length == 2) {
						param = param.eq(1);
					}
					var sub = obj.findNextInParam(param, -1);
					if(null != sub){
						sub.before(blink);
						return;
					} else {
						param.append(blink);
					}
				});
				
				$('.arrow_b').on('vclick', function(e) {
					var blink = $('.blink');
					var span = blink.parents('span.inputValue').first();
					var param = span.children('param').first();
					var sub = obj.findNextInParam(param, -1);
					if(null != sub){
						sub.before(blink);
						return;
					} else {
						param.append(blink);
					}
				});
				
				$('.enter').on('vclick', function () {
				    Lyn.user.transInput();
				    obj.onEnterClick && obj.onEnterClick.call(obj);
                });
				
				$('#delete').on('vclick', function() {
					var blink = $('.blink');
					var param = blink.parent('param');
					var index = blink.index();
					
					var prev = null;
					
					prev = obj.findPrevInParam(param, index);
					if(null != prev){
						prev = obj.findLastEleInSpan(prev);
						// 找到直接前驱，直接将光标移到前驱前边
						prev.before(blink);
						prev.remove();
						return;
					}else {
						// 当找不到在param内的直接前驱时，需要进入blink标签的父标签所在的param层
						// 在这个param层里，寻找blink的父标签(成为当前param)的直接前驱(另一个param标签)
						var span = param.parent('span.inputValue'); // get current param-tag's parent. It is a span.inputValue.
						if(span.length == 0){
							// if parent is not exist, that means the blink-tag is in the most top lever
							// and there is any elements before it, than, do nothing.
							return;
						} else {
							// if parent is exist, find the prev param-tag of current param-gat;
							param = obj.findPrevParamInSpan(span, param.index());
							if(null == param){
								// if prev param is not exist, it means it must find the prev element in a higher lever.
								span.before(blink);
								span.remove();
								return;
							} else {
								// prev param is exist, find the rightmost element of the param, move the blink before it or if this
								// param is empty, move the blink into it.
								var last = obj.findPrevInParam(param, -1);
								if(last.length > 0){
									last.before(blink); // TODO 这里可能有bug
									last.remove();
 								} else {
									param.append(blink);
								}
								return;
							}
						}
					}
				});
				
			}
			
			
			// 在param内找index为i元素的直接前驱(一定是span.inputValue)。如果找到则返回该元素，找不到返回null
			// if -1 == i , mean find the last span.inputValut element in the param.
			this.findPrevInParam = function(param, i){
				var obj = this;
				if(i == 0){
					return null;
				} else if(-1 == i){
					return param.children().last();
				}
				return param.children().eq(i - 1);
			}
			// find the i.th element in the param(it must be a span.inputValue).
			// if success, return this element, or return null.
			// if -1 == i, return the first element in the param.
			this.findNextInParam = function(param, i){
				var obj = this;
				var children = param.children();
				if(i >= children.length - 1){
					return null;
				} else if(-1 == i){
					return children.first();
				}
				return children.eq(i + 1);
			}
			
			
			// 寻找span.inputValue子树内最右下的节点(param或span)。找到即返回该节点，找不到返回hull
			this.findLastEleInSpan = function(root){
				var obj = this;
				var _span = root;
				var param = null;
				while(_span.length > 0){
					param = _span.children('param').last();
					if(param.length > 0){
						_span = param.children('span.inputValue').last();
					} else {
						// 当span内不含param时，即span是最右下元素，返回该span
						return _span;
					}		
				}
				// 当前一个while循环退出时，即表示最后一个拿到的param并没有span子节点。param为该树的最右下元素。
				return param;
			}
			
			// find the most lower left element(may be param or span) of the span.inputValue subtree
			// if success, return the element, or return null
			this.findFirstEleInSpan = function(root){
				var obj = this;
				var _span = root;
				var param = null;
				while(_span.length > 0){
					param = _span.children('param').first();
					if(param.length > 0){
						_span = param.children('span.inputValue').first();
					} else {
						// if no param-tag in the span-tag, return the span-tag.
						return _span;
					}
				}
				// when exit the loop, the last param has no span subtag.
				return param;
			}
			
			// 在span当中找到当前param的直接前驱(param)，参数root为要查找的span标签，i为当前param在span当中的index
			this.findPrevParamInSpan = function(root, i){
				var obj = this;
				if (0 == i){
					return null;
				}
				var prev = root.children().eq(i - 1);
				if(prev.is('param')){
					return prev;
				}
				return null;
			}
			// 
			this.findNextParamInSpan = function(root, i){
				var obj = this;
				var children = root.children();
				if(i == children.length - 1){
					return null;
				}
				var next = children.eq(i + 1);
				if(next.is('param')){
					return next;
				}
				return null;
			}
			
			
			this.init = function(){
				var obj = this;
				
				obj.keyboardPanel = Yan.getEle(panelID);
				obj.$keyboard = Yan.getEle(keyboardID);
				obj.$keyboard_plus = $('#keyboard_plus');
				
				var input = Lyn.dc.input;
				var triangle = Lyn.dc.triangle;
				var inputMore = Lyn.dc.inputMore;

				var contentContainer = $('<div></div>');
				contentContainer.addClass('value');
				var clear = $('<div></div>');
				clear.addClass('clear');
				for (id in Lyn.dc.SCREEN_AREA) {
					var keys = Lyn.dc.SCREEN_AREA[id];
					var area = $('<div></div>');
					area.addClass('button-area');
					area.attr('id', id);
					obj.controller[id] = {};
					for (k in keys) {
						var buttonKey = keys[k];
						var buttonInfo = Lyn.dc.INPUT[buttonKey];
						var button = $('<a></a>');
						button.addClass('controller').addClass(buttonInfo.class);
						button.data('lynkeyVal', buttonInfo.value);
						
						var con = contentContainer.clone();
						con.text(buttonInfo.value);
						button.append(con);
						
						area.append(button);
						obj.controller[id][buttonKey] = button;
					}
					area.append(clear.clone());
					obj.area[id] = area;
					obj.$keyboard.append(area);
					area.hide();
				}
				obj.$keyboard.append(clear.clone());
				obj.keyboardPanel.hide();
				
				var k = 0;
				for(index in Lyn.dc.SCREEN_DEFAULT_AREA){
					var name = Lyn.dc.SCREEN_DEFAULT_AREA[index];
					var area = obj.area[name];
					obj.keyboardAreaPoint[k++] = area;
					area.show();
				}
				
				var fArea = obj.area[Lyn.dc.SCREEN_AREA_NAME_FUNCTION];
				var eArea = obj.area[Lyn.dc.SCREEN_AREA_NAME_EXTEND];
				var ffArea = obj.area[Lyn.dc.SCREEN_FEATURE];
				
				var fMore = obj.controller[Lyn.dc.SCREEN_AREA_NAME_FUNCTION][Lyn.dc.KEY_MORE];
				fMore.addClass('btn_more not_bind');
				
				var eMore = obj.controller[Lyn.dc.SCREEN_AREA_NAME_EXTEND][Lyn.dc.KEY_MORE];
				eMore.addClass('btn_more not_bind ui-lyn-btn-press');
				
				var extraFunc = obj.controller[Lyn.dc.SCREEN_AREA_NAME_FEATURE][Lyn.dc.KEY_FUNCTION];
				extraFunc.data('yanExtraFuncVisible', false);
				
				fMore.on('vclick', function(e){
					fArea.hide();
					eArea.show();
					obj.keyboardAreaPoint[1] = eArea;
				});
				eMore.on('vclick', function(e){
					fArea.show();
					eArea.hide();
					obj.keyboardAreaPoint[1] = fArea;
				});
				
				extraFunc.on('vclick', function(e){
					var visible = extraFunc.data('yanExtraFuncVisible');
					if(visible){
						obj.keyboardAreaPoint[0].show();
						obj.keyboardAreaPoint[1].show();
						obj.area[Lyn.dc.SCREEN_AREA_NAME_EXTRA_FUNC].hide();
						extraFunc.removeClass('ui-lyn-btn-press');
						extraFunc.data('yanExtraFuncVisible', false);
					}else{
						obj.keyboardAreaPoint[0].hide();
						obj.keyboardAreaPoint[1].hide();
						obj.area[Lyn.dc.SCREEN_AREA_NAME_EXTRA_FUNC].show();
						extraFunc.addClass('ui-lyn-btn-press');
						extraFunc.data('yanExtraFuncVisible', true);
					}
				});
				
				obj.controller[Lyn.dc.SCREEN_AREA_NAME_FEATURE][Lyn.dc.KEY_BACKSPACE].attr('id', 'delete');
				
				this.bindInput();
			}
			
			this.init();
			return this;
		},
	}
})(jQuery);