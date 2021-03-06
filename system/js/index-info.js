var nameInput = document.querySelector("#goodsName"),
    priceInput = document.querySelector("#goodsPrice"),
    numInput = document.querySelector("#goodsNum"),
    saveBtn = document.querySelector("#save"),
    addGoodsModal = document.querySelector("#myModal"),
	index = 1,//记录当前处于哪一页
	totalPages,//从后台得到总共有几页
	nextBtn = document.querySelector("#next"),
	pagination = document.querySelector("#pagination"),
	displayNum = document.querySelector("#number"),	//购物车上面的数字
	cookie = tools.cookie("username");
	
//登录了以后，页面才加载数据------------------------------------------------
if(cookie){
	//代表登陆了
	getGoodsInfo();
}else{
	//代表没登录
	console.log(1);
	document.body.innerHTML = "<h2 class='blank'><a href='html/index-login.html'>请先登录，客官！</a></h2>";
}
function getGoodsInfo(){
  tools.ajaxGet("api/v1/get-info.php",{index},function(res){
    var tbody = document.querySelector("#tbody"),
	info = JSON.parse(localStorage.getItem("shoppingCar")) || [];
	//购物车的数量显示在页面上,第一次加载时
	displayNum.innerHTML = info.length;	
    //得到商品信息
    var data = res.res_body.data;
		totalPages = res.res_body.totalPages*1;
		index = res.res_body.index - 0;//得到的是字符串，需要转换为数字
    var str = "";
    data.forEach(function(item,j){
        str += `<tr data-id="${item.Id}" data-num="${item.goodsnum}">
        <td>${(index-1)*6+j+1}</td>
        <td><span>${item.goodsname}</span></td>
        <td><span>${item.goodsprice}</span></td>
        <td><span>${item.goodsnum}</span></td>
				<td class="qw">
					<input type="text" value="0" class="free-num">
					<span class="glyphicon glyphicon-triangle-top reduce" aria-hidden="true"></span>
					<span class="glyphicon glyphicon-triangle-bottom add" aria-hidden="true"></span></td>
        <td>
					<button type="button" class="btn btn-success btn-xs shoppingCar">
					  加入购物车
					</button>
      </tr>`;
    });
	//这种方法会覆盖因此不用每次重新生成时，需要删除上一次生成的
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
	
	//用本地存储渲染已选的数量,上面有ajax异步，所以下面代码会先执行，得到[]
	//所以也放在ajax里面
	var trAll = Array.from(tbody.children);
	for(let item of trAll){
		for(let item1 of info){
			if(item.getAttribute("data-id") == item1.Id)
				item.children[4].children[0].value = item1.num;
		}
	}
  });
};

//分页切换点击事件，事件源不确定，采用事件委托----------------------------------------------
pagination.onclick = function(e){
	e = e || window.event;
	var target = e.target || e.srcElement;
	switch (target.className){
		case "page":
			index = target.innerHTML*1;//转数字
			getGoodsInfo();//重新获取本页商品信息
			break;
		case "prev":
			//如果已经位于第一页，则直接结束函数，否则才去重新获取本页商品信息
			if(--index<1){
				index = 1;
				return;//直接退出点击事件
			};
			getGoodsInfo();//重新获取本页商品信息
			break;
		case "next":
		  //如果已经位于最后一页，则直接结束函数,否则才去重新获取本页商品信息
			if(++index > totalPages){
				index = totalPages;
				return;//直接退出点击事件
			};
			getGoodsInfo();//重新获取本页商品信息
	}
}