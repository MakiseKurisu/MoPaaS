var table = document.getElementById('result_table');

var enum_sn = document.getElementById('enum_sn');
var enum_name1 = document.getElementById('enum_name1');
var enum_name2 = document.getElementById('enum_name2');
var enum_name3 = document.getElementById('enum_name3');
var enum_mobile = document.getElementById('enum_mobile');
var enum_personalid = document.getElementById('enum_personalid');
var enum_status = document.getElementById('enum_status');
var enum_bank = document.getElementById('enum_bank');
var enum_cardnumber = document.getElementById('enum_cardnumber');
var enum_receipt = document.getElementById('enum_receipt');
var enum_agent = document.getElementById('enum_agent');
var enum_salesperson1 = document.getElementById('enum_salesperson1');
var enum_salesperson2 = document.getElementById('enum_salesperson2');
var enum_salesperson3 = document.getElementById('enum_salesperson3');
var enum_roomnumber = document.getElementById('enum_roomnumber');
var enum_location = document.getElementById('enum_location');

var EnumList = new Array();

EnumList[0] = {Name:'Status'};
EnumList[1] = {Name:'Bank'};
EnumList[2] = {Name:'Agent'};
EnumList[3] = {Name:'Salesperson'};

EnumList[0].List = search_enum(0);
EnumList[1].List = search_enum(1);
EnumList[2].List = search_enum(2);
EnumList[3].List = search_enum(3);

refresh_option();

var ResultList = new Array();

show_all();

function refresh_option()
{
	add_option('enum_status', EnumList[0]);
	add_option('enum_bank', EnumList[1]);
	add_option('enum_agent', EnumList[2]);
	add_option('enum_salesperson1', EnumList[3]);
	add_option('enum_salesperson2', EnumList[3]);
	add_option('enum_salesperson3', EnumList[3]);
}

function add_option(name, object)
{
	console.log('Enter add_option');
	var select = document.getElementById(name);
	while (select.length > 1)
	{
		select.remove(1);
	}

	if (typeof(object.List) != 'undefined')
	{
		for (var i = 0; i < object.List.length; i++)
		{
			var option = document.createElement("option");
			option.text = object.List[i].Value;
			select.add(option);
		}
	}
}

function create_xmlhttp()
{  
    var xmlHttp=null;

	try
	{
		// Firefox, Opera 8.0+, Safari
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		// Internet Explorer
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return xmlHttp;
}

function init_db()
{
	console.log('Enter init_db');

	var status = document.getElementById('status');
	status.className = 'alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{  
			console.log(xmlhttp.responseText);
			var json = JSON.parse(xmlhttp.responseText);
			console.log(json);
            if (json.Code == 0)
            {
            	status.className = 'alert alert-danger';
				status.innerText = json.Reason;
            }
            else
            {
            	clean_form();
				show_all();
            	status.className = 'alert alert-success';
				status.innerText = '数据库已成功初始化';
            }
        }
	};
	xmlhttp.open('POST','./backend.php?command=init',true);  
    xmlhttp.send();
}

function add_enum(i)
{
	console.log('Enter add_enum');
	var status = document.getElementById('status');
	var enum_object = document.getElementById('enum_object');

	if (enum_object.value == '')
	{
		status.className = 'alert alert-warning';
		status.innerText = '对象名称不能为空';
		return;
	}

	status.className = 'alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{  
			console.log(xmlhttp.responseText);
			var json = JSON.parse(xmlhttp.responseText);
			console.log(json);
            if (json.Code == 0)
            {
            	status.className = 'alert alert-danger';
				status.innerText = json.Reason;
            }
            else
            {
            	EnumList[i].List = search_enum(i);
            	refresh_option();
            	status.className = 'alert alert-success';
				status.innerText = '已成功添加对象';
				enum_object.value = "";


            }
        }
	};
	xmlhttp.open('POST','./backend.php?command=add',true);  
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var record = {table:EnumList[i].Name, value:"'" + enum_object.value + "'"};
    xmlhttp.send(JSON.stringify(record));
}

function search_enum(i)
{
	console.log('Enter search_enum');
	var status = document.getElementById('status');
	status.className = 'alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.open('POST','./backend.php?command=search',false);  
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var record = {table:EnumList[i].Name};
    xmlhttp.send(JSON.stringify(record));

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	{  
		console.log(xmlhttp.responseText);
		var json = JSON.parse(xmlhttp.responseText);
		console.log(json);
        if (json.Code == 0)
        {
        	status.className = 'alert alert-danger';
			status.innerText = json.Reason;
			return null;
        }
        else
        {
        	status.className = 'alert alert-success';
			status.innerText = '已成功检索对象';
			return json.Result;
        }
    }
}

function show_all()
{
	console.log('Enter show_all');

	while (table.rows.length > 1)
	{
		table.deleteRow(-1);
	}
	var status = document.getElementById('status');
	status.className = 'alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.open('POST','./backend.php?command=search',false);  
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var record = {table:'sampletable'};
    xmlhttp.send(JSON.stringify(record));

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	{  
		console.log(xmlhttp.responseText);
		var json = JSON.parse(xmlhttp.responseText);
		console.log(json);
        if (json.Code == 0)
        {
        	status.className = 'alert alert-danger';
			status.innerText = json.Reason;
        }
        else
        {
        	status.className = 'alert alert-success';
			status.innerText = '已成功检索对象';
			ResultList = json.Result;
			if (typeof(ResultList) != 'undefined')
			{
				for (var i = 0; i < ResultList.length; i++)
				{
					add_record(i);
				}
			}
        }
    }
}

function add_record(i)
{
	console.log('Enter show_all');
	console.log(table);

	var row = table.insertRow(-1);
	row.addEventListener("click",
	function() 
	{
    	show_full_result(i);
	}
	);

	var cell0 = row.insertCell(0);
	var cell1 = row.insertCell(1);
	var cell2 = row.insertCell(2);
	var cell3 = row.insertCell(3);
	var cell4 = row.insertCell(4);
	var cell5 = row.insertCell(5);

	cell0.innerHTML = ResultList[i].ID;
	cell1.innerHTML = ResultList[i].Date;
	cell2.innerHTML = ResultList[i].SN;
	cell3.innerHTML = ResultList[i].Name1;
	cell4.innerHTML = ResultList[i].Name2;
	cell5.innerHTML = ResultList[i].Name3;
}

function add_to_database()
{
	console.log('Enter add_to_database');
	var status = document.getElementById('status');
	status.className = 'alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{  
			console.log(xmlhttp.responseText);
			var json = JSON.parse(xmlhttp.responseText);
			console.log(json);
            if (json.Code == 0)
            {
            	status.className = 'alert alert-danger';
				status.innerText = json.Reason;
            }
            else
            {
            	status.className = 'alert alert-success';
				status.innerText = '已成功添加对象';
            }
        }
	};
	xmlhttp.open('POST','./backend.php?command=add',true);  
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var record = {table:'sampletable'};
	var date = new Date();
	record.Date = "'" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "'";

	if (enum_sn.value == null)
	{
		status.className = 'alert alert-danger';
		status.innerText = '协议号不能为空';
		return;
	}
	record.SN = enum_sn.value;

	record.Name1 = "'" + enum_name1.value + "'";
	record.Name2 = "'" + enum_name2.value + "'";
	record.Name3 = "'" + enum_name3.value + "'";

	if (enum_mobile.value == null)
	{
		status.className = 'alert alert-danger';
		status.innerText = '电话号码不能为空';
		return;
	}
	record.Mobile = "'" + enum_mobile.value + "'";

	if (enum_personalid.value == null)
	{
		status.className = 'alert alert-danger';
		status.innerText = '身份证号不能为空';
		return;
	}
	record.PersonalID = "'" + enum_personalid.value + "'";

	record.Status = enum_status.selectedIndex;
	record.Bank = enum_bank.selectedIndex;

	if (enum_cardnumber.value == null)
	{
		status.className = 'alert alert-danger';
		status.innerText = '卡号不能为空';
		return;
	}
	record.CardNumber = "'" + enum_cardnumber.value + "'";

	if (enum_receipt.value == null)
	{
		status.className = 'alert alert-danger';
		status.innerText = '收据号码不能为空';
		return;
	}
	record.Receipt = enum_receipt.value;

	record.Agent = enum_agent.selectedIndex;
	record.Salesperson1 = enum_salesperson1.selectedIndex;
	record.Salesperson2 = enum_salesperson2.selectedIndex;
	record.Salesperson3 = enum_salesperson3.selectedIndex;

	if (enum_roomnumber.value == null)
	{
		status.className = 'alert alert-danger';
		status.innerText = '选购房源不能为空';
		return;
	}
	record.RoomNumber = "'" + enum_roomnumber.value + "'";

	if (enum_location.value == null)
	{
		status.className = 'alert alert-danger';
		status.innerText = '来源区域不能为空';
		return;
	}
	record.Location = "'" + enum_location.value + "'";

	console.log(record);
    xmlhttp.send(JSON.stringify(record));
}

function clean_form()
{
	enum_sn.value = null;

	enum_name1.value = null;
	enum_name2.value = null;
	enum_name3.value = null;

	enum_mobile.value = null;

	enum_personalid.value = null;

	enum_status.selectedIndex = 0;
	enum_bank.selectedIndex = 0;

	enum_cardnumber.value = null;

	enum_receipt.value = null

	enum_agent.selectedIndex = 0;
	enum_salesperson1.selectedIndex = 0;
	enum_salesperson2.selectedIndex = 0;
	enum_salesperson3.selectedIndex = 0;

	enum_roomnumber.value = null;

	enum_location.value = null;
}

function show_full_result(i)
{
	enum_sn.value = ResultList[i].SN;

	enum_name1.value = ResultList[i].Name1;
	enum_name2.value = ResultList[i].Name2;
	enum_name3.value = ResultList[i].Name3;

	enum_mobile.value = ResultList[i].Mobile;

	enum_personalid.value = ResultList[i].PersonalID;

	enum_status.selectedIndex = ResultList[i].Status;
	enum_bank.selectedIndex = ResultList[i].Bank;

	enum_cardnumber.value = ResultList[i].CardNumber;

	enum_receipt.value = ResultList[i].Receipt;

	enum_agent.selectedIndex = ResultList[i].Agent;
	enum_salesperson1.selectedIndex = ResultList[i].Salesperson1;
	enum_salesperson2.selectedIndex = ResultList[i].Salesperson2;
	enum_salesperson3.selectedIndex = ResultList[i].Salesperson3;

	enum_roomnumber.value = ResultList[i].RoomNumber;

	enum_location.value = ResultList[i].Location;
}