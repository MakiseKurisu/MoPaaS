var table = document.getElementById('result_table');

var enum_id = document.getElementById('enum_id');
var enum_date = document.getElementById('enum_date');
var enum_sn = document.getElementById('enum_sn');
var enum_name1 = document.getElementById('enum_name1');
var enum_name2 = document.getElementById('enum_name2');
var enum_name3 = document.getElementById('enum_name3');
var enum_mobile = document.getElementById('enum_mobile');
var enum_phone = document.getElementById('enum_phone');
var enum_personalid = document.getElementById('enum_personalid');
var enum_status = document.getElementById('enum_status');
var enum_bank = document.getElementById('enum_bank');
var enum_cardnumber1 = document.getElementById('enum_cardnumber1');
var enum_cardnumber2 = document.getElementById('enum_cardnumber2');
var enum_receipt = document.getElementById('enum_receipt');
var enum_agent = document.getElementById('enum_agent');
var enum_salesperson1 = document.getElementById('enum_salesperson1');
var enum_salesperson2 = document.getElementById('enum_salesperson2');
var enum_salesperson3 = document.getElementById('enum_salesperson3');
var enum_roomnumber = document.getElementById('enum_roomnumber');
var enum_location = document.getElementById('enum_location');
var enum_comment = document.getElementById('enum_comment');

var form_date = document.getElementById('form_date');
var form_sn = document.getElementById('form_sn');
var form_name1 = document.getElementById('form_name1');
var form_name2 = document.getElementById('form_name2');
var form_name3 = document.getElementById('form_name3');
var form_mobile = document.getElementById('form_mobile');
var form_phone = document.getElementById('form_phone');
var form_personalid = document.getElementById('form_personalid');
var form_status = document.getElementById('form_status');
var form_bank = document.getElementById('form_bank');
var form_cardnumber1 = document.getElementById('form_cardnumber1');
var form_cardnumber2 = document.getElementById('form_cardnumber2');
var form_receipt = document.getElementById('form_receipt');
var form_agent = document.getElementById('form_agent');
var form_salesperson1 = document.getElementById('form_salesperson1');
var form_salesperson2 = document.getElementById('form_salesperson2');
var form_salesperson3 = document.getElementById('form_salesperson3');
var form_roomnumber = document.getElementById('form_roomnumber');
var form_location = document.getElementById('form_location');

var filter_field = document.getElementById('filter_field');
var filter_value = document.getElementById('filter_value');
var filter_switch = document.getElementById('filter_switch');
var filter_list = document.getElementById('filter_list');

var sort_id = document.getElementById('sort_id');
var sort_date = document.getElementById('sort_date');
var sort_sn = document.getElementById('sort_sn');
var sort_name = document.getElementById('sort_name');
var sort_mobile = document.getElementById('sort_mobile');
var sort_status = document.getElementById('sort_status');

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

function sort_table(column)
{
	var column_class = column.className;

	sort_id.style.display = "none";
	sort_id.className = "glyphicon glyphicon-arrow-up";

	sort_date.style.display = "none";
	sort_date.className = "glyphicon glyphicon-arrow-up";

	sort_sn.style.display = "none";
	sort_sn.className = "glyphicon glyphicon-arrow-up";

	sort_name.style.display = "none";
	sort_name.className = "glyphicon glyphicon-arrow-up";

	sort_mobile.style.display = "none";
	sort_mobile.className = "glyphicon glyphicon-arrow-up";

	sort_status.style.display = "none";
	sort_status.className = "glyphicon glyphicon-arrow-up";

	if (column_class == "glyphicon glyphicon-arrow-up")
	{
		column.className = "glyphicon glyphicon-arrow-down";
		ResultList.sort(function(a, b)
		{
			return a[column.title] > b[column.title];
		});
	}
	else
	{
		column.className = "glyphicon glyphicon-arrow-up";
		ResultList.sort(function(a, b)
		{
			return a[column.title] < b[column.title];
		});
	}

	column.style.display = "inline";

	redraw_table();
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
	xmlhttp.open('POST','./backend.php?command=save',true);  
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
						for (index in DataList)
						{
							var THIS = DataList[index];
							try
							{
								if (THIS.Mobile == 0 || THIS.Mobile == undefined)
								{
									THIS.Mobile = '';
								}

								if (THIS.Phone == 0 || THIS.Phone == undefined)
								{
									THIS.Phone = '';
								}

								THIS.Name = THIS.Name1 + ' ' + THIS.Name2 + ' ' + THIS.Name3;
								THIS.CardNumber = THIS.CardNumber1 + 'XXX' + THIS.CardNumber2;
								THIS.StatusText = EnumList[0].List[THIS.Status].Value;
								THIS.BankText = EnumList[1].List[THIS.Bank].Value;
								THIS.AgentText = EnumList[2].List[THIS.Agent].Value;
							}
							catch (e)
							{

							}
						}
						apply_filter();
					}

					if ((typeof(ResultList) != 'undefined') && ResultList)
					{
						redraw_table();
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

function redraw_table()
{
	while (table.rows.length > 1)
	{
		table.deleteRow(-1);
	}

	for (i in ResultList)
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
		cell[3].innerHTML = ResultList[i].Name;
		cell[4].innerHTML = ResultList[i].Mobile;
		cell[5].innerHTML = optionText(enum_status, ResultList[i].Status);
		cell[6].innerHTML = '<button type="button" class="btn btn-info" onclick="show_full_result(' + i + ');">编辑</button>';
	}
}

function save_to_database()
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
					var json = JSON.parse(xmlhttp.responseText);
					console.log(json);
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

	xmlhttp.open('POST','./backend.php?command=save',true);  
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var record = {table:'sampletable', data:{}};

	if (enum_id.value != '')
	{
		record.data.ID = enum_id.value;
	}

	clean_error_status();
	var has_error = false;

	if (enum_date.value == '')
	{
		form_date.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.Date = enum_date.value;
	}

	if (enum_sn.value == '')
	{
		form_sn.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.SN = enum_sn.value;
	}

	if (enum_name1.value == '')
	{
		form_name1.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.Name1 = enum_name1.value;
		record.data.Name2 = enum_name2.value;
		record.data.Name3 = enum_name3.value;
	}

	if ((enum_mobile.value == '' && enum_phone.value == '') || (enum_mobile.value.length != 11))
	{
		form_mobile.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.Mobile = enum_mobile.value;
		record.data.Phone = enum_phone.value;
	}

	if ((enum_personalid.value == '') || (enum_personalid.value.length != 18))
	{
		form_personalid.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.PersonalID = enum_personalid.value;
	}

	record.data.Status = enum_status.selectedIndex;
	record.data.Bank = enum_bank.selectedIndex;

	if ((enum_cardnumber1.value == '') || (enum_cardnumber1.value.length != 6))
	{
		form_cardnumber1.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.CardNumber1 = enum_cardnumber1.value;
	}

	if ((enum_cardnumber2.value == '') || (enum_cardnumber2.value.length != 4))
	{
		form_cardnumber2.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.CardNumber2 = enum_cardnumber2.value;
	}

	if (enum_receipt.value == '')
	{
		form_receipt.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.Receipt = enum_receipt.value;
	}

	record.data.Agent = enum_agent.selectedIndex;


	if (enum_salesperson1.value == '')
	{
		form_salesperson1.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.Salesperson1 = enum_salesperson1.value;
		record.data.Salesperson2 = enum_salesperson2.value;
		record.data.Salesperson3 = enum_salesperson3.value;
	}

	if (enum_roomnumber.value == '')
	{
		form_roomnumber.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.RoomNumber = enum_roomnumber.value;
	}

	if (enum_location.value == '')
	{
		form_location.className = "col-md-4 has-error"
		has_error = true;
	}
	else
	{
		record.data.Location = enum_location.value;
	}

	record.data.Comment = enum_comment.value;

	if (has_error == false)
    {
    	xmlhttp.send(JSON.stringify(record));
    }
}

function clean_form()
{
	enum_date.value = today_date();

	enum_id.value = '';
	enum_sn.value = '';

	enum_name1.value = '';
	enum_name2.value = '';
	enum_name3.value = '';

	enum_mobile.value = '';
	enum_phone.value = '';

	enum_personalid.value = '';

	enum_status.selectedIndex = 0;
	enum_bank.selectedIndex = 0;

	enum_cardnumber1.value = '';
	enum_cardnumber2.value = '';

	enum_receipt.value = ''

	enum_agent.selectedIndex = 0;
	enum_salesperson1.value = '';
	enum_salesperson2.value = '';
	enum_salesperson3.value = '';

	enum_roomnumber.value = '';

	enum_location.value = '';
	
	enum_comment.value = '';

	clean_error_status();
}

function clean_error_status()
{
	form_date.className = "col-md-4";
	form_sn.className = "col-md-4";
	form_name1.className = "col-md-4";
	form_name2.className = "col-md-4";
	form_name3.className = "col-md-4";
	form_mobile.className = "col-md-4";
	form_phone.className = "col-md-4";
	form_personalid.className = "col-md-4";
	form_status.className = "col-md-4";
	form_bank.className = "col-md-4";
	form_cardnumber1.className = "col-md-4";
	form_cardnumber2.className = "col-md-4";
	form_receipt.className = "col-md-4";
	form_agent.className = "col-md-4";
	form_salesperson1.className = "col-md-4";
	form_salesperson2.className = "col-md-4";
	form_salesperson3.className = "col-md-4";
	form_roomnumber.className = "col-md-4";
	form_location.className = "col-md-4";
}

function show_full_result(i)
{
	enum_date.value = ResultList[i].Date;

	enum_id.value = ResultList[i].ID;
	enum_sn.value = ResultList[i].SN;

	enum_name1.value = ResultList[i].Name1;
	enum_name2.value = ResultList[i].Name2;
	enum_name3.value = ResultList[i].Name3;

	enum_mobile.value = ResultList[i].Mobile;
	enum_phone.value = ResultList[i].Phone;

	enum_personalid.value = ResultList[i].PersonalID;

	enum_status.selectedIndex = ResultList[i].Status;
	enum_bank.selectedIndex = ResultList[i].Bank;

	enum_cardnumber1.value = ResultList[i].CardNumber1;
	enum_cardnumber2.value = ResultList[i].CardNumber2;

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

function clean_filter()
{
	filter_list.innerHTML = '';
	FilterList = new Array();
	show_all();
}

function add_filter()
{
	if (filter_value.value == '')
	{
		var status = document.getElementById('status');
		status.className = 'alert alert-danger';
		status.innerText = '查询内容不能为空';
		return;
	}

	var index = FilterList.length;
	FilterList[index] = {};
	FilterList[index].Field = selectedValue(filter_field);
	FilterList[index].Value = filter_value.value;
	FilterList[index].Show = selectedValue(filter_switch);

	var new_filter = '';
	if (FilterList[index].Show == 1)
	{
		new_filter += '<div class="col-md-3 alert alert-success alert-dismissable">';
	}
	else
	{
		new_filter += '<div class="col-md-3 alert alert-danger alert-dismissable">';
	}
	new_filter += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true" onclick="remove_filter(' + index + ');">&times;</button>';
	new_filter += '当' + selectedText(filter_field) + '包含' + filter_value.value + '时' + selectedText(filter_switch);
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
			if (value.search(FilterList[i].Value) >= 0)
			{
				if (FilterList[i].Show != 1)
				{
					delete ResultList[j];
				}
			}
			else if (FilterList[i].Show == 1)
			{
				delete ResultList[j];
			}
		}
	}
}