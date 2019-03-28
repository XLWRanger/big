<?php
    include("db.php");
    $username = $_POST["username"];
    $password = $_POST["password"];
    //判断是否存在
    $sql1 = "select * from users where username = '$username' and password = '$password'";
    $res1 = mysql_query($sql1);
    if(mysql_num_rows($res1) >=1){
        //重名
        echo json_encode(array("res_code" => 1,"res_info" => "登录成功"));
    }else{
        echo json_encode(array("res_code" => 0,"res_info" => "用户名或密码错误"));
    };
?>