// JavaScript Document
var Yan = Yan || new Object();
Yan.SettingController = function(){
	this.data = null;
	this.collection = {};
	this.settingMap = {
		'#yan_max_grid_size' : 'MAX_GRID_WIDTH',
		'#yan_min_grid_size' : 'MIN_GRID_WIDTH',
		'#yan_def_grid_size' : 'DEFAULT_GRID_WIDTH',
		'#yan_line_weight' : 'LINE_WEIGHT',
		'#yan_lable_text_size' : 'FONT_SIZE',
		'#yan_zoom_speed' : 'ZOOM_SPEED',
	};
	
	this.setSliderRange = function(id, max, min, val){
		var obj = this;
		var e = obj.collection[id];
		if(e){
			var _max = e.attr('max');
			var _min = e.attr('min');
			var _val = e.attr('value');
			max = null === max ? _max : max;
			min = null === min ? _min : min;
			val = null === val ? _val : val;
			e.attr({'max' : max, 'min' : min, 'value' : val});
			e.slider('refresh');
		}
	}
	
	this.saveSettings = function(){
		var obj = this;
	}
	
	this.updateSettings = function(){
		var obj = this;
		obj.bindSettingDate();
		
		for(key in obj.settingMap){
			var map = obj.settingMap[key];
			Yan.DC[map] = obj.data[key].value;
		}
		Yan.DC.FONT = Yan.DC.FONT_SIZE + 'px ' + Yan.DC.FONT_FAMILY;
		obj.saveSettings();
	}

	this.bindSettingDate = function(){
		var obj = this;
		obj.data['#yan_def_grid_size'].max = obj.data['#yan_max_grid_size'].value;
		obj.data['#yan_def_grid_size'].min = obj.data['#yan_min_grid_size'].value;
		
		if(obj.data['#yan_def_grid_size'].value > obj.data['#yan_def_grid_size'].max){
			obj.data['#yan_def_grid_size'].value == obj.data['#yan_def_grid_size'].max
		}
		if(obj.data['#yan_def_grid_size'].value < obj.data['#yan_def_grid_size'].min){
			obj.data['#yan_def_grid_size'].value == obj.data['#yan_def_grid_size'].min
		}
		
		for(i in obj.data){
			var item = obj.data[i];
			var view = obj.collection[i];
			if(view){
				for(j in item){
					view.attr(j, item[j]);
				}
				view.slider('refresh');
			}
		}
	}	

	this.init = function(){
		var obj = this;
		
		// add the setting dom into the collection.
		jQuery.each(Yan.DC.ID_SETTINGS, function(i, e){
			var id = Yan.DC.ID_SETTINGS[i];
			var ele = $(id);
			if(ele.length > 0){
				obj.collection[id] = ele;
			}
		});
		
		
		// read settings
		// settings would be a JSON string.
		var str = '{\
			"#yan_max_grid_size" : { \
				"max" : 160,\
				"min" : 80,\
				"value" : 80 \
			},\
			"#yan_min_grid_size" :{\
				"max" : 40,\
				"min" : 20,\
				"value" : 40 \
			},\
			"#yan_def_grid_size" :{\
				"value" : 40 \
			},\
			"#yan_line_weight" : {\
				"max" : 8,\
				"min" : 1,\
				"value" : 1\
			},\
			"#yan_lable_text_size" : {\
				"max" : 48,\
				"min" : 12,\
				"value" : 20,\
				"step" : 4\
			},\
			"#yan_zoom_speed" : {\
				"max" : 6,\
				"min" : 1,\
				"value" : 2\
			}\
		}';
		
		obj.data = JSON.parse(str);
		
		// init settings		
		for(i in obj.collection){
			var view = obj.collection[i];
			view.on('slidestop', {'id' : i}, function(e){
				var value = parseInt(e.currentTarget.value);
				var id = e.data.id;
				obj.data[id].value = value;
				obj.updateSettings();
				// repaint.
				$(window).resize();
			});
		}
		obj.updateSettings();
	}
	this.init();
}