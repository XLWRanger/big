var before_login = document.querySelector("#before-login"),
    after_login = document.querySelector("#after-login"),
    exit = document.querySelector("#exit"),
    cookie = tools.cookie("username"),
    username = document.querySelector("#username");
console.log(cookie);
if(cookie){
    before_login.style.display = "none";
    after_login.style.display = "block";
    username.innerHTML = cookie;
};
exit.onclick = function(){
    tools.cookie("username","",{path:"/",expires:-1});
    //刷新当前页面
    // location.href = "./";
    before_login.style.display = "block";
    after_login.style.display = "none";
	//代表没登录
	document.body.innerHTML = "<h2 class='blank'><a href='html/index-login.html'>请先登录，客官！</a></h2>";
};

