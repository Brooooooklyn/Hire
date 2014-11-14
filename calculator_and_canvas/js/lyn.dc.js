var Lyn = Lyn || new Object(); 
Lyn.dc = {};
Lyn.get = {};
Lyn.dc.input = [ '1', '2', '3', '√', '+', '÷', 'Function', 'X', '', '4', '5',
		'6', '^', '-', '×', 'e', 'Y', '', '7', '8', '9', '(&nbsp', ')&nbsp',
		'=', '', '↑', 'Enter', '0', '.', "π", '＜', '＞', 'More', '←', '↓', '→' ];
Lyn.dc.KEY_EMPTY = 0;
Lyn.dc.KEY_ENTER2 = 1;
Lyn.dc.KEY_BACKSPACE = 8;
Lyn.dc.KEY_SQRT = 9;
Lyn.dc.KEY_FUNCTION = 10;
Lyn.dc.KEY_X = 11;
Lyn.dc.KEY_Y = 12;
Lyn.dc.KEY_ENTER = 13;
Lyn.dc.KEY_POWER = 14;
Lyn.dc.KEY_EULER = 15;
Lyn.dc.KEY_LEFT_PARE = 17;
Lyn.dc.KEY_RIGHT_PARE = 18;
Lyn.dc.KEY_PI = 19;
Lyn.dc.KEY_MORE = 20;
Lyn.dc.KEY_LEFT = 37;
Lyn.dc.KEY_TOP = 38;
Lyn.dc.KEY_RIGHT = 39;
Lyn.dc.KEY_BOTTOM = 40;
Lyn.dc.KEY_NUMBER_0 = 48;
Lyn.dc.KEY_NUMBER_1 = 49;
Lyn.dc.KEY_NUMBER_2 = 50;
Lyn.dc.KEY_NUMBER_3 = 51;
Lyn.dc.KEY_NUMBER_4 = 52;
Lyn.dc.KEY_NUMBER_5 = 53;
Lyn.dc.KEY_NUMBER_6 = 54;
Lyn.dc.KEY_NUMBER_7 = 55;
Lyn.dc.KEY_NUMBER_8 = 56;
Lyn.dc.KEY_NUMBER_9 = 57;
Lyn.dc.KEY_MULTIPL = 106;
Lyn.dc.KEY_PLUS = 107;
Lyn.dc.KEY_MINUS = 109;
Lyn.dc.KEY_POINT = 110;
Lyn.dc.KEY_DIVISION = 111;
Lyn.dc.KEY_EQUAL = 187;
Lyn.dc.KEY_LESS = 188;
Lyn.dc.KEY_LARGE = 189;
Lyn.dc.KEY_SIN = 190;
Lyn.dc.KEY_ASIN = 191;
Lyn.dc.KEY_SINH = 192;
Lyn.dc.KEY_ASINH = 193;
Lyn.dc.KEY_COS = 194;
Lyn.dc.KEY_ACOS = 195;
Lyn.dc.KEY_COSH = 196;
Lyn.dc.KEY_ACOSH = 197;
Lyn.dc.KEY_TAN = 198;
Lyn.dc.KEY_ATAN = 199;
Lyn.dc.KEY_TANH = 200;
Lyn.dc.KEY_ATANH = 201;
Lyn.dc.KEY_COT = 202;
Lyn.dc.KEY_ACOT = 203;
Lyn.dc.KEY_COTH = 204;
Lyn.dc.KEY_ACOTH = 205;
Lyn.dc.KEY_CSC = 206;
Lyn.dc.KEY_ACSC = 207;
Lyn.dc.KEY_CSCH = 208;
Lyn.dc.KEY_ACSCH = 209;
Lyn.dc.KEY_SEC = 210;
Lyn.dc.KEY_ASEC = 211;
Lyn.dc.KEY_SECH = 212;
Lyn.dc.KEY_ASECH = 213;
Lyn.dc.KEY_LOG = 214;
Lyn.dc.KEY_LN = 215;
Lyn.dc.KEY_EXP = 216;
Lyn.dc.KEY_CEIL = 217;
Lyn.dc.KEY_FACTORIAL = 218;
Lyn.dc.KEY_ABS = 219;
Lyn.dc.KEY_LEFT_BRACES = 220;
Lyn.dc.KEY_RIGHT_BRACES = 221;
Lyn.dc.KEY_LE_OR_EQ = 222;
Lyn.dc.KEY_LG_OR_EQ = 223;

Lyn.dc.NOTE_TYPE_NUMBER = 1000;
Lyn.dc.NOTE_TYPE_ARITHMETIC = 1001;
Lyn.dc.NOTE_TYPE_VARIABLE = 1010;
Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION = 1011;
Lyn.dc.NOTE_TYPE_BINOCULAR_FUNCTION = 1100;
Lyn.dc.NOTE_TYPE_LEFT_PARENTHESIS = 1101;
Lyn.dc.NOTE_TYPE_RIGHT_PARENTHESIS = 1110;
Lyn.dc.NOTE_TYPE_POW = 0x0101;
Lyn.dc.NOTE_TYPE_FAC = 0x1010;
Lyn.dc.NOTE_TYPE_EQUAL = 1111;

Lyn.dc.INPUT = {
	'0' : {
		'value' : ' ',
		'class' : ' ',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'1' : {
		'value' : 'Enter',
		'class' : 'enter',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'8' : {
		'value' : '←',
		'class' : '',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'9' : {
		'value' : '√',
		'tag' : 'sqrt',
		'class' : 'method_radical',
		'param-count' : '1',
		'tag-clazz' : 'radical_area',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'10' : {
		'value' : 'Fn',
		'class' : '',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'11' : {
		'value' : 'X',
		'class' : 'variable_btn',
		'param-count' : '0',
		'tag-clazz' : 'variable',
		'func-type' : Lyn.dc.NOTE_TYPE_VARIABLE
	},
	'12' : {
		'value' : 'Y',
		'class' : 'variable_btn',
		'param-count' : '0',
		'tag-clazz' : 'variable',
		'func-type' : ''
	},
	'13' : {
		'value' : ' ',
		'class' : 'enter',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'14' : {
		'value' : '^',
		'tag' : 'pow',
		'class' : 'method_pow',
		'param-count' : '2',
		'tag-clazz' : 'pow_area',
		'func-type' : Lyn.dc.NOTE_TYPE_POW
	},
	'15' : {
		'value' : 'e',
		'class' : '',
		'param-count' : '0',
		'tag-clazz' : 'value_num value_euler',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'17' : {
		'value' : '(',
		'class' : 'btn_bracket',
		'param-count' : '0',
		'tag-clazz' : 'bracket',
		'func-type' : Lyn.dc.NOTE_TYPE_LEFT_PARENTHESIS
	},
	'18' : {
		'value' : ')',
		'class' : 'btn_bracket_',
		'param-count' : '0',
		'tag-clazz' : 'bracket_',
		'func-type' : Lyn.dc.NOTE_TYPE_RIGHT_PARENTHESIS
	},
	'19' : {
		'value' : 'π',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'20' : {
		'value' : 'More',
		'class' : '',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'37' : {
		'value' : '←',
		'class' : 'arrow_l',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'38' : {
		'value' : '↑',
		'class' : 'arrow_t',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'39' : {
		'value' : '→',
		'class' : 'arrow_r',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'40' : {
		'value' : '↓',
		'class' : 'arrow_b',
		'param-count' : '0',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'48' : {
		'value' : '0',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'49' : {
		'value' : '1',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'50' : {
		'value' : '2',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'51' : {
		'value' : '3',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'52' : {
		'value' : '4',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'53' : {
		'value' : '5',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'54' : {
		'value' : '6',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'55' : {
		'value' : '7',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'56' : {
		'value' : '8',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'57' : {
		'value' : '9',
		'class' : 'num_btn',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'106' : {
		'value' : '×',
		'class' : 'method_btn',
		'param-count' : '2',
		'tag-clazz' : 'method',
		'func-type' : Lyn.dc.NOTE_TYPE_ARITHMETIC
	},
	'107' : {
		'value' : '+',
		'class' : 'method_btn',
		'param-count' : '2',
		'tag-clazz' : 'method',
		'func-type' : Lyn.dc.NOTE_TYPE_ARITHMETIC
	},
	'109' : {
		'value' : '-',
		'class' : 'method_btn',
		'param-count' : '2',
		'tag-clazz' : 'method',
		'func-type' : Lyn.dc.NOTE_TYPE_ARITHMETIC
	},
	'110' : {
		'value' : '.',
		'class' : 'point',
		'param-count' : '0',
		'tag-clazz' : 'value_num',
		'func-type' : Lyn.dc.NOTE_TYPE_NUMBER
	},
	'111' : {
		'value' : '÷',
		'class' : 'method_divide',
		'param-count' : '2',
		'tag-clazz' : 'method',
		'func-type' : Lyn.dc.NOTE_TYPE_ARITHMETIC
	},
	'187' : {
		'value' : '=',
		'class' : 'equal_btn',
		'param-count' : '',
		'tag-clazz' : 'method_equal',
		'func-type' : Lyn.dc.NOTE_TYPE_EQUAL
	},
	'188' : {
		'value' : '＜',
		'class' : 'other_btn',
		'param-count' : '2',
		'tag-clazz' : 'method_other',
		'func-type' : ''
	},
	'189' : {
		'value' : '＞',
		'class' : 'other_btn',
		'param-count' : '2',
		'tag-clazz' : 'method_other',
		'func-type' : ''
	},
	'190' : {
		'value' : 'sin',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION,
		'tag' : 'sin'
	},
	'191' : {
		'value' : 'asin',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION,
		'tag' : 'asin'
	},
	'192' : {
		'tag' : 'sinh',
		'value' : 'sinh',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'193' : {
		'tag' : 'asinh',
		'value' : 'asinh',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'194' : {
		'tag' : 'cos',
		'value' : 'cos',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'195' : {
		'tag' : 'acos',
		'value' : 'acos',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'196' : {
		'tag' : 'cosh',
		'value' : 'cosh',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'197' : {
		'tag' : 'acosh',
		'value' : 'acosh',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'198' : {
		'tag' : 'tan',
		'value' : 'tan',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'199' : {
		'tag' : 'atan',
		'value' : 'atan',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'200' : {
		'tag' : 'tanh',
		'value' : 'tanh',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'201' : {
		'tag' : 'atanh',
		'value' : 'atanh',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'202' : {
		'tag' : 'cot',
		'value' : 'cot',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'203' : {
		'tag' : 'acot',
		'value' : 'acot',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'204' : {
		'tag' : 'coth',
		'value' : 'coth',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'205' : {
		'tag' : 'acoth',
		'value' : 'acoth',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'206' : {
		'tag' : 'csc',
		'value' : 'csc',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'207' : {
		'tag' : 'acsc',
		'value' : 'acsc',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'208' : {
		'tag' : 'csch',
		'value' : 'csch',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'209' : {
		'tag' : 'acsch',
		'value' : 'acsch',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'210' : {
		'tag' : 'sec',
		'value' : 'sec',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'211' : {
		'tag' : 'asec',
		'value' : 'asec',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'212' : {
		'tag' : 'sech',
		'value' : 'sech',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'213' : {
		'tag' : 'asech',
		'value' : 'asech',
		'class' : 'triangle',
		'param-count' : '1',
		'tag-clazz' : 'value_triangle',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'214' : {
		'tag' : 'log',
		'value' : 'log',
		'class' : 'method_log',
		'param-count' : '2',
		'tag-clazz' : 'value_log',
		'func-type' : Lyn.dc.NOTE_TYPE_BINOCULAR_FUNCTION
	},
	'215' : {
		'tag' : 'ln',
		'value' : 'ln',
		'class' : 'method_ln',
		'param-count' : '1',
		'tag-clazz' : 'value_ln',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'216' : {
		'tag' : 'exp',
		'value' : 'exp',
		'class' : 'method_exp',
		'param-count' : '1',
		'tag-clazz' : 'value_exp',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'217' : {
		'tag' : 'ceil',
		'value' : 'ceil',
		'class' : 'method_ceil',
		'param-count' : '1',
		'tag-clazz' : 'value_ceil',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'218' : {
		'tag' : 'fac',
		'value' : '!',
		'class' : 'method_fac',
		'param-count' : '1',
		'tag-clazz' : 'value_fac',
		'func-type' : Lyn.dc.NOTE_TYPE_FAC
	},
	'219' : {
		'tag' : 'abs',
		'value' : 'abs',
		'class' : 'method_abs',
		'param-count' : '1',
		'tag-clazz' : 'value_abs',
		'func-type' : Lyn.dc.NOTE_TYPE_MONOCULAR_FUNCTION
	},
	'220' : {
		'value' : '{',
		'class' : 'other_btn',
		'param-count' : '',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'221' : {
		'value' : '}',
		'class' : 'other_btn',
		'param-count' : '',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'222' : {
		'value' : '≤',
		'class' : 'other_btn',
		'param-count' : '',
		'tag-clazz' : '',
		'func-type' : ''
	},
	'223' : {
		'value' : '≥',
		'class' : 'other_btn',
		'param-count' : '',
		'tag-clazz' : '',
		'func-type' : ''
	}
};

Lyn.dc.SCREEN_NUMBER = [ Lyn.dc.KEY_NUMBER_7, Lyn.dc.KEY_NUMBER_8,
		Lyn.dc.KEY_NUMBER_9, Lyn.dc.KEY_NUMBER_4, Lyn.dc.KEY_NUMBER_5,
		Lyn.dc.KEY_NUMBER_6, Lyn.dc.KEY_NUMBER_1, Lyn.dc.KEY_NUMBER_2,
		Lyn.dc.KEY_NUMBER_3, Lyn.dc.KEY_NUMBER_0, Lyn.dc.KEY_POINT,
		Lyn.dc.KEY_PI ];

Lyn.dc.SCREEN_FEATURE = [ Lyn.dc.KEY_FUNCTION, Lyn.dc.KEY_X,
		Lyn.dc.KEY_BACKSPACE, Lyn.dc.KEY_EULER, Lyn.dc.KEY_Y,
		Lyn.dc.KEY_ENTER, Lyn.dc.KEY_EMPTY, Lyn.dc.KEY_TOP, Lyn.dc.KEY_ENTER2,
		Lyn.dc.KEY_LEFT, Lyn.dc.KEY_BOTTOM, Lyn.dc.KEY_RIGHT ];
Lyn.dc.SCREEN_FUNCTION_1 = [ Lyn.dc.KEY_SQRT, Lyn.dc.KEY_PLUS,
		Lyn.dc.KEY_DIVISION, Lyn.dc.KEY_POWER, Lyn.dc.KEY_MINUS,
		Lyn.dc.KEY_MULTIPL, Lyn.dc.KEY_LEFT_PARE, Lyn.dc.KEY_RIGHT_PARE,
		Lyn.dc.KEY_EQUAL, Lyn.dc.KEY_LESS, Lyn.dc.KEY_LARGE, Lyn.dc.KEY_MORE ];
Lyn.dc.SCREEN_FUNCTION_2 = [ Lyn.dc.KEY_LOG, Lyn.dc.KEY_LN, Lyn.dc.KEY_EXP,
		Lyn.dc.KEY_CEIL, Lyn.dc.KEY_FACTORIAL, Lyn.dc.KEY_ABS,
		Lyn.dc.KEY_LEFT_BRACES, Lyn.dc.KEY_RIGHT_BRACES, Lyn.dc.KEY_EQUAL,
		Lyn.dc.KEY_LE_OR_EQ, Lyn.dc.KEY_LG_OR_EQ, Lyn.dc.KEY_MORE ];
Lyn.dc.SCREEN_FUNCTION_3 = [ Lyn.dc.KEY_SIN, Lyn.dc.KEY_COS, Lyn.dc.KEY_TAN,
		Lyn.dc.KEY_COT, Lyn.dc.KEY_CSC, Lyn.dc.KEY_SEC, Lyn.dc.KEY_ASIN,
		Lyn.dc.KEY_ACOS, Lyn.dc.KEY_ATAN, Lyn.dc.KEY_ACOT, Lyn.dc.KEY_ACSC,
		Lyn.dc.KEY_ASEC, Lyn.dc.KEY_SINH, Lyn.dc.KEY_COSH, Lyn.dc.KEY_TANH,
		Lyn.dc.KEY_COTH, Lyn.dc.KEY_CSCH, Lyn.dc.KEY_SECH, Lyn.dc.KEY_ASINH,
		Lyn.dc.KEY_ACOSH, Lyn.dc.KEY_ATANH, Lyn.dc.KEY_ACOTH, Lyn.dc.KEY_ACSCH,
		Lyn.dc.KEY_ASECH ];

Lyn.dc.SCREEN_AREA_NAME_NUMBER = 'number_area';
Lyn.dc.SCREEN_AREA_NAME_FUNCTION = 'function_area';
Lyn.dc.SCREEN_AREA_NAME_FEATURE = 'feature_area';
Lyn.dc.SCREEN_AREA_NAME_EXTEND = 'extend_area';
Lyn.dc.SCREEN_AREA_NAME_EXTRA_FUNC = 'extra_func_area';

Lyn.dc.SCREEN_AREA = {};
Lyn.dc.SCREEN_AREA[Lyn.dc.SCREEN_AREA_NAME_EXTRA_FUNC] = Lyn.dc.SCREEN_FUNCTION_3;
Lyn.dc.SCREEN_AREA[Lyn.dc.SCREEN_AREA_NAME_NUMBER] = Lyn.dc.SCREEN_NUMBER;
Lyn.dc.SCREEN_AREA[Lyn.dc.SCREEN_AREA_NAME_EXTEND] = Lyn.dc.SCREEN_FUNCTION_2;
Lyn.dc.SCREEN_AREA[Lyn.dc.SCREEN_AREA_NAME_FUNCTION] = Lyn.dc.SCREEN_FUNCTION_1;
Lyn.dc.SCREEN_AREA[Lyn.dc.SCREEN_AREA_NAME_FEATURE] = Lyn.dc.SCREEN_FEATURE;

Lyn.dc.SCREEN_DEFAULT_AREA = [ Lyn.dc.SCREEN_AREA_NAME_NUMBER,
		Lyn.dc.SCREEN_AREA_NAME_FUNCTION, Lyn.dc.SCREEN_AREA_NAME_FEATURE ];
Lyn.dc.SCREEN_EXTEND_AREA = [ Lyn.dc.SCREEN_AREA_NAME_EXTEND ]

Lyn.dc.SCREEN_SET = {
	'default' : Lyn.dc.SCREEN_DEFAULT_AREA,
	'extend' : Lyn.dc.SCREEN_EXTEND_AREA
}
Lyn.dc.SCREEN_CHANGE = {
	'before' : Lyn.dc.SCREEN_AREA_NAME_FUNCTION,
	'after' : Lyn.dc.SCREEN_AREA_NAME_EXTEND
};

Lyn.dc.inputMore = [ '1', '2', '3', 'log', 'ln', 'exp', 'Function', 'X', '',
		'4', '5', '6', 'ceil', 'x!', 'abs', 'e', 'Y', '', '7', '8', '9', '{',
		'}', '=', '', '↑', 'Enter', '0', '.', "π", '≤', '≥', 'More', '←', '↓',
		'→' ];
Lyn.dc.triangle = [ 'sin', 'asin', 'sinh', 'asinh', 'cos', 'acos', 'cosh',
		'acosh', 'tan', 'atan', 'tanh', 'atanh', 'cot', 'acot', 'coth',
		'acoth', 'csc', 'acsc', 'csch', 'acsch', 'sec', 'asec', 'sech', 'asech' ];
// 'sin','asin','sinh','cos','acos','cosh','tan','atan','tanh','cot','acot','coth','csc','acsc','csch','sec','asec','sech'
Lyn.dc._input = null;
Lyn.dc._blink = "<blink class='blink'>|</blink>";

Lyn.math = Lyn.math || new Object();
Lyn.math.X = 0;
Lyn.math.Y = 0;

Lyn.math.sin = function(e) {
	return Math.sin(e);
}
Lyn.math.asin = function(e) {
	return Math.asin(e);
}
Lyn.math.sinh = function(e) {
	return (Math.exp(e) - Math.exp(-e)) / 2.0;
}
Lyn.math.asinh = function(e) {
	return Math.log(e + Math.sqrt(Math.pow(e, 2) + 1));
}
Lyn.math.cos = function(e) {
	return Math.cos(e);
}
Lyn.math.acos = function(e) {
	return Math.acos(e);
}
Lyn.math.cosh = function(e) {
	return (Math.exp(e) + Math.exp(-e)) / 2.0;
}
Lyn.math.acosh = function(e) {
	return Math.log(e + Math.sqrt(Math.pow(e, 2) - 1)), Math.log(e
			- Math.sqrt(Math.pow(e, 2) - 1));
}
Lyn.math.tan = function(e) {
	return Math.tan(e);
}
Lyn.math.atan = function(e) {
	return Math.atan(e);
}
Lyn.math.tanh = function(e) {
	return Lyn.math.sinh(e) / Lyn.math.cosh(e);
}
Lyn.math.atanh = function(e) {
	return 0.5 * Math.sqrt((1 + e) / (1 - e));
}
Lyn.math.cot = function(e) {
	return 1 / Math.tan(e);
}
Lyn.math.acot = function(e) {
	return Math.PI / 2 - Math.atan(e);
}
Lyn.math.coth = function(e) {
	return 1 / Lyn.math.tanh(e);
}
Lyn.math.acoth = function(e) {
	return 0.5 * Math.sqrt((1 - e) / (1 + e));
}
Lyn.math.csc = function(e) {
	return 1 / Math.cos(e);
}
Lyn.math.acsc = function(e) {
	return Math.asin(1 / e);
}
Lyn.math.csch = function(e) {
	return 1 / Lyn.math.sinh(e);
}
Lyn.math.acsch = function(e) {
	if (e > 0) {
		return Math.log((1 + Math.sqrt(1 + Math.pow(e, 2))) / e);
	} else {
		return Math.log((1 - Math.sqrt(1 + Math.pow(e, 2))) / e);
	}
}
Lyn.math.sec = function(e) {
	return 1 / Math.cos(e);
}
Lyn.math.asec = function(e) {
	return Math.PI / 2 - Lyn.math.csc(e);
}
Lyn.math.sech = function(e) {
	return 1 / Lyn.math.cosh(e);
}
Lyn.math.asech = function(e) {
	return Math.log((1 + Math.sqrt(1 - Math.pow(e, 2))) / e), -Math
			.log((1 + Math.sqrt(1 - Math.pow(e, 2))) / e);
}
Lyn.math.fac = function(e) {
	var a = 1;
	for (i = 1; i < e + 1; i++) {
		a *= i;
	}
	return a;
}
Lyn.math.log = function(a, b){
	return Math.log(b) / Math.log(a);
}

Lyn.math.ln = function(a){
  return Math.log(a);
}

/*
 * Lyn.dc.NOTE_KEY={
 * '1000':[KEY_NUMBER_0,KEY_NUMBER_1,KEY_NUMBER_2,KEY_NUMBER_3,KEY_NUMBER_4,KEY_NUMBER_5,KEY_NUMBER_6,KEY_NUMBER_7,KEY_NUMBER_8,KEY_NUMBER_9,KEY_POINT,KEY_PI,KEY_EULER],
 * '1001':[KEY_MULTIPL,KEY_PLUS,KEY_MINUS,KEY_DIVISION], '1010':[KEY_X,KEY_Y],
 * '1011':[KEY_SQRT,KEY_SIN,KEY_ASIN,KEY_SINH,KEY_ASINH,KEY_COS,KEY_ACOS,KEY_COSH,KEY_ACOSH,KEY_TAN,KEY_ATAN,KEY_TANH,KEY_ATANH,KEY_COT,KEY_ACOT,KEY_COTH,KEY_ACOTH,KEY_CSC,KEY_ACSC,KEY_SEC,KEY_ASEC,KEY_SECH,KEY_ASECH,KEY_EXP,KEY_CEIL,KEY_FACTORIAL,KEY_ABS,KEY_LN],
 * '1100':[KEY_POWER,KEY_LESS,KEY_LARGE,KEY_LOG], '1101':[KEY_LEFT_PARE],
 * '1110':[KEY_RIGHT_PARE], '1111':[KEY_EQUAL] }
 */