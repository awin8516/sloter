/****************************************
 * plus name : 老虎机
 * author    : F
 * date      : 2016-12-06
 ****************************************
 * HTML layout
 	<div id="sloter1" class="sloter sloter-test1">
        <div class="sloter-group">
            <ul class="sloter-wrapper">
                <li class="sloter-slide"><img src="image/1.png"></li>
                <li class="sloter-slide"><img src="image/2.png"></li>
                <li class="sloter-slide"><img src="image/3.png"></li>
                <li class="sloter-slide"><img src="image/4.png"></li>
            </ul>
        </div>
        <div class="sloter-group">
            <ul class="sloter-wrapper">
                <li class="sloter-slide"><img src="image/1.png"></li>
                <li class="sloter-slide"><img src="image/2.png"></li>
                <li class="sloter-slide"><img src="image/3.png"></li>
                <li class="sloter-slide"><img src="image/4.png"></li>
            </ul>
        </div>
        <div class="sloter-group">
            <ul class="sloter-wrapper">
                <li class="sloter-slide"><img src="image/1.png"></li>
                <li class="sloter-slide"><img src="image/2.png"></li>
                <li class="sloter-slide"><img src="image/3.png"></li>
                <li class="sloter-slide"><img src="image/4.png"></li>
            </ul>
        </div>
    </div>
 */
require('./sloter.css');
window.sloter = function (selector, params) {
	var _this = this;
	_this.userAgent = navigator.userAgent.toLowerCase();
	_this.transitionend = 'transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd';
	_this.ios = _this.userAgent.indexOf('iphone') > -1 || _this.userAgent.indexOf('mac') > -1;
	this.fn = {
		getRadius : function (height, angle){
			return (height/2) / Math.tan(angle/2*Math.PI/180);
		},
		formatStyle : function (name, value){
			var res = {},arrPriex = [ '', '-webkit-', '-moz-', '-ms-','-o-'], length = arrPriex.length;
			for (var i=0; i < length; i+=1) {res[arrPriex[i] + name] = value;};
			return res;
		},
		doTransform : function(value){
			return _this.fn.formatStyle('transform', value);
		},
		doTranslate : function(x,y,z){
			return _this.fn.formatStyle('transform', 'translate3d('+x+', ' + y + ', '+z+')');
		},
		doRotate : function(x,y,z,angle){
			var rotate = x==1 ? 'rotateX' : y==1 ? 'rotateY' : z==1 ? 'rotateZ' : 'rotate';
			rotate = _this.ios ? rotate+'('+angle+'deg)' : 'rotate3d('+x+', ' + y + ', '+z+', '+angle+'deg)';	  
			return _this.fn.formatStyle('transform', rotate);
		},
		doTransition : function(value){
			return _this.fn.formatStyle('transition-property', value);
		},
		doDuration : function(time) {
			return _this.fn.formatStyle('transition-duration', time + 'ms');
		},
		doOrigin : function(x,y,z){
			return _this.fn.formatStyle('transform-origin', ''+x+' '+y+' '+z+'');
		},
		removeTransform : function(){
			return _this.fn.formatStyle('transform', '');
		},
		removeTransition : function(){
			return _this.fn.formatStyle('transition', '');
		},
		toMatrix : function(value){
			var p = document.createElement('p');
			document.body.appendChild(p);
			p.style.transform = value;
			var computedStyle = document.defaultView.getComputedStyle( p, null );
			var res = computedStyle.getPropertyValue('transform');
			document.body.removeChild(p);
			return res;
		},
		getRand : function(Min,Max,ignore){//随机数   
			var Range = Max - Min;   
			var res = Min + Math.round(Math.random() * Range);
			if(ignore != undefined){
				for(i=0; i<1000; i++){
					var res = Min + Math.round(Math.random() * Range);
					if(typeof ignore != 'object'){
						if(res != ignore) break;
					}else{
						if(ignore.indexOf(res) == -1 ) break;
					}
				}
			}			
			return res;   
		},
		getRandArray : function(Min, Max, Len){//随机数组
			var arr = [];
			Len = Len > (Max - Min + 1) ? Max - Min + 1 : Len;
			for(var i=0;i<1000;i++){
				var _rand = this.getRand(Min,Max);
				if(arr.indexOf(_rand) == -1){
					arr.push(_rand);
					if(arr.length==Len) break;
				};
			}
			return arr;//[0, 3, 5]
		}
	};	
	this.setup = function(){
		_this.option = jQuery.extend({
			effect   : 'up',//up | down | left | right | turn
			speed    : 5,//速度 值越大越快
			duration : 5000,//持续时间
			counts   : 8,// 转轮边数
			init     : null,
			onscroll : null,
			completed: null
		}, params || {});
		_this.sloter  = $(selector);
		_this.group = $('.sloter-group',_this.sloter);
		_this.group.ul = _this.group.children();
		_this.group.count = _this.group.eq(0).children().children().length;
		_this.direction= _this.option.effect == 'up' || _this.option.effect == 'right' ? 1 : -1;
		_this.class    = _this.option.effect == 'up'   || _this.option.effect == 'down'  ? 'vertical' : 'horizontal';
		_this.rotate   = {};
		_this.rotate.x = _this.class == 'vertical'   ? 1 : 0;
		_this.rotate.y = _this.class == 'horizontal' ? 1 : 0;
		//_this.matrix   = {};
		//_this.matrix.start  = _this.fn.toMatrix('rotate3d('+_this.rotate.x+', '+_this.rotate.y+', 0, 0deg)');
		_this.sizeName = _this.class == 'horizontal' ? 'width' : 'height';
		_this.sloter.addClass('sloter-'+_this.class);
		_this.count = 0;
		_this.scrolling = false;
		_this.hasEndEvent = true;
		
		_this.format = function(el){
			var int = parseInt(_this.option.counts/el.slide.length);
			var rem = _this.option.counts%el.slide.length;
			for(i=0; i<int-1; i++){el.wrapper.append(el.slide.clone());};
			el.wrapper.append(el.slide.filter(":lt("+rem+")").clone().addClass('sloter-slide-clone'));
			el.slide = el.wrapper.children();
			if(_this.ios){
				el.wrapper.wrap('<div class="sloter-wrapper-ios">');//ios Z轴上的位移BUG
				el.iosbox = el.wrapper.parent();
			};
			return el;
		};
		_this.initGroup = function(el){
			el = _this.format(el);
			el.slide.size = el.slide[_this.sizeName]();
			el.angle = parseInt(360/_this.option.counts);
			_this.group.radius = el.radius = -_this.fn.getRadius(el.slide.size, el.angle);
			if(_this.ios) el.iosbox.css(_this.fn.doTransform('translateZ('+(el.radius+1)+'px)'));//ios Z轴上的位移BUG
			el.wrapper.css(       _this.fn.doOrigin('center','center',(_this.ios ? 0 : el.radius)+'px'),  _this.fn.doDuration(_this.option.duration)    );
			el.wrapper.on(_this.transitionend+'.sloter', function(){
				if(!_this.hasEndEvent) return;
				var wrapper = $(this);
				wrapper.css(        jQuery.extend(    _this.fn.doRotate(_this.rotate.x, _this.rotate.y, 0, wrapper.data('angle')%360),  _this.fn.doDuration(0)    )        );
				_this.count++;
				if(_this.count == _this.group.length){
					_this.option.completed && _this.option.completed(_this);
					_this.count=0;
					_this.scrolling = false;
				};
			});
			el.slide.each(function(index, element){
				$(element).css(        jQuery.extend(    _this.fn.doRotate(_this.rotate.x,_this.rotate.y,0,el.angle*index*-_this.direction),  _this.fn.doOrigin('center','center',el.radius+'px')    )        );
            });
		};
		_this.group.each(function(index, element) {
            var el = {};
			el.wrapper = $(element).children();
			el.slide   = el.wrapper.children();
			_this.initGroup(el);
        });
		_this.option.init && _this.option.init(_this);
		return _this;
	};
	
	this.goto = function(end){
		if(_this.scrolling) return;
		_this.scrolling = true;
		_this.hasEndEvent = true;
		var _end = end ? end : _this.fn.getRandArray(1,_this.group.count, _this.group.length);
		setTimeout(function(){
			_this.group.ul.each(function(index, element){
				var angle = (_this.option.speed * 360 + parseInt(360/_this.option.counts)*(_end[index]-1)) * _this.direction;
				$(this).data('angle', angle).css(jQuery.extend(_this.fn.doRotate(_this.rotate.x, _this.rotate.y, 0, angle),  _this.fn.doDuration(_this.option.duration)));
			});
			_this.option.scroll && _this.option.scroll(_this);
		}, 10);
	};
	this.stop = function(){
		_this.scrolling = false;
		_this.hasEndEvent = false;
		_this.group.ul.each(function(index, element) {
			var wrapper = $(element);
			var computedStyle = document.defaultView.getComputedStyle( element, null );
			wrapper.css(_this.fn.doTransform(computedStyle.getPropertyValue('transform') ));
			console.log(computedStyle);
        });
	};
	this.setup();
};