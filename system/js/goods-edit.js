var tbody = document.querySelector("#tbody");

//事件委托-------------------------------------------------
tbody.onclick = function(e){
	    e = e || event;
	    var target = e.target || e.srcElement,
	        tr = target.parentNode.parentNode,
			span = Array.from(tr.querySelectorAll("span")),
			input = Array.from(tr.querySelectorAll("input")),
			id = tr.getAttribute("data-id"),
			goodsname = tr.children[1].children[0].innerHTML,
			goodsprice = tr.children[2].children[0].innerHTML*1,
			goodsnum = tr.children[3].children[0].innerHTML*1;
			
		//编辑--------------------------------
	    if(target.className.includes("editBtn")){
			tr.classList.add("edit");
			//span的值赋给input
			for(var i in span){
				input[i].value = span[i].innerHTML;
			}
	    };
		
		//删除-------------------------------------
		if(target.className.includes("delBtn")){
			if(confirm("确定要删除吗？")){
				tr.remove();
				//后台删除这条数据
				var id = tr.getAttribute("data-id");
				tools.ajaxGet("api/v1/goods-delete.php",{id},function(res){
					console.log(res.res_info);
				})
				//重新获取本页商品信息
				getGoodsInfo();
			}
		}
		
		//确认------------------------------------
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
					alert(res.res_info);
				}else{
					alert(res.res_info);
				}
			})
		}
		
		//取消---------------------------------
		if(target.className.includes("cancelBtn")){
			tr.classList.remove("edit");
		}
	}