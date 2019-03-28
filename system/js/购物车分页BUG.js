var tbody = document.querySelector("#tbody"),
	table = document.querySelector("#table"),
	index = 1,
	nextBtn = document.querySelector("#next"),
	pagination = document.querySelector("#pagination"),
	info = JSON.parse(localStorage.getItem("shoppingCar")),
	totalPages,
	checkAll = document.querySelector("#checkAll"),
	checks,//页面刚开始加载时，因为执行顺序的原因并没有
	count = 0;
	//判断是否为空购物车
	
	
//--------------------------------------------------------------------------------------------	
goodsInfo();
//获取购物车商品信息
function goodsInfo(){
	info = JSON.parse(localStorage.getItem("shoppingCar"));
	// console.log([] == []);//引用类型false
	if(info.length == 0){
		document.body.innerHTML = "<h2 class='blank'>购物车为空快,快去购买吧！</h2>";
		return;
	}
	var	str = "";
	//判断是否为最后一页
	totalPages = Math.ceil(info.length/6);
	var limit = index < totalPages ?
			6*index :
			6*(index-1)+ (info.length%6 != 0 ? info.length%6 : 6) ;//特殊情况当info.length刚好被6整除
	for(let i=(index-1)*6;i<limit;i++){
		str += `<tr data-id="${info[i].Id}" data-goodsnum ="${info[i].goodsnum}">
			<td><input type="checkbox" class="check"/></td>
			<td>${i+1}</td>
			<td><span>${info[i].goodsname}</span></td>
			<td><span>${info[i].goodsprice}</span></td>
			<td>
				<span>${info[i].num}</span>
				<input type="text">
				<span class="glyphicon glyphicon-triangle-top reduce" aria-hidden="true"></span>
				<span class="glyphicon glyphicon-triangle-bottom add" aria-hidden="true"></span>
				<button type="button" class="btn btn-primary btn-xs editBtn">
				  编辑
				</button>
				<button type="button" class="btn btn-primary btn-xs delBtn">
				  删除
				</button>
				<button type="button" class="btn btn-primary btn-xs okBtn">
				  确定
				</button>
				<button type="button" class="btn btn-primary btn-xs cancelBtn">
				  取消
				</button>
			</td>
		</tr>`;
	}
	tbody.innerHTML = str;
	//分页动态插入
	//先删除上一次的
	Array.from(document.querySelectorAll(".page")).forEach(function(item){
			item.remove();
	})
	for(var i=1;i<=totalPages;i++){
		var li = document.createElement("li");
		li.innerHTML = "<a class='page' href='javascript:;'>"+i+"</a>";
		li.className = i === index ? "active" : "";
		pagination.insertBefore(li,nextBtn);
	}
}

//--------------------------------------------------------------------------------------------	
//商品信息的增删改
table.onclick = function(e){
	e = e || window.event;
	var target = e.target || e.srcElement,
		tr = target.parentNode.parentNode,
		id = tr.getAttribute("data-id")*1;
	//span点击事件
	//编辑按钮
	if(target.className.includes("editBtn")){
		tr.className = "edit";
		//span赋值给input框
		tr.children[4].children[1].value = tr.children[4].children[0].innerHTML;
	}
	//删除当前行
	if(target.className.includes("delBtn")){
		//删除当前行
		if(confirm("确定要删除吗？")){
			tr.remove();
			//删除储存里面的东西
			for(var key in info){
				if(info[key].Id == id){
					info.splice(key,1);
				}
			}
			//当删除当前页的第一个时，index应该减一
			if(info.length%6 == 0){
				if(--index < 1) index = 1;
			}
			localStorage.setItem("shoppingCar",JSON.stringify(info));
			//重新获取本页商品信息
			goodsInfo();
		}
	}
	//确认按钮
	if(target.className.includes("okBtn")){
		tr.className = "";
		//input赋值给span
		tr.children[4].children[0].innerHTML = tr.children[4].children[1].value;
		for(var key in info){
			if(info[key].Id == id){
				info[key].num = tr.children[4].children[0].innerHTML*1;
			}
		}
		//存localStorage
		localStorage.setItem("shoppingCar",JSON.stringify(info));
		//重新获取本页商品信息
		goodsInfo();
	}
	//取消按钮
	if(target.className.includes("cancelBtn")){
		tr.className = "";
	}
	//减
	if(target.className.includes("reduce")){
		//最少为零
		if(--tr.children[4].children[0].innerHTML < 0)
			tr.children[4].children[0].innerHTML = 0;
		//改localStorage
		for(var key in info){
			if(info[key].Id == id){
				if(--info[key].num < 0){
					info[key].num = 0;
					//删除当前行
					if(confirm("确定要删除吗？")){
						tr.remove();
						//删除储存里面的东西
						for(var key in info){
							if(info[key].Id == id){
								info.splice(key,1);
							}
						}
						//当删除当前页的第一个时，index应该减一
						if(info.length%6 == 0){
							if(--index < 1) index = 1;
						}
						localStorage.setItem("shoppingCar",JSON.stringify(info));
						//重新获取本页商品信息
						goodsInfo();
					}
				}
			}
		}
		//存localStorage
		localStorage.setItem("shoppingCar",JSON.stringify(info));
		//重新获取本页商品信息
		goodsInfo();
	}
	//加
	if(target.className.includes("add")){
		//最大为库存数量
		var goodsnum = tr.getAttribute("data-goodsnum");
		if(++tr.children[4].children[0].innerHTML > goodsnum){
			 tr.children[4].children[0].innerHTML = goodsnum;
			 alert("库存不够了！");
		}
		for(var key in info){
			if(info[key].Id == id){
				if(++info[key].num > goodsnum)  info[key].num = goodsnum;
			}
		}
		localStorage.setItem("shoppingCar",JSON.stringify(info));
		//重新获取本页商品信息
		goodsInfo();
	}
	// return false; 会阻止复选框的选中状态
	//全选
	if(target.id === "checkAll"){
		count = checkAll.checked ? 4 : 0;
		checks = Array.from(tbody.querySelectorAll(".check"));
		checks.forEach(function(item){
			item.checked = checkAll.checked;
		});
	}
}
//--------------------------------------------------------------------------------------------	
//分页切换点击事件，事件源不确定，采用事件委托
pagination.onclick = function(e){
	e = e || window.event;
	var target = e.target || e.srcElement;
	switch (target.className){
		case "page":
			index = target.innerHTML*1;//转数字
			goodsInfo();//重新获取本页商品信息
			break;
		case "prev":
			//如果已经位于第一页，则直接结束函数，否则才去重新获取本页商品信息
			if(--index<1){
				index = 1;
				return;//直接退出点击事件
			};
			goodsInfo();//重新获取本页商品信息
			break;
		case "next":
		  //如果已经位于最后一页，则直接结束函数,否则才去重新获取本页商品信息
		  
			if(++index > totalPages){
				index = totalPages;
				return;//直接退出点击事件
			};
			goodsInfo();//重新获取本页商品信息
	}
}

//--------------------------------------------------------------------------------------------	
//计算总
function total(){
	
}