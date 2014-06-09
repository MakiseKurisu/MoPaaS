<?php
	error_reporting(E_ALL);

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0");
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
	header("Pragma: no-cache");

	header("Content-Type: text/html;charset=utf-8"); 

	require_once('./config.php');
	require_once('./operation.php');
	require_once('./lib/medoo.min.php');

	$database = new medoo([
		'database_type' => 'mysql',
		'server' => $GLOBALS['DB_HOST'],
		'port' => $GLOBALS['DB_PORT'],
		'username' => $GLOBALS['DB_USER'],
		'password' => $GLOBALS['DB_PASSWORD'],
		'database_name' => $GLOBALS['DB_NAME'],
	 
		'charset' => 'utf8',
	]);

	/* Legacy code */
	$db = @mysql_connect("{$DB_HOST}:{$DB_PORT}", $DB_USER, $DB_PASSWORD, true);
	if (!$db)
	{
		die('Could not connect: ' . mysql_error());
	}
	mysql_query("set character set 'utf8'");
	mysql_query("set names 'utf8'");

	mysql_select_db($GLOBALS['DB_NAME'], $db);
	/* Legacy code */

	switch ($_REQUEST['command'])
	{
		case 'add':
		{
			add_data();
			break;
		}
		case 'search':
		{
			search_data();
			break;
		}
		case 'init':
		{
			init_data();
			break;
		}
		case 'clean':
		{
			clean_data();
			break;
		}
	}

	/* Legacy code */
	mysql_close($db);
	/* Legacy code */
?>