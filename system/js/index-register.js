var userInput = document.querySelector("#username"),
    pwdInput = document.querySelector("#password"),
    btn = document.querySelector("#register");
//绑定点击事件
btn.onclick = function(){
    var username = userInput.value;
    var password = pwdInput.value;
    //向后台发送数据
    tools.ajaxPost("../api/v1/register.php",{username,password},function(res){
        if(res.res_code){
            //注册成功
            if(confirm("注册成功，是否立即登录？"))
                location.href = "login.html";
        }else{
            alert(res.res_info);
        }
    })
}