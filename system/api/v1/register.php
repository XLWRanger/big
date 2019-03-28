<?php
    include("db.php");
    $username = $_POST["username"];
    $password = $_POST["password"];
    //先判断是否有重复的
    $sql1 = "select * from users where username = '$username'";
    $res1 = mysql_query($sql1);
    if(mysql_num_rows($res1) >=1){
        //重名
        echo json_encode(array("res_code" => 0,"res_info" => "用户名重复"));
    }else{
        //书写sql语句
        $sql = "insert into users (username,password) values ('$username','$password')";
        //执行sql语句
        $res = mysql_query($sql);
        if($res){
            echo json_encode(array("res_code" => 1,"res_info" => "注册成功"));
        }else{
            echo json_encode(array("res_code" => 0,"res_info" => "网络错误"));
        };
    };
?>