<?php

require_once('./config.php');
 
/*调用mysql_connect()连接服务器*/
$link = @mysql_connect($DB_HOST,$DB_USER,$DB_PASSWORD,true);
if(!$link) {
    die("Connect Server Failed: " . mysql_error());
}
/*连接成功后立即调用mysql_select_db()选中需要连接的数据库*/
if(!mysql_select_db($DB_NAME,$link)) {
    die("Select Database Failed: " . mysql_error($link));
}
 
/*至此连接已完全建立，就可对当前数据库进行相应的操作了*/
//创建一个数据库表
$sql = "create table if not exists test_mysql(
        id int primary key auto_increment,
        no int, 
        name varchar(1024),
        key idx_no(no))";
$ret = mysql_query($sql, $link);
if ($ret === false) {
    die("Create Table Failed: " . mysql_error($link));
} else {
    echo "Create Table Succeed<br />";
}   
 
 
/*显式关闭连接，非必须*/
mysql_close($link);
?>