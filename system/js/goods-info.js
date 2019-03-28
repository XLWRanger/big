var nameInput = document.querySelector("#goodsName"),
    priceInput = document.querySelector("#goodsPrice"),
    numInput = document.querySelector("#goodsNum"),
    saveBtn = document.querySelector("#save"),
    addGoodsModal = document.querySelector("#myModal"),
		index = 1,//记录当前处于哪一页
		totalPages,//从后台得到总共有几页
		nextBtn = document.querySelector("#next"),
		pagination = document.querySelector("#pagination"),
		cookie = tools.cookie("admin");

//登录了以后，页面才加载数据------------------------------------------------
if(cookie){
	//代表登陆了
	getGoodsInfo();
}else{
	//代表没登录
	document.body.innerHTML = "<h2 class='blank'><a href='admin-login.html'>请先登录，客官！</a></h2>";
}
function getGoodsInfo(){
  tools.ajaxGet("../api/v1/get-info.php",{index},function(res){
    var tbody = document.querySelector("#tbody");
    //得到商品信息
    var data = res.res_body.data;
		totalPages = res.res_body.totalPages*1;
		index = res.res_body.index - 0;//得到的是字符串，需要转换为数字
    var str = "";
    data.forEach(function(item,j){
        str += `<tr data-id="${item.Id}">
        <td>${(index-1)*6+j+1}</td>
        <td><span>${item.goodsname}</span><input type="text" /></td>
        <td><span>${item.goodsprice}</span><input type="text" /></td>
        <td><span>${item.goodsnum}</span><input type="text" /></td>
        <td>
          <button type="button" class="btn btn-primary btn-xs editBtn">
            编辑
          </button>
          <button type="button" class="btn btn-primary btn-xs delBtn">
            删除
          </button>
          <button type="button" class="btn btn-primary btn-xs okBtn">
            确认
          </button>
          <button type="button" class="btn btn-primary btn-xs cancelBtn">
            取消
          </button>
        </td>
      </tr>`;
    });
    tbody.innerHTML = str;//这种方法会覆盖因此不用每次重新生成时，需要删除上一次生成的
		
		//分页动态插入-----------------------------------------------------------
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
  });
};

//添加商品----------------------------------------------------------------------
saveBtn.onclick = function(){
  var goodsname = nameInput.value,
      goodsprice = priceInput.value,
      goodsnum = numInput.value;
  console.log(goodsname,goodsprice,goodsnum);
  tools.ajaxGet("api/v1/addgoods.php",{goodsname,goodsprice,goodsnum},function(res){
    if(res.res_code){
      //商品添加成功
      alert(res.res_info);
      $('#myModal').modal('hide');
      nameInput.value = priceInput.value = numInput.value = "";
      getGoodsInfo();
    }else{
      alert(res.res_info);
    }
  })
}

//分页切换点击事件，事件源不确定，采用事件委托---------------------------------------------------
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