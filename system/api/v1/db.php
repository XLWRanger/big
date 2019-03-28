<?php
	//数据库配置相关信息
	$config = array(
		"host" => "localhost",
		"user" => "root",
		"pwd" => "",
		"db" => "nidaye"
	);
	//连接服务器
	mysql_connect($config["host"],$config["user"],$config["pwd"]);
	//选择数据库
	mysql_select_db($config["db"]);
	//编码方式
	mysql_query("set charset 'utf8'");//从页面来
	mysql_query("set character set 'utf8'");//从页面来
?>