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
		$database = mysqli_connect(
			"{$GLOBALS['DB_HOST']}:{$GLOBALS['DB_PORT']}",
			$GLOBALS['DB_USER'],
			$GLOBALS['DB_PASSWORD']);
		if (mysqli_connect_errno())
		{
			$return['Code'] = 0;
			$return['Reason'] = '无法连接数据库: ' . mysqli_connect_error();
			die(json_encode($return));
		}
		mysqli_query($database, "set character set 'utf8'");
		mysqli_query($database, "set names 'utf8'");

		// Create the database
		if (!mysqli_query($database, "CREATE DATABASE {$GLOBALS['DB_NAME']}"))
		{
			if (mysqli_errno($database) != 1007)
			{
				$return['Code'] = 0;
				$return['Reason'] = '无法创建数据库: ' . mysqli_error($database);
				die(json_encode($return));
			}
		}

		// Close the connection
		mysqli_close($database);
	}

	function new_medoo()
	{
		return new medoo([
			'database_type' => 'mysql',
			'server' => $GLOBALS['DB_HOST'],
			'port' => $GLOBALS['DB_PORT'],
			'username' => $GLOBALS['DB_USER'],
			'password' => $GLOBALS['DB_PASSWORD'],
			'database_name' => $GLOBALS['DB_NAME'],
		 
			'charset' => 'utf8',
		]);
	}
?>