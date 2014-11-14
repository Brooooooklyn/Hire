(function ($) {
    Lyn.user = ({
        //user's input array analysis
        bind: function (clazz) {
            var $this = $(clazz);
            $this.on('vclick', function (e) {
                e.stopPropagation();
                //$('.textarea').unbind();
                $('.blink').remove();
                $this.after(Lyn.dc._blink);
            });
        },
        _one: function (_e) {
            _e.one('vclick', function (e) {
                e.stopPropagation();
                _e.after($('.blink'));
            });
        },
        one: function (clazz) {
            var $this = $(clazz);
            $this.one('vclick', function (e) {
                e.stopPropagation();
                $this.after($('.blink'));
            });
        },
        text_num: 1,//to calculator the number of input area
        transInput: function () {
            var _textarea = $('.textarea');
            $('.blink').remove();
            _textarea.each(function (i, e) {
                var item = _textarea.eq(i);
                var textarea = item.clone();
                var funcID = item.data('yanFuncId');
                Lyn.dc._input = textarea.find('span');
                var input = Lyn.dc._input;
                var _input = {};
                var __input = '';

                for (i = input.length - 1; i >= 0; i--) {
                    //console.log($(_input).attr('class'));
                    _input[i] = input.eq(i);
                    //console.log($(_input[i]).attr('class'));
                    var className = _input[i].attr('class');
                    console.log(className);
                    switch (className) {
                        case "inputValue radical_area":
                            _input[i].prepend('Math.sqrt');
                            console.log(_input[i]);
                            break;
                        case 'inputValue pow_area':
                            _input[i].prepend('Math.pow(').append(')').children('param').first().after(',');
                            break;
                        case 'inputValue value_log':
                            var param1 = _input[i].prepend('Lyn.math.').children('param').first();
                            var r = param1.next();
                            r.before(',');
                            r.next().remove();
                            r.remove();
                            break;
                        case 'inputValue value_ln':
                            _input[i].prepend('Lyn.math.');
                            break;
                        case 'inputValue value_exp':
                            _input[i].prepend('Math.');
                            break;
                        case 'inputValue value_ceil':
                            _input[i].prepend('Math.');
                            break;
                        case 'inputValue value_abs':
                            _input[i].prepend('Math.');
                            break;
                        case 'inputValue value_fac':
                            _input[i].prepend('Lyn.math.fac(').append(')');
                            break;
                        case 'inputValue value_triangle':
                            _input[i].text('Lyn.math.' + _input[i].text());
                            break;
                        case 'inputValue value_num value_euler':
                            _input[i].append('$');
                            break;
                    }
                    //console.log(Lyn.dc._input);
                }
                __input = textarea.text();

                Lyn.math.input = __input.replace(/X/g, 'Lyn.math.X').replace(/Y/g, 'Lyn.math.Y').replace(/π/g, Math.PI).replace(/×/g, '*').replace(/√/g, '').replace(/!/g, '').replace(/e$/g, 'Math.E').replace(/π/g, 'Math.PI');
                Lyn.math.input = 'Lyn.math.Y = ' + Lyn.math.input;
                console.log(Lyn.math.input);
                Yan.ExpressionController.add(funcID, Lyn.math.input);
            });
            Yan.DC.POINT_STATUS = Yan.DC.POINT_STOP; // 通知绘图
        },
    });
})(jQuery);