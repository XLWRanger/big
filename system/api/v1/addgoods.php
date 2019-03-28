<?php
    include("db.php");
    $goodsname = $_GET["goodsname"];
    $goodsprice = $_GET["goodsprice"];
    $goodsnum = $_GET["goodsnum"];
    //先判断是否有重复的
    $sql1 = "select * from goods where goodsname = '$goodsname'";
    $res1 = mysql_query($sql1);
    if(mysql_num_rows($res1) >=1){
        //重名
        echo json_encode(array("res_code" => 0,"res_info" => "商品名重复"));
    }else{
        //书写sql语句
        $sql = "insert into goods (goodsname,goodsprice,goodsnum) values ('$goodsname','$goodsprice','$goodsnum')";
        //执行sql语句
        $res = mysql_query($sql);
        if($res){
            echo json_encode(array("res_code" => 1,"res_info" => "录入成功"));
        }else{
            echo json_encode(array("res_code" => 0,"res_info" => "网络错误"));
        };
    };
?>