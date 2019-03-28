<?php
    include("db.php");
	$id = $_GET["id"];
    //书写sql语句
    $sql = "delete from goods where Id=$id";
    //执行sql语句
    $res = mysql_query($sql);
    if($res){
        echo json_encode(array("res_code" => 1,"res_info" => "删除成功"));
    }else{
        echo json_encode(array("res_code" => 0,"res_info" => "网络错误"));
    };
?>