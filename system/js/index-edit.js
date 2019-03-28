var tbody = document.querySelector("#tbody"),
	info = JSON.parse(localStorage.getItem("shoppingCar")) || [],//每次进入重新获取localStorage
	displayNum = document.querySelector("#number"),//购物车数字
	table = document.querySelector("#table-box");
//点击事件委托，只能绑定一个事件
tbody.onclick = function(e){
	e = e || event;
	var target = e.target || e.srcElement,
	    tr = target.parentNode.parentNode,
		id = tr.getAttribute("data-id"),
		info = JSON.parse(localStorage.getItem("shoppingCar")) || [],
		goodsname = tr.children[1].children[0].innerHTML,//不变可以直接取值
		goodsprice = tr.children[2].children[0].innerHTML*1,//不变可以直接取值
		goodsnum = tr.children[3].children[0].innerHTML*1,//不变可以直接取值
		number = tr.children[4].children[0],//变化，只能取节点元素
		obj = {
			"Id" : id,
			"goodsname" : goodsname,
			"goodsprice" : goodsprice,
			"goodsnum" : goodsnum,
			num : 1
		};
	//限制输入框的数量，不能超过，库存,同时若用户清空了，还应该恢复为0
	//bug通过选中更换时，不会验证？？？？
	//解决：在点击加入时验证
	number.onblur = function(){
		/* if(number.value > goodsnum){
			 number.value = goodsnum;
			 alert("库存不够了！");
		}
    */
		//删除输入框的数字，而又灭有输入时，则应该恢复到0
		if(number.value == "") number.value = 0;
	}
	//购物车添加----------------------------------------------------------
	if(target.className.includes("shoppingCar")){
		//先判断是否超过库存
		if(number.value > goodsnum){
			 number.value = goodsnum;
			 alert("库存不够了！");
		}
		//先获取判断是否有储存信息
		if(info){
			//存在，判断Id的是否相同，相同则数量加一，不相同就push进去
			var count;
			var res = info.some(function(item,index){
				count = index;
				return id == item.Id;
			})
			if(res){
				//存在相同，找到对应的商品信息，数量加一,同时还不能比库存大
				if(++info[count].num > goodsnum) info[count].num = goodsnum;
				number.value = info[count].num;
			}else{
				//没有相同的，重新push进去
				if(number.value) obj.num = number.value;
				//解决输入框为0时，点击加入购物车
				if(number.value == 0) obj.num = 1;
				info.push(obj);
			}
		}else{
			//解决用户先输入数量再加入购物车
			if(number.value) obj.num = number.value;
			//解决输入框为0时，点击加入购物车
			if(number.value == 0) obj.num = 1;
			info.push(obj);
		}
		//购物车的数量需要刷新
		displayNum.innerHTML = info.length;
		//最后存
		localStorage.setItem("shoppingCar",JSON.stringify(info));
	}
	
	//减--------------------------------------------------------------------------------
	if(target.className.includes("reduce")){
		//最少为0
		if(--number.value < 0) number.value = 0;
		//改localStorage
		for(var key in info){
			if(info[key].Id == id){
				if(--info[key].num <= 0){
					//数量为0时删除此条数据
					info.forEach(function(item,index){
						console.log(1);
						if(item.Id == id){
							info.splice(index,1);
						}
					})
					//购物车显示数量应该减一
					displayNum.innerHTML--;
				}
				//放在外面，重新储存
				localStorage.setItem("shoppingCar",JSON.stringify(info));
			}
		}
	}
	
	//加--------------------------------------------------------------------------------
	if(target.className.includes("add")){
		//限制输入框不能超过最大库存
		if(++number.value > goodsnum){
			 number.value = goodsnum;
			 alert("库存不够了！");
		}
		//限制存储不能超过最大库存
		for(var key in info){
			if(info[key].Id == id){
				if(++info[key].num > goodsnum)  info[key].num = goodsnum;
			}
		}
		localStorage.setItem("shoppingCar",JSON.stringify(info));
	}
}

