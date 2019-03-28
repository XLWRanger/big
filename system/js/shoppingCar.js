var tbody = document.querySelector("#tbody"),
	table = document.querySelector("#table"),
	index = 1,
	nextBtn = document.querySelector("#next"),
	pagination = document.querySelector("#pagination"),
	info = JSON.parse(localStorage.getItem("shoppingCar")) || [],
	checkAll = document.querySelector("#checkAll"),
	count = info.length,//默认全选
	totalMoney = document.querySelector("#totalMoney"),
	number = document.querySelector("#number");
//购物车的数量显示在页面上,第一次加载时
number.innerHTML = info.length;		
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
	for(let i=0;i<info.length;i++){
		str += `<tr data-id="${info[i].Id}" data-goodsnum ="${info[i].goodsnum}">
			<td><input type="checkbox" class="check" checked="checked"/></td>
			<td class="rank">${i+1}</td>
			<td><span>${info[i].goodsname}</span></td>
			<td><span class="goodsprice">${info[i].goodsprice}</span></td>
			<td>
				<span class="goodsnum">${info[i].num}</span>
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
}

//--------------------------------------------------------------------------------------------	
//商品信息的增删改
table.onclick = function(e){
	e = e || window.event;
	var target = e.target || e.srcElement,
		tr = target.parentNode.parentNode,
		id = tr.getAttribute("data-id")*1,
		checks = Array.from(tbody.querySelectorAll(".check"));//能保证
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
			//购物车里面的数字减一
			number.innerHTML--;
			//重新储存
			localStorage.setItem("shoppingCar",JSON.stringify(info));
			//变更编号，只需要把当前位置往后的所有商品的编号减一即可
			var ranks = tbody.querySelectorAll(".rank"),
				start = tr.children[1].innerHTML-1;//起始
			for(let i=start;i<ranks.length;i++){
				ranks[i].innerHTML--;
			}
		}
		var trAll = tbody.querySelectorAll("tr");
		//判断是否是空购物车
		if(trAll.length === 0) goodsInfo();
		total();
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
		//重新储存
		localStorage.setItem("shoppingCar",JSON.stringify(info));
		total();
	}
	//取消按钮
	if(target.className.includes("cancelBtn")){
		tr.className = "";
	}
	//减
	if(target.className.includes("reduce")){
		//最少为1
		if(--tr.children[4].children[0].innerHTML < 1) tr.children[4].children[0].innerHTML = 1;
		//改localStorage
		for(var key in info){
			if(info[key].Id == id){
				if(--info[key].num < 1){
					info[key].num = 1;
				}
				//放在外面，重新储存
				localStorage.setItem("shoppingCar",JSON.stringify(info));
			}
		}
		total();
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
		total();
	}
	// return false; 会阻止复选框的选中状态
	//全选
	if(target.id === "checkAll"){
		count = checkAll.checked ? info.length : 0;
		//购物车上面的数字
		number.innerHTML = checkAll.checked ? info.length : 0;	
		checks.forEach(function(item){
			item.checked = checkAll.checked;
		});
		total();
	}
	//单选
	if(target.className === "check"){
		count += target.checked ? 1 : -1;
		//购物车上面的数字
		number.innerHTML -= target.checked ? -1 : 1 ;	
		checkAll.checked = count === checks.length;
		total();
	}
}
//--------------------------------------------------------------------------------------------	
//计算总
total();
function total(){
	//利用储存计算总价
	//每次重新获取，方便计算
	checks = Array.from(tbody.querySelectorAll(".check"));
	var sum = 0;
	for(let item of checks){
		if(item.checked){
			var goodsprice = item.parentNode.parentNode.querySelector(".goodsprice").innerHTML,
				goodsnum = item.parentNode.parentNode.querySelector(".goodsnum").innerHTML;
			sum += goodsprice * goodsnum;//隐式转换
		}
		
	}
	totalMoney.innerHTML = sum;
}