/**
 * Created by mac on 16/9/6.
 */
var contentViewModel;
var type;
var selectdate;

function viewInit(e) {}

function viewShow(e) {

	var navbar = $("#navbar").kendoMobileNavBar();
	selectdate = e.view.params.selectdate;
	switch(e.view.params.type) {
		case "0":
			type = "1";
			break;
		case "1":
			type = "2";
			break;
		case "2":
			type = "3";
	};
	kendo.ui.progress($("#IMSYieldinput"), true);
	var url = IMSUrl + "busi_bindfind";
	$.ajax({
		type: "post",
		url: url,
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify({
				"type": "1"
			})
		},
		dataType: "json",
		success: function(data) {
			kendo.ui.progress($("#IMSYieldinput"), false);
			bindView(data);

		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSYieldinput"), false);
			alert("请求服务器出错!原因:" + JSON.stringify(data));
		}
	});
}

function fetchXJS() {
	var url = IMSUrl + "findxjs/";
	var result = [];
	kendo.ui.progress($("#IMSYieldinput"), true);
	$.ajax({
		type: "post",
		url: url,
		async: false,
		dataType: "jsonp",
		data: null,
		dataType: "json",
		success: function(data) {
			kendo.ui.progress($("#IMSYieldinput"), false);
			result = data.outputstr.map(function(item) {
				return {
					variety: item.XJS_No
				};
			});

		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSYieldinput"), false);
		}
	});
	return result;
}

function bindView(data) {
	var first, second, third;
	var content = data.outputstr.flowcoderows;

	for(var key in content) {
		var object = content[key];
		var contentArray = new Array();

		if(object.flowname.trim() == "预并") {
			$.each(object.devices, function(n, device) {
				contentArray.push({
					"image": "../resources/@3x/ybt-sb2@3x.png",
					"devcodename": device["devcodename"],
					"devcode": device["devcode"],
					"yield": "",
					"variety": ""
				});
			});
			//
			first =
				kendo.data.DataSource.create({
					data: contentArray
				});
		} else if(object.flowname.trim() == "梳棉") {
			$.each(object.devices, function(n, device) {
				contentArray.push({
					"image": "../resources/@3x/smj-c51@3x.png",
					"devcodename": device["devcodename"],
					"devcode": device["devcode"],
					"yield": "",
					"variety": ""
				});
			});
			//
			second =
				kendo.data.DataSource.create({
					data: contentArray
				});
		} else if(object.flowname.trim() == "粗纱") {
			$.each(object.devices, function(n, device) {
				contentArray.push({
					"image": "../resources/@3x/csj-ftid@3x.png",
					"devcodename": device["devcodename"],
					"devcode": device["devcode"],
					"yield": "",
					"variety": ""
				});
			});
			third =
				kendo.data.DataSource.create({
					data: contentArray
				});
			//
		}

	}
	varietiesDataSource = kendo.data.DataSource.create({
		data: fetchXJS(),
	});
	contentDataSource = first;
	contentViewModel = kendo.observable({
		"selectflowcode": 3,
		"varietiesDataSource": varietiesDataSource,
		"contentDataSource": contentDataSource,
		"first": first,
		"second": second,
		"third": third,
		onChange: function(e) {
			console.log($(e.target).parent());

			$(e.target).parent().find("#dropdownlistPlaceholder").hide();
		},
		hidden: function(e) {
			return !(e.variety.length == 0);
		}
	});

	var headerButtonViewModel = kendo.observable({
		headerButtonClick: function(e) {
			$.each(e.target.parent().parent().find("a"), function(n, button) {
				button.style.backgroundColor = "#EEEEEE";
				button.style.color = "#AAAAAA";
				button.style.borderColor = "#EEEEEE";
			});
			e.target[0].style.backgroundColor = "#A9293D";
			e.target[0].style.color = "#FFFFFF";
			e.target[0].style.borderColor = "#A9293D";

			if($(e.target.find(".km-text")[0]).text() == "预并") {
				contentViewModel.selectflowcode = 3;
				$("#yieldInputListView").data("kendoMobileListView").setDataSource(self.contentViewModel.first);
			} else if($(e.target.find(".km-text")[0]).text() == "梳棉") {
				contentViewModel.selectflowcode = 2;
				$("#yieldInputListView").data("kendoMobileListView").setDataSource(self.contentViewModel.second);
			} else if($(e.target.find(".km-text")[0]).text() == "粗纱") {
				contentViewModel.selectflowcode = 7;
				$("#yieldInputListView").data("kendoMobileListView").setDataSource(self.contentViewModel.third);
			}

		}

	});
	kendo.bind($("#headerButtonGroup"), headerButtonViewModel);

	//刷新头部
	$.each($("#headerButtonGroup").find("a"), function(n, button) {
		if(n == 0) {
			button.style.backgroundColor = "#A9293D";
			button.style.color = "#FFFFFF";
			button.style.borderColor = "#A9293D";
		} else {
			button.style.backgroundColor = "#EEEEEE";
			button.style.color = "#AAAAAA";
			button.style.borderColor = "#EEEEEE";
		}
	});

	kendo.bind($("#yieldInputListView"), contentViewModel);
}

$("#yieldInput_confirmButton").click(function() {
	var content =

		$("#yieldInputListView").data("kendoMobileListView").dataSource.data().map(function(item) {
			var obj = {
				devcode: item.devcode,
				yield: item.yield,
				varieties: item.variety
			};
			return obj;
		});
	//对客户输入的信息的每一项进行校验，没输入的不输出，输入一半的提示出错
	var filterContent = new Array();
	for(var index in content) {
		var item = content[index];

		if(item.yield.length == 0 && item.varieties.length == 0) {
			continue;
		} else if(item.yield.length == 0 || item.varieties.length == 0) {
			alert("某项的品种或数量没有填写！");
			return;
		} else {
			filterContent.push(item);
		}
	}
	var params = {
		duty: type,
		shiftdate: selectdate,
		flowcoderows: [{
			flowcode: contentViewModel.selectflowcode,
			machinerows: filterContent
		}]
	};
	if(!isOnline) {
		saveOfflineInfo(params);
		return;
	}
	kendo.ui.progress($("#IMSYieldinput"), true);
	$.ajax({
		type: "post",
		url: IMSUrl + "busi_YieldInput/",
		timeout: 10000,
		async: false,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(params),
		},
		dataType: "json",
		success: function(data) {
			kendo.ui.progress($("#IMSYieldinput"), false);
			if(data.outstatus == 0) {
				alert("成功");
			} else {
				alert("失败,原因:" + data.outputstr);
			}
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSYieldinput"), false);
			if(e == "timeout") {
				saveOfflineInfo(params);
			} else {
				alert("请求服务器出错");
			}

		}
	});
});

function clearInputnNumber() {
	$("#yieldInputListView").data("kendoMobileListView").dataSource.data().forEach(function(item) {
		item.yield = "";
	});
	$("#yieldInputListView").data("kendoMobileListView").setDataSource($("#yieldInputListView").data("kendoMobileListView").dataSource);
}

function saveOfflineInfo(para) {

	var log = {
		type: "机台输入产量",
		operatetime: kendo.toString(kendo.parseDate(new Date()), 'yyyy-MM-dd HH:mm:ss'),
		status: "",
		info: dealWithContent(JSON.stringify(para)),
		content: JSON.stringify(para)
	};
	var array = isArrayFn(JSON.parse(storage.get("offline"))) ? JSON.parse(storage.get("offline")) : new Array();
	array.push(log);
	storage.put("offline", JSON.stringify(array));
	alert("网络环境不佳,请稍候在网络好的的地方再重新上传");
	clearInputnNumber();
}
//让展示信息可读
function dealWithContent(content) {
	return content.replace(/[{"}]/g, "")
		.replace(/typerows/, "内容")
		.replace(/flowcoderows/, "内容")
		.replace(/unit/g, "单位")
		.replace(/yield/g, "产量")
		.replace(/shiftdate/, "时间")
		.replace(/username/g, "操作人")
		.replace(/type/g, "类别")
		.replace(/shiftdate/g, "时间")
		.replace(/flowcode/g, "工序号")
		.replace(/machinerows/g, "机台")
		.replace(/devcode/g, "机台号")
		.replace(/varieties/g, "品种")

}

function isArrayFn(value) {
	if(typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}