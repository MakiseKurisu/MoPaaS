var table = document.getElementById('result_table');

var enum_date = document.getElementById('enum_date');
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
var enum_comment = document.getElementById('enum_comment');

var EnumList = new Array();

EnumList[0] = {Name:'Status'};
EnumList[1] = {Name:'Bank'};
EnumList[2] = {Name:'Agent'};

EnumList[0].List = search_enum(0);
EnumList[1].List = search_enum(1);
EnumList[2].List = search_enum(2);

refresh_option();

var ResultList = new Array();

show_all();

clean_form();

function today_date()
{
	var date = new Date();
	var year = date.getFullYear().toString();
	var month = (date.getMonth() + 1).toString();
	var day = date.getDate().toString();

	var str=""; 
	for (i = 0; i < 2 - month.length; i++)
	{ 
		str += "0"; 
	} 
	month = str + month;

	var str=""; 
	for (i = 0; i < 2 - day.length; i++)
	{ 
		str += "0"; 
	} 
	day = str + day;

	return year + "-" + month + "-" + day;
}

function refresh_option()
{
	add_option('enum_status', EnumList[0]);
	add_option('enum_bank', EnumList[1]);
	add_option('enum_agent', EnumList[2]);
}

function add_option(name, object)
{
	console.log('Enter add_option');
	var select = document.getElementById(name);
	while (select.length > 1)
	{
		select.remove(1);
	}

	if ((typeof(object.List) != 'undefined') && object.List)
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
	status.className = 'col-md-10 col-md-offset-1 alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4)
		{
			switch (xmlhttp.status)
			{
				case 200:
				{
					console.log(xmlhttp.responseText);
					var json = JSON.parse(xmlhttp.responseText);
					console.log(json);
		            if (json.Code == 0)
		            {
		            	status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
						status.innerText = json.Reason;
		            }
		            else
		            {
		            	clean_form();
						show_all();
		            	status.className = 'col-md-10 col-md-offset-1 alert alert-success';
						status.innerText = '数据库已成功初始化';
		            }
		            break;
		        }
		        default:
		        {
					status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
					status.innerText = '连接失败';
					break;
				}
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
		status.className = 'col-md-10 col-md-offset-1 alert alert-warning';
		status.innerText = '对象名称不能为空';
		return;
	}

	status.className = 'col-md-10 col-md-offset-1 alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4)
		{
			switch (xmlhttp.status)
			{
				case 200:
				{
					console.log(xmlhttp.responseText);
					var json = JSON.parse(xmlhttp.responseText);
					console.log(json);
		            if (json.Code == 0)
		            {
		            	status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
						status.innerText = json.Reason;
		            }
		            else
		            {
		            	EnumList[i].List = search_enum(i);
		            	refresh_option();
		            	status.className = 'col-md-10 col-md-offset-1 alert alert-success';
						status.innerText = '已成功添加对象';
						enum_object.value = "";
		            }
		            break;
		        }
		        default:
		        {
					status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
					status.innerText = '连接失败';
					break;
				}
			}
        }
	};
	xmlhttp.open('POST','./backend.php?command=add',true);  
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var record = {table:EnumList[i].Name, data:{}};
	record.data.value = enum_object.value;
	console.log(record);
    xmlhttp.send(JSON.stringify(record));
}

function search_enum(i)
{
	console.log('Enter search_enum');
	var status = document.getElementById('status');
	status.className = 'col-md-10 col-md-offset-1 alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.open('POST','./backend.php?command=search',false);  
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var record = {table:EnumList[i].Name};
    xmlhttp.send(JSON.stringify(record));

    if (xmlhttp.readyState == 4)
	{
		switch (xmlhttp.status)
		{
			case 200:
			{
				console.log(xmlhttp.responseText);
				var json = JSON.parse(xmlhttp.responseText);
				console.log(json);
		        if (json.Code == 0)
		        {
		        	status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
					status.innerText = json.Reason;
					return null;
		        }
		        else
		        {
		        	status.className = 'col-md-10 col-md-offset-1 alert alert-success';
					status.innerText = '已成功检索对象';
					return json.Result;
		        }
		        break;
		    }
		    default:
		    {
				status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
				status.innerText = '连接失败';
				return null;
				break;
			}
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
	status.className = 'col-md-10 col-md-offset-1 alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.open('POST','./backend.php?command=search',false);  
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var record = {table:'sampletable'};
    xmlhttp.send(JSON.stringify(record));

    if (xmlhttp.readyState == 4)
	{
		switch (xmlhttp.status)
		{
			case 200:
			{
				console.log(xmlhttp.responseText);
				var json = JSON.parse(xmlhttp.responseText);
				console.log(json);
		        if (json.Code == 0)
		        {
		        	status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
					status.innerText = json.Reason;
		        }
		        else
		        {
		        	status.className = 'col-md-10 col-md-offset-1 alert alert-success';
					status.innerText = '已成功检索对象';
					ResultList = json.Result;
					if ((typeof(ResultList) != 'undefined') && ResultList)
					{
						for (var i = 0; i < ResultList.length; i++)
						{
							add_record(i);
						}
					}
		        }
		        break;
		    }
		    default:
		    {
				status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
				status.innerText = '连接失败';
				break;
			}
		}
    }
}

function add_record(i)
{
	console.log('Enter add_record');

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

	cell0.innerHTML = ResultList[i].ID;
	cell1.innerHTML = ResultList[i].Date;
	cell2.innerHTML = ResultList[i].SN;
	cell3.innerHTML = ResultList[i].Name1 + ' ' + ResultList[i].Name2 + ' ' + ResultList[i].Name3;
}

function add_to_database()
{
	console.log('Enter add_to_database');
	var status = document.getElementById('status');
	status.className = 'col-md-10 col-md-offset-1 alert alert-info';
	status.innerText = '正在发送请求...';

	xmlhttp = create_xmlhttp();
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4)
		{
			switch (xmlhttp.status)
			{
				case 200:
				{
					console.log(xmlhttp.responseText);
					var json = JSON.parse(xmlhttp.responseText);
					console.log(json);
		            if (json.Code == 0)
		            {
		            	status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
						status.innerText = json.Reason;
		            }
		            else
		            {
		            	show_all();
		            	clean_form();
		            	status.className = 'col-md-10 col-md-offset-1 alert alert-success';
						status.innerText = '已成功添加对象';
		            }
		            break;
				}
				default:
				{
					status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
					status.innerText = '连接失败';
					break;
				}
			}
			$('#addModal').modal('hide');
        }
	};
	xmlhttp.open('POST','./backend.php?command=add',true);  
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var record = {table:'sampletable', data:{}};

	if (enum_date.value == '')
	{
		status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
		status.innerText = '日期不能为空';
		return;
	}
	record.data.Date = enum_date.value;

	if (enum_sn.value == '')
	{
		status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
		status.innerText = '协议号不能为空';
		return;
	}
	record.data.SN = enum_sn.value;

	record.data.Name1 = enum_name1.value;
	record.data.Name2 = enum_name2.value;
	record.data.Name3 = enum_name3.value;

	if (enum_mobile.value == '')
	{
		status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
		status.innerText = '电话号码不能为空';
		return;
	}
	record.data.Mobile = enum_mobile.value;

	if (enum_personalid.value == '')
	{
		status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
		status.innerText = '身份证号不能为空';
		return;
	}
	record.data.PersonalID = enum_personalid.value;

	record.data.Status = enum_status.selectedIndex;
	record.data.Bank = enum_bank.selectedIndex;

	if (enum_cardnumber.value == '')
	{
		status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
		status.innerText = '卡号不能为空';
		return;
	}
	record.data.CardNumber = enum_cardnumber.value;

	if (enum_receipt.value == '')
	{
		status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
		status.innerText = '收据号码不能为空';
		return;
	}
	record.data.Receipt = enum_receipt.value;

	record.data.Agent = enum_agent.selectedIndex;
	record.data.Salesperson1 = enum_salesperson1.value;
	record.data.Salesperson2 = enum_salesperson2.value;
	record.data.Salesperson3 = enum_salesperson3.value;

	if (enum_roomnumber.value == '')
	{
		status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
		status.innerText = '选购房源不能为空';
		return;
	}
	record.data.RoomNumber = enum_roomnumber.value;

	if (enum_location.value == '')
	{
		status.className = 'col-md-10 col-md-offset-1 alert alert-danger';
		status.innerText = '来源区域不能为空';
		return;
	}
	record.data.Location = enum_location.value;

	record.data.Comment = enum_comment.value;

	console.log(record);
    xmlhttp.send(JSON.stringify(record));
}

function clean_form()
{
	enum_date.value = today_date();

	enum_sn.value = '';

	enum_name1.value = '';
	enum_name2.value = '';
	enum_name3.value = '';

	enum_mobile.value = '';

	enum_personalid.value = '';

	enum_status.selectedIndex = 0;
	enum_bank.selectedIndex = 0;

	enum_cardnumber.value = '';

	enum_receipt.value = ''

	enum_agent.selectedIndex = 0;
	enum_salesperson1.value = '';
	enum_salesperson2.value = '';
	enum_salesperson3.value = '';

	enum_roomnumber.value = '';

	enum_location.value = '';
	
	enum_comment.value = '';
}

function show_full_result(i)
{
	enum_date.value = ResultList[i].Date;

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
	enum_salesperson1.value = ResultList[i].Salesperson1;
	enum_salesperson2.value = ResultList[i].Salesperson2;
	enum_salesperson3.value = ResultList[i].Salesperson3;

	enum_roomnumber.value = ResultList[i].RoomNumber;

	enum_location.value = ResultList[i].Location;
	
	enum_comment.value = ResultList[i].Comment;
}