// JavaScript Document
var Yan = Yan || new Object();
/**
 * Yan.DC 存储一些常量
 */
Yan.DC = Yan.DC || new Object();

/* 布局参数 */
Yan.DC.INDEX_RIGHT = 50;
Yan.DC.INDEX_ANIMATE_SPEED = 700;
Yan.DC.INDEX_DEFAULT_STATE = false;

Yan.DC.CANVAS_BG_COLOR = '#fff';	// Canvas Bg Color


Yan.DC.LINE_DARK_COLOR = '#444';		// 深色
Yan.DC.LINE_DARK_GRAY_COLOR = '#999';		// 深灰色
Yan.DC.LINE_GRAY_COLOR = '#e0e0e0';	// 灰色
Yan.DC.LINE_LIGHT_COLOR = '#eee';	// 浅色
Yan.DC.FONT_FAMILY = 'Calibri';
Yan.DC.FONT_SIZE = 12;
Yan.DC.FONT = Yan.DC.FONT_SIZE + 'px ' + Yan.DC.FONT_FAMILY; // 字体样式

Yan.DC.TEXT_ALIGN_MODEL = { 'left': 'left', 'center': 'center', 'right': 'right' };
Yan.DC.TEXT_ALIGN = [Yan.DC.TEXT_ALIGN_MODEL['center'], Yan.DC.TEXT_ALIGN_MODEL['right']];    // 对齐方式
Yan.DC.LINE_WEIGHT = 1;

Yan.DC.LABEL_LIST = [5, 2, 1];     // 标签数字
Yan.DC.DEFAULT_LABEL_LIST_TIR = 1;
Yan.DC.PRIMARY_LINE_INTERVL = { '1': 4, '2': 4, '5': 5 };   // 各标签数字的主线间隔，其中的数字为间隔的格子数
Yan.DC.DEFAULT_GRID_WIDTH = 30;	// 默认格子大小
Yan.DC.MIN_GRID_WIDTH = 30;	    // 格子的最小大小
Yan.DC.MAX_GRID_WIDTH = 60;	    // 格子的最大大小
Yan.DC.GRID_WIDTH_SPLIT = 15;	    // 将最小值和最大值差值切片的切片数，与缩放速度(zoom speed)成反比。缩放速度越快，切片越少。
Yan.DC.ZOOM_SPEED = Math.ceil((Yan.DC.MAX_GRID_WIDTH - Yan.DC.MIN_GRID_WIDTH) / Yan.DC.GRID_WIDTH_SPLIT);   // 每切片多少像素，即缩放速度。
Yan.DC.MOUSEWHEEL_TIMES = 5;   // 其中5的常数为鼠标滚轮滚动几次会使标签数字改变
Yan.DC.MOUSEWHEEL_INCREASE = parseInt((Yan.DC.MAX_GRID_WIDTH - Yan.DC.MIN_GRID_WIDTH) / Yan.DC.MOUSEWHEEL_TIMES / Yan.DC.ZOOM_SPEED);  // 每次鼠标滚轮调用increase次数，

Yan.DC.LABEL_MUTIPLE = 0;  // 标签倍数，即显示是是原来的 Math.pow(10, LABEL_MUTIPLE) 倍.
Yan.DC.MIN_MUTIPLE = -6;     // 标签最小倍数，为 10^-6
Yan.DC.MAX_MUTIPLE = 6;      // 标签最大倍数，为 10^6

Yan.DC.THIN_LINE_WEIGHT = Yan.DC.LINE_HEIGHT;	// 细线线宽
Yan.DC.WIDE_LINE_WEIGHT = Yan.DC.THIN_LINE_WEIGHT * 2;	// 粗线线宽

Yan.DC.DEFAULT_X = 0;	// 默认X轴偏移，如果为0则为画布正中间
Yan.DC.DEFAULT_Y = 0;	// 默认Y周偏移，如果为0则为画布正中间

Yan.DC.TOUCH_MODE_NONE = 0;	// 表示什么都没做的模式
Yan.DC.TOUCH_MODE_DRAG = 1; // 表示拖拽行为的模式
Yan.DC.TOUCH_MODE_ZOOM = 2;	// 表示缩放行为的模式
Yan.DC.TOUCH_MODE_HOLD = 3; // 长按模式
Yan.DC.DRAG_DAMP = 1;
Yan.DC.SPEED_DAMPING_RATIO = 0.5;
Yan.DC.DRAG_TIME_STAMP = 10;
Yan.DC.FN_TIMEOUT_TIMER = 700;	// 函数图层重绘超时计时。

Yan.DC.POINT_NONE = 0;
Yan.DC.POINT_DOWN = 1;
Yan.DC.POINT_MOVE = 2;
Yan.DC.POINT_STOP = 3;
Yan.DC.POINT_LEAVE = 4;
Yan.DC.POINT_TAPHOLD = 5;
Yan.DC.POINT_STATUS = Yan.DC.POINT_NONE;
Yan.DC.POINT_STATUS_LOCK = false; // true is locki

Yan.DC.FUNC_COLOR = ['#168447', '#d20100', '#c443b8', '#ffb807', '#1184d4', '#999999', '#eb777d', '#0fbe95', '#3bc41a', '#a8d91a', '#8d511e',
 '#7e51d9', '#5685e2', '#d5248a', '#e9801a', '#74d2e2', '#c443b8'];

Yan.DC.ID_SETTINGS = ['#yan_line_weight', '#yan_min_grid_size', '#yan_max_grid_size', '#yan_def_grid_size', '#yan_lable_text_size', '#yan_zoom_speed'];

Yan.DC.ID_ACTION_BAR = 'app_bar';
Yan.DC.ID_FOOTER = 'footer';
Yan.DC.ID_PAGE = 'canvas_set';
Yan.DC.ID_INDEX = 'index';
Yan.DC.ID_CONTENT = 'content';
Yan.DC.ID_FUNC_LIST = 'func_list';
Yan.DC.ID_FUNC_ADD_NEW = 'func_add_new';
Yan.DC.ID_KEYBOARD_PANEL = 'keyboard_panel';
Yan.DC.ID_KEYBOARD = 'keyboard';

Yan.DC.ID_CANVAS_BG = 'canvas_bg';	// 背景图层canvas
Yan.DC.ID_CANVAS_FN = 'canvas_fn';	// 函数图层canvas
Yan.DC.ID_CANVAS_PT = 'canvas_pt';	// 点图层canvas
Yan.DC.ID_BTN_HIDE = 'btn_hide';
Yan.DC.ID_BTN_SHOW = 'btn_show';
Yan.DC.ID_BTN_HOME = 'btn_home';

Yan.DC.STORAGE_KEY = 'YAN_FUNC_PAINT_SETTINGS';
