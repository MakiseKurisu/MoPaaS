<?php
	if ($_SERVER['SERVER_NAME'] == 'localhost')
	{
		$DB_HOST = 'localhost';
		$DB_PORT = 3306;
		$DB_USER = 'root';
		$DB_PASSWORD = 'password';
		$DB_NAME = 'SampleDB';
	}
	else
	{
		$DB_HOST = '10.4.14.186';
		$DB_PORT = 3306;
		$DB_USER = 'u5xsu1W8slnuT';
		$DB_PASSWORD = 'ph1PEuGxGnrVR';
		$DB_NAME = 'd8cee8633cd0949d7986a36d87b211565';
	}

	$DB_TABLE_NAME = 'SampleTable';

	// Just to make sure we have it
	create_database();

	function create_database()
	{
		// Connect to MySQL server
		$database = mysql_connect(
			"{$GLOBALS['DB_HOST']}:{$GLOBALS['DB_PORT']}",
			$GLOBALS['DB_USER'],
			$GLOBALS['DB_PASSWORD'],
			true);
		if (!$database)
		{
			$return['Code'] = 0;
			$return['Reason'] = '无法连接数据库: ' . mysql_error();
			die(json_encode($return));
		}
		mysql_query("set character set 'utf8'");
		mysql_query("set names 'utf8'");

		// Create the database
		if (!mysql_query("CREATE DATABASE {$GLOBALS['DB_NAME']}", $database))
		{
			if (mysql_errno() != 1007)
			{
				$return['Code'] = 0;
				$return['Reason'] = '无法创建数据库: ' . mysql_error();
				die(json_encode($return));
			}
		}

		// Close the connection
		mysql_close($database);
	}
?>