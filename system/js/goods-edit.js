var tbody = document.querySelector("#tbody"),
	info = JSON.parse(localStorage.getItem("shoppingCar")) || [],//保证每次重新进入首页localStora
	number = document.querySelector("#number");
	//事件委托
tbody.onclick = function(e){
	    e = e || event;
	    var target = e.target || e.srcElement,
	        tr = target.parentNode.parentNode,
			span = Array.from(tr.querySelectorAll("span")),
			input = Array.from(tr.querySelectorAll("input")),
			id = tr.getAttribute("data-id"),
			info = JSON.parse(localStorage.getItem("shoppingCar")) || [],
			goodsname = tr.children[1].children[0].innerHTML,
			goodsprice = tr.children[2].children[0].innerHTML*1,
			goodsnum = tr.children[3].children[0].innerHTML*1,
			obj = {
				"Id" : id,
				"goodsname" : goodsname,
				"goodsprice" : goodsprice,
				"goodsnum" : goodsnum,
				num : 1
			};
		//编辑
	    if(target.className.includes("editBtn")){
			tr.classList.add("edit");
			//span的值赋给input
			for(var i in span){
				input[i].value = span[i].innerHTML;
			}
	    };
		//删除
		if(target.className.includes("delBtn")){
			if(confirm("确定要删除吗？")){
				tr.remove();
				//后台删除这条数据
				var id = tr.getAttribute("data-id");
				tools.ajaxGet("api/v1/goods-delete.php",{id},function(res){
					console.log(res.res_info);
				})
				//修改localStorage储存
				info.forEach(function(item,index){
					console.log(1);
					if(item.Id == id){
						info.splice(index,1);
					}
				})
				localStorage.setItem("shoppingCar",JSON.stringify(info));
				//购物车的数量减一
				number.innerHTML--;
				//重新获取本页商品信息
				getGoodsInfo();
			}
		}
		//确认
		if(target.className.includes("okBtn")){
			tr.classList.remove("edit");
			var id = tr.getAttribute("data-id"),
				goodsname = input[0].value,
				goodsprice = input[1].value,
				goodsnum = input[2].value;
			//把数据传入后台
			tools.ajaxPost("api/v1/goods-edit.php",{id,goodsname,goodsprice,goodsnum},function(res){
				if(res.res_code){
					//编辑成功才把input的值赋给span
					for(var i in span){
						span[i].innerHTML = input[i].value;
					}
					//修改localStorage储存
					info.forEach(function(item){
						if(item.Id == id){
							console.log(1);
							item.goodsname = input[0].value;
							item.goodsprice = input[1].value*1;
							item.goodsnum = input[2].value*1;
						}
					})
					localStorage.setItem("shoppingCar",JSON.stringify(info));
					alert(res.res_info);
				}else{
					alert(res.res_info);
				}
			})
		}
		//取消
		if(target.className.includes("cancelBtn")){
			tr.classList.remove("edit");
		}
		//购物车添加
		if(target.className.includes("shoppingCar")){
			if(info.length != 0) info = JSON.parse(localStorage.getItem("shoppingCar"));
			//先获取判断是否有储存信息
			if(info){
				//存在，判断Id的是否相同，相同则数量加一，不相同就push进去
				var count;
				var res = info.some(function(item,index){
					count = index;
					return id == item.Id;
				})
				if(res){
					//存在相同，找到对应的商品信息，数量加一
					info[count].num++;
				}else{
					info.push(obj);
				}
			}else{
				console.log(info);
				info.push(obj);
			}
			//购物车的数量显示在页面上
			number.innerHTML = info.length;
			//最后存
			localStorage.setItem("shoppingCar",JSON.stringify(info));
		}
		
	}