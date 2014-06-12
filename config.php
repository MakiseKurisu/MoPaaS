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
		$SERVICE_ID = '10770';
		$DB_HOST = getenv("MOPAAS_MYSQL{$SERVICE_ID}_HOST");
		$DB_PORT = getenv("MOPAAS_MYSQL{$SERVICE_ID}_PORT");
		$DB_USER = getenv("MOPAAS_MYSQL{$SERVICE_ID}_USER");
		$DB_PASSWORD = getenv("MOPAAS_MYSQL{$SERVICE_ID}_PASSWORD");
		$DB_NAME = getenv("MOPAAS_MYSQL{$SERVICE_ID}_NAME");
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
		return new medoo(array(
			'database_type' => 'mysql',
			'server' => $GLOBALS['DB_HOST'],
			'port' => $GLOBALS['DB_PORT'],
			'username' => $GLOBALS['DB_USER'],
			'password' => $GLOBALS['DB_PASSWORD'],
			'database_name' => $GLOBALS['DB_NAME'],
		 
			'charset' => 'utf8',
		));
	}
?>