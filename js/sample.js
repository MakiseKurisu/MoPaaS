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


var filter_field = document.getElementById('filter_field');
var filter_condition = document.getElementById('filter_condition');
var filter_value = document.getElementById('filter_value');
var filter_switch = document.getElementById('filter_switch');
var filter_list = document.getElementById('filter_list');

var EnumList = new Array();

EnumList[0] = {Name:'Status'};
EnumList[1] = {Name:'Bank'};
EnumList[2] = {Name:'Agent'};

EnumList[0].List = search_enum(0);
EnumList[1].List = search_enum(1);
EnumList[2].List = search_enum(2);

refresh_option();

var DataList = new Array();

var FilterList = new Array();

var ResultList = new Array();

show_all();

clean_form();

function selectedText(select)
{
	return select.options[select.selectedIndex].text
}

function optionText(select, i)
{
	return i < 0 ? '' : select.options[i].text
}

function selectedValue(select)
{
	return select.options[select.selectedIndex].value
}

function optionValue(select, i)
{
	return i < 0 ? '' : select.options[i].value
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
	var select = document.getElementById(name);
	while (select.length)
	{
		select.remove(0);
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

function init_db()
{
	var status = document.getElementById('status');
	status.className = 'alert alert-info';
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
		            if (json.Code == 0)
		            {
		            	status.className = 'alert alert-danger';
						status.innerText = json.Reason;
		            }
		            else
		            {
		            	status.className = 'alert alert-success';
						status.innerText = '数据库已成功初始化';
						location.reload();
		            }
		            break;
		        }
		        default:
		        {
					status.className = 'alert alert-danger';
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
		if (xmlhttp.readyState == 4)
		{
			switch (xmlhttp.status)
			{
				case 200:
				{
					console.log(xmlhttp.responseText);
					var json = JSON.parse(xmlhttp.responseText);
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
		            break;
		        }
		        default:
		        {
					status.className = 'alert alert-danger';
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
    xmlhttp.send(JSON.stringify(record));
}

function search_enum(i)
{
	var status = document.getElementById('status');
	status.className = 'alert alert-info';
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
		        break;
		    }
		    default:
		    {
				status.className = 'alert alert-danger';
				status.innerText = '连接失败';
				return null;
				break;
			}
		}
    }
}

function show_all()
{
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

    if (xmlhttp.readyState == 4)
	{
		switch (xmlhttp.status)
		{
			case 200:
			{
				console.log(xmlhttp.responseText);
				var json = JSON.parse(xmlhttp.responseText);
		        if (json.Code == 0)
		        {
		        	status.className = 'alert alert-danger';
					status.innerText = json.Reason;
		        }
		        else
		        {
		        	status.className = 'alert alert-success';
					status.innerText = '已成功检索对象';
					DataList = json.Result;

					if ((typeof(DataList) != 'undefined') && DataList)
					{
						apply_filter();
					}

					if ((typeof(ResultList) != 'undefined') && ResultList)
					{
						for (index in ResultList)
						{
							add_record(index);
						}
					}
		        }
		        break;
		    }
		    default:
		    {
				status.className = 'alert alert-danger';
				status.innerText = '连接失败';
				break;
			}
		}
    }
}

function add_record(i)
{
	var row = table.insertRow(-1);

	var cell = new Array();
	cell[0] = row.insertCell(0);
	cell[1] = row.insertCell(1);
	cell[2] = row.insertCell(2);
	cell[3] = row.insertCell(3);
	cell[4] = row.insertCell(4);
	cell[5] = row.insertCell(5);
	cell[6] = row.insertCell(6);

	cell[0].innerHTML = ResultList[i].ID;
	cell[1].innerHTML = ResultList[i].Date;
	cell[2].innerHTML = ResultList[i].SN;
	cell[3].innerHTML = ResultList[i].Name1 + ' ' + ResultList[i].Name2 + ' ' + ResultList[i].Name3;
	cell[4].innerHTML = ResultList[i].Mobile;
	cell[5].innerHTML = optionText(enum_status, ResultList[i].Status);
	cell[6].innerHTML = '<button type="button" class="btn btn-info" onclick="show_full_result(' + i + ');">详细</button>';
}

function add_to_database()
{
	var status = document.getElementById('status');
	status.className = 'alert alert-info';
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
		            if (json.Code == 0)
		            {
		            	status.className = 'alert alert-danger';
						status.innerText = json.Reason;
		            }
		            else
		            {
		            	show_all();
		            	clean_form();
		            	status.className = 'alert alert-success';
						status.innerText = '已成功添加对象';
		            }
		            break;
				}
				default:
				{
					status.className = 'alert alert-danger';
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
		status.className = 'alert alert-danger';
		status.innerText = '日期不能为空';
		return;
	}
	record.data.Date = enum_date.value;

	if (enum_sn.value == '')
	{
		status.className = 'alert alert-danger';
		status.innerText = '协议号不能为空';
		return;
	}
	record.data.SN = enum_sn.value;

	record.data.Name1 = enum_name1.value;
	record.data.Name2 = enum_name2.value;
	record.data.Name3 = enum_name3.value;

	if (enum_mobile.value == '')
	{
		status.className = 'alert alert-danger';
		status.innerText = '电话号码不能为空';
		return;
	}
	record.data.Mobile = enum_mobile.value;

	if (enum_personalid.value == '')
	{
		status.className = 'alert alert-danger';
		status.innerText = '身份证号不能为空';
		return;
	}
	record.data.PersonalID = enum_personalid.value;

	record.data.Status = enum_status.selectedIndex;
	record.data.Bank = enum_bank.selectedIndex;

	if (enum_cardnumber.value == '')
	{
		status.className = 'alert alert-danger';
		status.innerText = '卡号不能为空';
		return;
	}
	record.data.CardNumber = enum_cardnumber.value;

	if (enum_receipt.value == '')
	{
		status.className = 'alert alert-danger';
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
		status.className = 'alert alert-danger';
		status.innerText = '选购房源不能为空';
		return;
	}
	record.data.RoomNumber = enum_roomnumber.value;

	if (enum_location.value == '')
	{
		status.className = 'alert alert-danger';
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

	$('#addModal').modal('show')
}

function add_filter()
{
	var index = FilterList.length;
	FilterList[index] = {};
	FilterList[index].Field = selectedValue(filter_field);
	FilterList[index].Condition = selectedValue(filter_condition);
	FilterList[index].Value = filter_value.value;
	FilterList[index].Show = selectedValue(filter_switch);

	var new_filter = '';
	new_filter += '<div class="col-md-3 alert alert-info alert-dismissable">';
	new_filter += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true" onclick="remove_filter(' + index + ');">&times;</button>';
	new_filter += '当' + selectedText(filter_field) + selectedText(filter_condition) + filter_value.value + '时' + selectedText(filter_switch);
	new_filter += '</div>';
	filter_list.innerHTML += new_filter;

	show_all();
}

function remove_filter(index)
{
	delete FilterList[index];
	show_all();
}

function apply_filter()
{
	ResultList = DataList;
	for(i in FilterList)
	{
		for(j in ResultList)
		{
			var value = ResultList[j][FilterList[i].Field];
			switch (FilterList[i].Condition)
			{
				case 'GTR':
				{
					if (value > FilterList[i].Value)
					{
						if (!FilterList[i].Show)
						{
							delete ResultList[j];
						}
					}
					else if (FilterList[i].Show)
					{
						delete ResultList[j];
					}
					break;
				}
				case 'EQU':
				{
					if (value == FilterList[i].Value)
					{
						if (!FilterList[i].Show)
						{
							delete ResultList[j];
						}
					}
					else if (FilterList[i].Show)
					{
						delete ResultList[j];
					}
					break;
				}
				case 'LSS':
				{
					if (value < FilterList[i].Value)
					{
						if (!FilterList[i].Show)
						{
							delete ResultList[j];
						}
					}
					else if (FilterList[i].Show)
					{
						delete ResultList[j];
					}
					break;
				}
				default:
				{
					// invalid condition
					j = ResultList.length;
					break;
				}
			}
		}
	}
}