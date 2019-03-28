<?php
    include("db.php");
    $index = $_GET["index"];
    //总共多少页
	$sqlP = "select * from goods";
	$totalPages = ceil(mysql_num_rows(mysql_query($sqlP)) / 6);
	if($index>$totalPages) $index = $totalPages;
	$start = ($index - 1) * 6;
    $sql = "select * from goods limit $start,6";
    $res = mysql_query($sql);
    $arr = array();
    while($rows = mysql_fetch_assoc($res)){
        //添加进去
        array_push($arr,$rows);
    };
    $sumArr = array(
        "res_code" => 1,
        "res_info" => "获取成功",
        "res_body" => array("data" =>$arr,"totalPages" =>$totalPages,"index" =>$index)
    );
    echo json_encode($sumArr);
?>