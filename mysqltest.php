<?php
 
/*替换为你自己的数据库名*/
$dbname = 'd8cee8633cd0949d7986a36d87b211565';
/*填入数据库连接信息*/
$host = '10.4.14.186';
$port = 3306;
$user = 'u5xsu1W8slnuT';//用户名
$pwd = 'ph1PEuGxGnrVR';//密码
 /*以上信息都可以在数据库管里页面查找到*/
 
/*接着调用mysql_connect()连接服务器*/
$link = @mysql_connect("{$host}:{$port}",$user,$pwd,true);
if(!$link) {
    die("Connect Server Failed: " . mysql_error());
}
/*连接成功后立即调用mysql_select_db()选中需要连接的数据库*/
if(!mysql_select_db($dbname,$link)) {
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