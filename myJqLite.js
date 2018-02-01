//2.$的时候实例化这个方法 拿到dom *此时this.elements或许是一个数组 或许是一个值
function $(selector) {

    return new Basic(selector);
}

//封装AJAX

$.ajax=function(json){
	//创建xhr对象
	function createXHR(){
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest(); //支持IE7+，非IE
		}
		return new ActiveXObject("Microsoft.XMLHTTP"); //支持IE6
	}
	//格式化数据
	function formatJson(data){
		var str='';
		for(var attr in data){
			
			str+=attr+'='+data[attr]+'&'
			
		}	
		return str.slice(0,-1);		
	}
	
	
	var type=json.type?json.type:'get';
	
	var async=json.async?json.async:true;
	
	var data=formatJson(json.data);  /*把对象转换成  url数据*/
	
	if(!json.url){		
		json.error('传入参数错误，必须传入url')
		return false;		
	}
	//1.创建XMLHttpRequest
	var xhr= createXHR();	
	
	
	if(type.toLowerCase()=='get'){		
		if(json.url.indexOf('?')!=-1){
			var api=json.url+'&'+data;
			
		}else{
			var api=json.url+'?'+data;
		}				
		xhr.open(type,api,async);
		xhr.send(); 
		
	}else{  /*post*/		
		
				
		xhr.open(type,json.url,async);
		
		//设置请求头		
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		
		xhr.send(data);   // name=张三&age=20
				
	}
	
	if(async){ /*异步*/
		
		xhr.onreadystatechange=function(){
			
			if(xhr.readyState==4&&xhr.status==200){
				
				var result=JSON.parse(xhr.responseText);
			
				json.success(result);
				
			}
			
		}		
		
	}else{ //同步		
		
		if(xhr.status==200){
			
			//调用成功的回调函数
			
			var result=JSON.parse(xhr.responseText);
			
			json.success(result);
			
		}
		
		
	}
	
}

/*
 $.get(api,function(){
 	
 	
 })
 * */
$.get=function(api,success,err){
		$.ajax({						
			type:'get',			
			url:api,		
			success:function(data){
				success(data)
			},
			error:function(errdata){				
				err(errdata);
			}
		})
	
	
}


function Basic(selector) {

    //获取所有的dom节点

    this.elements = [];

    if (typeof (selector) == 'object') {
        this.elements[0] = selector; //this.elements[0]=this
    } else {
        this.query(selector); //this.query(this)
    }


}



//1. 封装方法获取 elements
Basic.prototype.query = function (selector) {

    this.elements = document.querySelectorAll(selector)
}


/*获取dom节点的方法*/
Basic.prototype.get = function (index) {

    return this.elements[index];
}


//3. 用原型链的方法 分装一个公用的方法 获取和改变 一个选择器或者多个选择器的css的样式

Basic.prototype.css = function (attr, value) { //4. 传入样式 和样式的值 eg:color red;

    if (typeof (attr) == 'object') { //8. 判断这个属性是不是一个object类型（多个属性设置多个样式）

        for (var i = 0; i < this.elements.length; i++) { //9.循环遍历传进来的属性和样式，再遍历里面的属性和样式，拿到所有的属性样式

            for (key in attr) {

                this.elements[i].style[key] = attr[key]
            }

        }

    } else {

        if (arguments.length == 1) { //5. 判断传进来的是几个值，一个值就是获取，两个值就是设置样式 这时候分装一个工具方法获取css样式--->tools.js

            return myComputedStyle(this.elements[0], attr) //6. 获取当前el（就只有1个）  传值

        } else { //7. 循环遍历传进来的属性和样式，让attr=value； (这时候是循环多个属性设置一个样式)

            for (var i = 0; i < this.elements.length; i++) {

                this.elements[i].style[attr] = value;
            }

        }

        return this; // 10 .返回当前的实例 实现连缀操作，只写1个.css {}


    }

}


//basic原型链的基础上增加获取innerHTML内容的方法

Basic.prototype.html = function (value) { //传值，判断传进来的值  

    if (arguments.length == 0) {

        return this.elements[0].innerHTML;

    } else { //让内容等于传进来的值

        for (var i = 0; i < this.elements.length; i++) {

            return this.elements[i].innerHTML = value;
        }

    }
}


//获取点击的方法

Basic.prototype.click = function (cb) {
    // alert(cb);
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].onclick = cb;
    }
}


//封装一个hover的方法

Basic.prototype.hover = function (cb1, cb2) { //两个回调函数 一个进入事件 一个离开事件

    for (var i = 0; i < this.elements.length; i++) {

        this.elements[i].onmouseover = cb1;
        this.elements[i].onmouseleave = cb2;

    }
}



//显示方法

Basic.prototype.show = function () {

    for (var i = 0; i < this.elements.length; i++) {

        this.elements[i].style.display = 'block';

    }
    return this;
}

//隐藏方法

Basic.prototype.hide = function () {

    for (var i = 0; i < this.elements.length; i++) {

        this.elements[i].style.display = 'none';

    }
    return this;

}


//封装一个find方法，找到当前节点下面的子节点

//$('.list').find('li')


Basic.prototype.find = function (el) {

    var allChildElements = []; /*放所有找到的子元素*/
    for (var i = 0; i < this.elements.length; i++) {

        var childElements = this.elements[i].querySelectorAll(el); /*获取每个满足条件dom下面的子节点*/

        for (var k = 0; k < childElements.length; k++) {

            allChildElements.push(childElements[k])

        }
    }

    this.elements = allChildElements; /*改变dom节点的指向*/

    return this;

    /*
	 list
	 
	 	li
	 	li
	 	
	 list
	 	li
	 	li
	 	
	 list 
	 
	 	li
	 * */

}

//first  获取满足条件的第一个节点


Basic.prototype.first = function () {
    //	改变elements的时候一定要保证this.elements 是个数组	
    var firstElements = [];

    firstElements.push(this.elements[0]);

    this.elements = firstElements;

    return this;

}

//last  获取满足条件的最后一个节点

Basic.prototype.last = function () {
    //	改变elements的时候一定要保证this.elements 是个数组		
    var lastElements = [];

    lastElements.push(this.elements[this.elements.length - 1]);

    this.elements = lastElements;

    return this;

}


//eq  获取满足条件的索引值节点

Basic.prototype.eq = function (index) {

    var eqElements = [];

    eqElements.push(this.elements[index]); /*获取满足索引值的dom节点*/

    this.elements = eqElements;

    return this;

}

//index
/*
 	$('.cate li')  返回所有的li节点    11111   2222   3333
 
 	alert($(this).index())
 * */

Basic.prototype.index = function () {
    //获取父节点下面的所有子节点

    //调用$(this) 表示把当前的dom节点给this.elements[0]  	

    var childElements = this.elements[0].parentNode.children;

    for (var i = 0; i < childElements.length; i++) {

        if (this.elements[0] == childElements[i]) //找到下标相同的对应节点  返回当前索引值；

            return i;
    }
    return -1;

}



//
//获取设置 滚动条距离顶部的高度     document      box

/*
 $(document).scrollTop()
 
 $('#box').scrollTop()

*/

Basic.prototype.scrollTop = function (position) {

    if (this.elements[0] == document) { /*获取和设置document的scrolltop   */

        if (arguments.length == 1) { /*传值 一个是设置 没有就是获取 */
            document.documentElement.scrollTop = position; //设置document的scrolltop
            document.body.scrollTop = position; //设置document的scrolltop
        } else {
            return document.documentElement.scrollTop || document.body.scrollTop; //返回document的scrolltop这个值
        }

    } else { /*获取和设置当前dom节点的scrollTop*/
        if (arguments.length == 1) {
            this.elements[0].scrollTop = position; //设置dom节点的滚动条高度

        } else {
            return this.elements[0].scrollTop; //返回dom节点的滚动条高度
        }


    }

}

//封装滚动条滚动事件  获取各种DOM节点

//$('#box')

//$(window)

//$('.box')
Basic.prototype.scroll = function (cb) {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].onscroll = cb;
    }
}


//添加Class

/*
 $('.box').addClass('active')
 * */

Basic.prototype.addClass = function (className) {
    //判断不存在
    for (var i = 0; i < this.elements.length; i++) {
        if (!hasClass(this.elements[i], className)) {
            /* 	var  box=document.getElementById('box');
				box.className=box.className+' active';  原来class的基础上再加一个class
			 */
            this.elements[i].className = this.elements[i].className + ' ' + className;

        }

    }
}


//移除Class

Basic.prototype.removeClass = function (className) {
    //判断存在
    for (var i = 0; i < this.elements.length; i++) {

        if (hasClass(this.elements[i], className)) {

            //			this.elements[i].className     box actvie pox 			
            var reg = new RegExp('(\\s+|^)' + className + '(\\s+|$)');

            //替换存在的className，重新赋值给dom节点
            this.elements[i].className = this.elements[i].className.replace(reg, ' ');

        }

    }
}


//封装一个任意元素居中的方法


Basic.prototype.center = function () {

    this.css({
        'position': 'absolute',
        'left': '50%',
        'top': '50%',
        'transform': 'translate(-50%,-50%)',
        'zIndex': '1000'


    })
    return this;
}



//设置遮罩层

Basic.prototype.showMask = function () {

    var oDiv = document.createElement('div');

    oDiv.setAttribute('id', 'mask')

    oDiv.style.position = 'absolute';

    oDiv.style.top = '0';
    oDiv.style.left = '0';
    oDiv.style.width = '100%';
    oDiv.style.height = '100%';
    oDiv.style.zIndex = 100;

    oDiv.style.background = "rgba(0,0,0,0.5)";

    document.body.appendChild(oDiv);

    document.body.style.overflow = "hidden";
    return this;

}

//隐藏遮罩层

Basic.prototype.hideMask = function () {

    var oDiv = document.getElementById('mask');

    document.body.removeChild(oDiv);

    document.body.style.overflowY = "auto";
    return this;

}

//兄弟节点silbings


/*	

$(this).siblings('li')

$(this).siblings('.actvie')

 * */

Basic.prototype.siblings = function (element) {

    var siblingsElement = []; //创建一个数组 不符合或者符合点击条件的子元素放进去；

    if (arguments.length == 1) { /*判断传入一个参数还是不传入参数*/

        var childElements = this.elements[0].parentNode.querySelectorAll(element);
    } else {
        var childElements = this.elements[0].parentNode.children;
    }

    for (var i = 0; i < childElements.length; i++) {

        if (this.elements[0] != childElements[i]) {

            siblingsElement.push(childElements[i]);
        }
    }
    this.elements = siblingsElement; //等于当前

    return this;
}






//设置元素拖拽

Basic.prototype.drag = function (el) {



    if (arguments.length == 1) {

        for (var i = 0; i < this.elements.length; i++) {
            //			this.elements[i].querySelector(el)     .header

            this.elements[i].querySelector(el).onmousedown = function (e) {
                var that = this; /*.header*/

                e = e || event;

                var offsetX = e.offsetX;
                var offsetY = e.offsetY;



                document.onmousemove = function (e) {

                    preDefault(e); /*阻止默认行为*/
                    stopPropagation(e); /*阻止冒泡*/


                    var e = e || event;
                    var clientX = e.clientX;
                    var clientY = e.clientY;

                    var left = clientX - offsetX;
                    var top = clientY - offsetY;

                    that.parentNode.style.left = left + 'px';
                    that.parentNode.style.top = top + 'px';

                    that.parentNode.style.margin = "0px"; //前面居中有margin 拖拽的时候把这些都变成0；	
                    that.parentNode.style.padding = "0px"
                    that.parentNode.style.transform = "translate(0,0)";



                }

                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        }


    } else {
        for (var i = 0; i < this.elements.length; i++) {

            this.elements[i].onmousedown = function (e) {
                var that = this;
                e = e || event;

                var offsetX = e.offsetX;
                var offsetY = e.offsetY;



                document.onmousemove = function (e) {

                    preDefault(e); /*阻止默认行为*/
                    stopPropagation(e); /*阻止冒泡*/


                    e = e || event;
                    var clientX = e.clientX;
                    var clientY = e.clientY;

                    var left = clientX - offsetX;
                    var top = clientY - offsetY;

                    that.style.left = left + 'px';
                    that.style.top = top + 'px';

                    that.style.margin = "0px"; //前面居中有margin 拖拽的时候把这些都变成0；	
                    that.style.padding = "0px"
                    that.style.transform = "translate(0,0)";



                }

                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        }
    }

}

//运动库


//缓冲运动
/*

$('.box').hover(function(){
    $(this).animate({
        width:'800'									
    })
},function(){
    $(this).animate({
        width:'200'	,
        height:600	//链式				
    })
})
*/

Basic.prototype.animate=function(json,fn){

	
	var _that=this; //保存当前对象
	
	for(var i=0;i<this.elements.length;i++){
			
			
			
	clearInterval(_that.elements[i].timer);
				
	(function(i){
		
			_that.elements[i].timer = setInterval(function(){
		
				var bStop = true; //表示全部到达目标值
				
				//遍历json对象中的每个css样式属性键值对
				for (var attr in json) {
					var iTarget = json[attr]; 				
					//1, current
					var current;
					if (attr == "opacity") { //透明度 
						current = Math.round(myComputedStyle(_that.elements[i],attr) * 100); 
					}
					else { //left,top,width,height
						current = parseFloat(myComputedStyle(_that.elements[i], attr)); 
						current = Math.round(current);
					}
					
					//2, speed
					var speed = (iTarget-current) / 8;
					speed = speed>0 ? Math.ceil(speed) : Math.floor(speed); 
					
					//3, 判断临界值
					if (current != iTarget){
						bStop = false; //说明有至少一个样式属性没有到达目标值
					}
					
					//4, 运动
					if (attr == "opacity") {
						_that.elements[i].style[attr] = (current + speed) / 100;
						_that.elements[i].style.filter = "alpha(opacity="+ (current+speed) +")";
					}
					else {
						_that.elements[i].style[attr] = current + speed + "px";
					}
					
				}
				
				//如果bStop=true， 则说明所有样式属性都到达了目标值
				if (bStop) {
					clearInterval(_that.elements[i].timer); //停止运动了
										
					//回调
					if (fn) {
						fn();
					}			
				}		
				
			}, 30);

		})(i)
 	 }

}


//获取和设置属性
/*
    alert($('#main').attr('class'));

    $('#main').attr('data-aid','123');
    
    
    alert($('#info').value())

    $('#info').value('这是改变表单的内容')
*/
Basic.prototype.attr=function(attr,value){


    if(arguments.length==1){

        return this.elements[0].getAttribute(attr);
    }else{

        for(var i=0;i<this.elements.length;i++){
		
			this.elements[i].setAttribute(attr,value)
			
		}

    }

}


//获取表单的Value

Basic.prototype.value=function(value){

    if(arguments.length==1){

        for(var i=0;i<this.elements.length;i++){

             this.elements[i].value=value;
        }
    }else{
        return this.elements[0].value;
    }
}