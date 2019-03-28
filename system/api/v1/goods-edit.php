<?php
    include("db.php");
	$id = $_POST["id"];
    $goodsname = $_POST["goodsname"];
    $goodsprice = $_POST["goodsprice"];
    $goodsnum = $_POST["goodsnum"];
    //书写sql语句
    $sql = "update goods set goodsname='$goodsname',goodsprice=$goodsprice,goodsnum=$goodsnum where Id=$id";
    //执行sql语句
    $res = mysql_query($sql);
    if($res){
        echo json_encode(array("res_code" => 1,"res_info" => "编辑成功"));
    }else{
        echo json_encode(array("res_code" => 0,"res_info" => "网络错误"));
    };
?>