! function($) {
    var Cascade = function(element, options) {
        this.init('cascade', element, options);
    }

    Cascade.prototype = {
        constructor: Cascade,
        init: function(type, element, options) {
            this.type = type;
            this.$element = $(element);
            this.options = this.getOptions(options);
            this.layout();
        },
        getOptions: function(options) {
            options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);
            return options;
        },
        layout: function() {
            this.item();
            this.endDecorate();
            this.box();
        },
        item: function() {
            var $box = this.$element,
                _layout = [],
                _num = 0,
                _options = this.options,
                i = 0,
                $items = $box.find(this.options.fallsCss),
                fallsWidth = $items.eq(0).outerWidth() + this.options.margin,
                boxWidth = $box.outerWidth() + this.options.margin;
	            // 2016-09-20 18:47:42 解决加载后找不到this.$element从而导致windth过小报错
	            if (boxWidth < fallsWidth) {
	                // 如果容器宽度小于box宽度，那么取设备屏幕宽度
	                boxWidth = $(window).width();
	            }
            _num = Math.floor(boxWidth / fallsWidth);
            for (; i < _num; i++) {
                _layout.push([i * fallsWidth, 0]);
            }
            $items.each(function() {
                var $item = $(this),
                    fallsHeight = $item.outerHeight() + _options.margin,
                    temp = 0;

                for (i = 0; i < _num; i++) {
                    if (_layout[i][1] < _layout[temp][1]) {
                        temp = i;
                    }
                }

                $item.stop().animate({
                    left: _layout[temp][0] + 'px',
                    top: _layout[temp][1] + 'px'
                })

                _layout[temp][1] += fallsHeight;


                $item.on('mouseenter' + '.' + _options.type, function() {
                    $(this).addClass('hover');
                })
                $item.on('mouseleave' + '.' + _options.type, function() {
                    $(this).removeClass('hover');
                })
            });

            this.layout = _layout;
            this.num = _num;
        },
        box: function() {
            this.$element.height(this.getFallsMaxHeight());
        },
        endDecorate: function() {
            var _layout = this.layout,
                i = 0,
                _num = this.num,
                fallsMaxHeight = this.getFallsMaxHeight(),
                falls = document.createElement('div'),
                fallsClone, fallsHeight = 0;

            falls.className = 'item additem';
            for (; i < _num; i++) {
                if (fallsMaxHeight != _layout[i][1]) {
                    fallsClone = falls.cloneNode();
                    fallsHeight = fallsMaxHeight - this.options.margin - _layout[i][1];
                    // fallsClone.style.cssText = 'left: ' + _layout[i][0] + 'px; ' + 'top: ' + _layout[i][1] + 'px; height: ' + fallsHeight + 'px;';

                    this.$element.append($(fallsClone).animate({
                        left: _layout[i][0] + 'px',
                        top: _layout[i][1] + 'px',
                        height: fallsHeight + 'px'
                    }));
                }
            }
        },
        getFallsMaxHeight: function() {
            var maxHeight = 0,
                i = 0,
                heightArry = [],
                _layout = this.layout,
                _num = this.num;

            for (; i < _num; i++) {
                heightArry.push(_layout[i][1]);
            }

            heightArry.sort(function(a, b) {
                return a - b;
            });
            return heightArry[_num - 1];
        }
    }

    var old = $.fn.cascade;

    $.fn.cascade = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('cascade'),
                options = typeof option == 'object' && option;
            if (!data) {
                $this.data('cascade', data = new Cascade(this, options));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    }

    $.fn.cascade.Constructor = Cascade;

    $.fn.cascade.defaults = {
        fallsCss: '.item',
        margin: 15
    }

    $.fn.cascade.noConflict = function() {
        $.fn.cascade = old;
        return this;
    }
}(window.jQuery)