var before_login = document.querySelector("#before-login"),
    after_login = document.querySelector("#after-login"),
    exit = document.querySelector("#exit"),
    cookie = tools.cookie("username"),
    username = document.querySelector("#username");
if(cookie){
    before_login.style.display = "none";
    after_login.style.display = "block";
    username.innerHTML = cookie;
};
exit.onclick = function(){
    tools.cookie("usernam","",{path:"/",expires:-1});
    //刷新当前页面
    // location.href = "./";
    before_login.style.display = "block";
    after_login.style.display = "none";
};

