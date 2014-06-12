<?php
	function save_data()
	{
		$json = json_decode(file_get_contents("php://input"));

		if (property_exists($json->{'data'}, 'ID'))
		{
			$id = $json->{'data'}->{'ID'};
			unset($json->{'data'}->{'ID'});
			$return['Result'] = $GLOBALS['database']->update($json->{'table'}, (array) $json->{'data'}, array("ID" => $id));
		}
		else
		{
			$return['Result'] = $GLOBALS['database']->insert($json->{'table'}, (array) $json->{'data'});
		}
		if (!$return['Result'])
		{
			$error = $GLOBALS['database']->error();
			$return['Reason'] = $error[2];
		}
		$return['Code'] = 1;
		echo(json_encode($return));
	}

	function search_data()
	{
		$json = json_decode(file_get_contents("php://input"));

		$return['Result'] = $GLOBALS['database']->select($json->{'table'}, '*');
		$return['Code'] = 1;
		echo(json_encode($return));
	}

	function init_data()
	{
		// Clean data
		$sql = "DROP DATABASE {$GLOBALS['DB_NAME']}";

		if (!$GLOBALS['database']->query($sql))
		{
			$return['Code'] = 0;
			$error = $GLOBALS['database']->error();
			$return['Reason'] = "无法删除数据库: {$error[2]}";
			echo(json_encode($return));
			return;
		}

		// Create database and connection
		create_database();
		$GLOBALS['database'] = new_medoo();

		$sql = "CREATE TABLE {$GLOBALS['DB_TABLE_NAME']}
		(
		ID int NOT NULL AUTO_INCREMENT, 
		PRIMARY KEY(ID),
		Date date,
		SN bigint,
		Name1 varchar(32),
		Name2 varchar(32),
		Name3 varchar(32),
		Mobile bigint,
		Phone bigint,
		PersonalID bigint,
		Status int,
		Bank int,
		CardNumber1 int,
		CardNumber2 int,
		Receipt bigint,
		Agent int,
		Salesperson1 varchar(32),
		Salesperson2 varchar(32),
		Salesperson3 varchar(32),
		RoomNumber varchar(32),
		Location varchar(32),
		Comment varchar(128)
		)
		CHARACTER SET utf8
		COLLATE utf8_general_ci";
		
		if (!$GLOBALS['database']->query($sql))
		{
			$return['Code'] = 0;
			$error = $GLOBALS['database']->error();
			$return['Reason'] = "无法创建主表: {$error[2]}";
			echo(json_encode($return));
			return;
		}

		// Status table
		$sql = 'CREATE TABLE Status
		(
		ID int NOT NULL AUTO_INCREMENT, 
		PRIMARY KEY(ID),
		Value varchar(32)
		)
		CHARACTER SET utf8
		COLLATE utf8_general_ci';
		
		if (!$GLOBALS['database']->query($sql))
		{
			$return['Code'] = 0;
			$error = $GLOBALS['database']->error();
			$return['Reason'] = "无法创建Status表: {$error[2]}";
			echo(json_encode($return));
			return;
		}

		// Bank table
		$sql = 'CREATE TABLE Bank
		(
		ID int NOT NULL AUTO_INCREMENT, 
		PRIMARY KEY(ID),
		Value varchar(32)
		)
		CHARACTER SET utf8
		COLLATE utf8_general_ci';
		
		if (!$GLOBALS['database']->query($sql))
		{
			$return['Code'] = 0;
			$error = $GLOBALS['database']->error();
			$return['Reason'] = "无法创建Bank表: {$error[2]}";
			echo(json_encode($return));
			return;
		}

		// Agent table
		$sql = 'CREATE TABLE Agent
		(
		ID int NOT NULL AUTO_INCREMENT, 
		PRIMARY KEY(ID),
		Value varchar(32)
		)
		CHARACTER SET utf8
		COLLATE utf8_general_ci';
		
		if (!$GLOBALS['database']->query($sql))
		{
			$return['Code'] = 0;
			$error = $GLOBALS['database']->error();
			$return['Reason'] = "无法创建Agent表: {$error[2]}";
			echo(json_encode($return));
			return;
		}

		$return['Code'] = 1;
		echo(json_encode($return));
	}
?>