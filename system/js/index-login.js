var userInput = document.querySelector("#username"),
    passInput = document.querySelector("#password"),
    free_login = document.querySelector("#free-login"),
    btn = document.querySelector("#login");
btn.onclick = function(){
    var username = userInput.value,
        password = passInput.value;
    tools.ajaxPost("../api/v1/login.php",{username,password},function(res){               
        if(res.res_code){
            var option = {path:"/"};
            if(free_login.checked) option.expires = 10;
            tools.cookie("username",username,option);
            location.href = "../index.html";
        }else{
            alert(res.res_info);
        }
    })
}