sloter  老虎机
============

|Author|evan.fu|
|---|---
|E-mail|153668770@qq.com

---

## HTML
```html
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
```

## script
### 1. use javascript
```javascript
var mysloter = new sloter( '#sloter1', {
    effect   : 'up',//up | down | left | right | turn
    speed    : 8,//速度 值越大越快
    duration : 5000,//持续时间
    counts   : 8,// 转轮边数
    init     : function(sloter){
        console.log('init');
        //console.log(sloter);
    },
    scroll : function(sloter){
        console.log('scroll');
        //console.log(sloter);
    },
    completed: function(sloter){
        console.log('completed');
        //console.log(sloter);
    }
});
```  


##### Object function
`goto`  
`stop`

```javascript
mysloter.goto(0);// 0 1 2 3 分别为 不中奖，1，2，3等奖

``
## Example
1. [Demo](https://awin8516.github.io/sloter/docs/)  