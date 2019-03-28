var tools = {
	//获取元素样式
	//@param  obj  DOMObj 获取样式的元素对象
	//@param  attr string 要获取的样式名称
	//@return string 样式结果
	
	
	getStyle : function (obj, attr){
		/* if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj, false)[attr];
		} */
		return obj.currentStyle ? 
			obj.currentStyle[attr] : 
			getComputedStyle(obj, false)[attr];
		/* 
		try{
			return obj.currentStyle[attr];
		}catch(){
			return getComputedStyle(obj, false)[attr];
		} */
	},
	
	//获取或者设置内联样式
	//@param	obj		DOMObj		要获取或者设置内联样式的对象
	//@param	attr	1.string	获取样式
	//						@return string	得到的属性值
	//					2.object	设置内联样式
	
	css : function(obj,attr){
		//判断是要获取样式还是设置内联样式
		if(typeof attr === "string"){
			//设置
			return this.getStyle(obj.attr);
		}else if(typeof attr === "object"){
			//获取
			for(var key in attr){
				obj.style[key] = attr[key];
			}
		}
	},
	
	//计算某一个元素到body边缘的距离
	//@param obj DOMObj 要计算的那个dom元素
	//@return object {left,top} 
	
	
	getBodyDis: function (obj){
		var left = 0, top = 0;
		//只要父级不是null
		while(obj.offsetParent != null){
			//加上边框的宽度和offset
			left += obj.offsetLeft + obj.offsetParent.clientLeft;
			top += obj.offsetTop + obj.offsetParent.clientTop;
			//把自己变成自己的父级（往前走一步）
			obj = obj.offsetParent;
		}
		return {
			"left": left,
			"top" : top
		};
	},
	
	
	//浏览器的宽与高 
	//@param    return  object{width,height}
	
   	getBody : function(){
   	   return {
   		   "width" : document.body.clientWidth || document.documentElement.clientWidth,
   		   "height" : document.documentElement.clientHeight || document.body.clientHeight
   	   };
   },
   
   //鼠标滚轮绑定事件
   //@param obj	DOMObj	绑定滚轮滚动事件的对象
   //@param fn	function	事件处理函数(回调函数)
  
	mousewheel : function(obj,fn){
		//谷歌里面onmousewheel有效，但还未绑定对象，值为null
		//下面判断要用不全等判断，否则都隐式转换为false
		console.log(obj.onmousewheel);
		if(obj.onmousewheel !== undefined){
			obj.onmousewheel = function(e){
				e = e || event;
				console.log(e.wheelDelta);
				if(e.wheelDelta < 0){
					//向下移动
					fn("down");
				}else{
					fn("up");
				}
			}
		}else{
			obj.addEventListener("DOMMouseScroll",function(e){
				e = e || event;
				if(e.detail > 0){
					//向下移动
					fn("down");
				}else{
					//向上移动
					fn("up");
				}
			})
		}	
	},
	
	//事件监听
	//@param   obj   DOMObj   要监听的对象
	//@param   type  string   事件句柄  
	//@param   fn    function 事件处理函数
	//@param   isCapture   boolean   false代表冒泡，true代表捕获，默认值为false.
	
	on:function(obj,type,fn,isCapture){
		//默认值为false
		if(isCapture === undefined) isCapture = false;
		if(obj.attachEvent){
			//IE只能在冒泡阶段处理
			obj.attachEvent("on"+type,fn);
		}else{
			obj.addEventListener(type,fn,isCapture);
		}
	},
	
	//移除事件监听
	//@param	obj		DOMObj		要移除监听事件的对象
	//@param	type	string		事件句柄
	//@param	fn		function	事件处理函数
	//@param   isCapture   boolean   false代表冒泡，true代表捕获，默认值为false.
	//监听事件的函数必须在外面封装不然删除函数取不到
	//冒泡与捕获的监听事件要分别删除
	
	off:function(obj,type,fn,isCapture){
		//默认值为false
		if(isCapture === undefined) isCapture = false;
		if(obj.detachEvent !== undefined){
			//针对IE
			obj.detachEvent("on"+type,fn);
		}else{
			obj.removeEventListener(type,fn,isCapture);
		}
	},
	
	
	//元素匀速运动
	//obj	DOMObj	运动的DOM元素
	//attr	string	运动的属性
	//end	number	终点值
	//duration	number	运动时间
	
	move : function(obj,attr,end,duration){
		//每次进来清除定时器
		clearInterval(obj.timer);
		//运动的起点
		var start = parseInt(this.getStyle(obj,attr));
		//运动的距离
		var distance = end - start;
		//运动速度
		var speed = distance/duration *30;
		console.log(speed);
		//定时器要唯一所以放在对象里面
		obj.timer = setInterval(function(){
			if(Math.abs(end - start) <= Math.abs(speed)){
				start = end;
				clearInterval(obj.timer);
			}else{
				//不能放在外面，不然最后一次直接变0
				start += speed;
			}
			console.log(start);
			obj.style[attr] = start + "px";
		},30)
	},
	
	//元素始终垂直居中,无论窗口大小如何
	//@param	obj		DOMObj		垂直居中的元素
	
	showCenter : function(obj){
		obj.style.position = "absolute";
		var _this = this;
		window.onresize = (function center(){
			//下面代码要先执行一遍
			//获取中点值
			var left = (_this.getBody().width - obj.offsetWidth)/2,
				top = (_this.getBody().height - obj.offsetHeight)/2;
			//设置
			_this.css(obj,{left: left +"px",top : top +"px"});
			return center;
		})();
		
		/* center();
		window.onresize = center; */
	},
	
	//cookie存取
	//@param	key		string		cookie名
	//@param	[value]	string		cookie值	可以不传
	//@param	[options]		DOMObj	{path:,expires:}	可以不传
	//利用参数判断是取cookie还是设置cookie
	
	cookie: function(key,value,options){
		//value可能传0，所以直接判断是否存在可能会出错
		if(value == undefined){
			//代表取cookie
			//先用"; "分割成数组，每一项代表一条cookie
			var arr = document.cookie.split("; ");
			var obj = {};
			arr.forEach(function(item){
				//再次用"="切割每一条cookie
				var arr1 = item.split("=");
				//存入obj对象中,注意解码
				obj[arr1[0]] = decodeURIComponent(arr1[1]);
			})
			return obj[key] ? obj[key] : "";
		}else{
			//代表储存cookie
			var str = key+"="+encodeURIComponent(value);
			//判断options是否存在
			if(options){
				if(options.path){
					str += ";path="+options.path;
				}
				if(options.expires){
					var date = new Date();
					date.setDate(date.getDate()+options.expires)
					str += ";expires="+date;
				}
			}
			document.cookie = str;
		}	
	},
	
	//ajaxGet
	//@param	url		string		请求地址
	//@param	[query]		DOMObj		请求的参数
	//@param	sucF	function	成功的执行函数
	//@param	loseF	function	失败的执行函数
	//@param	[isJson]	boolean		默认值为true,代表返回值为Json格式,false代表string格式
	
	ajaxGet : function(url,query,sucF,loseF,isJson){
		//GET方式，把query拼接到url上
		if(query){
			url += "?";
			for(var key in query){
				url += key+"="+query[key]+"&";
			}
			url = url.slice(0,-1);
		}
		//创建
		var ajax = new XMLHttpRequest();
		//连接
		ajax.open("GET",url,true)
		//发送
		ajax.send(null);
		//监听
		ajax.onreadystatechange = function(){
			if(ajax.readyState === 4){
				if(ajax.status === 200){
					//响应成功,执行成功的函数
					//isJson默认为true
					if(isJson === undefined) isJson = true;
					//判断是否为JSON格式
					var res = ajax.responseText;
					if(isJson) res = JSON.parse(ajax.responseText);
					//sucF存在才执行
					sucF && sucF(res);
				}else{
					//响应失败
					loseF && loseF();
				}
			}
		}
	},
	
	//ajaxPost
	//@param	url		string		请求地址
	//@param	[query]		DOMObj		请求参数
	//@param	sucF	function	成功的执行函数
	//@param	loseF	function	失败的执行函数
	//@param	[isJson]	boolean		默认值为true,代表返回值为Json格式,false代表string格式
	
	ajaxPost :function(url,query,sucF,loseF,isJson){
		//拼接query
		var info="";
		for(var key in query){
			info += key+"="+query[key]+"&";
		}
		info = info.slice(0,-1);
		//创建
		var ajax = new XMLHttpRequest();
		//连接
		ajax.open("POST",url,true);
		//设置请求头格式
		ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		//发送
		ajax.send(info);
		//监听
		ajax.onreadystatechange = function(){
			if(ajax.readyState === 4){
				if(ajax.status === 200){
					var res = ajax.responseText;
					//isJson默认值是true
					if(isJson === undefined) isJson = true;
					//处理是Json的情况
					if(isJson) res = JSON.parse(res);
					sucF && sucF(res);
				}else{
					loseF && loseF();
				}
			}
		}
	},
	
	//ajaxJsonp   跨域请求，只能处理get请求
	//@param	url		string		跨域请求地址
	//@param	callback	string		全局函数名
	//@param	[query]		DOMObj		请求参数
	
	ajaxJsonp : function(url,callback,query){
		//创建script标签
		var script = document.createElement("script");
		//拼接
		url += "?callback="+callback;
		if(query){
			for(var key in query){
				url += "&"+key+"="+query[key];
			}
		}
		//设置src路径
		script.src = url;
		//插入到body中，发送请求
		document.body.appendChild(script);
		//发送请求以后，马上删除
		script.remove();
	},
	
	//ajaxGetPromise	承诺版ajax
	//@param	url		string		请求地址
	//@param	query	DOMObj		请求参数
	//@param	[isJson]	boolean		默认值为true,代表返回值为Json格式,false代表string格式	
	
	ajaxGetPromise : function(url,query,isJson){
		//创建承诺
		return new Promise(function(resolve,reject){
			//GET方式，把query拼接到url上
			if(query){
				url += "?";
				for(var key in query){
					url += key+"="+query[key]+"&";
				}
				url = url.slice(0,-1);
			}
			//创建
			var ajax = new XMLHttpRequest();
			//连接
			ajax.open("GET",url,true)
			//发送
			ajax.send(null);
			//监听
			ajax.onreadystatechange = function(){
				if(ajax.readyState === 4){
					if(ajax.status === 200){
						//响应成功,执行成功的函数
						//isJson默认为true
						if(isJson === undefined) isJson = true;
						//判断是否为JSON格式
						var res = ajax.responseText;
						if(isJson) res = JSON.parse(ajax.responseText);
						//执行成功函数
						resolve(res);
					}else{
						//响应失败
						reject();
					}
				}
			}
		});
	}
}

