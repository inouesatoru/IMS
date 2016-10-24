var type = "0";

function postPackingInputData() {
	var typerows = [{
		"unit": $("#packingInput_dropdownlist").val(),
		"yield": $("#IMSPackingInput_yield").val(),
		"type": type
	}];
	var para = {
		"typerows": typerows,
		"username": storage.get("srcid"),
	};
	if($("#IMSPackingInput_yield").val().length == 0) {
		alert("请输入数量");
		return;
	}
	
	var url = IMSUrl + "busi_PackingInput/";
	kendo.ui.progress($("body"), true);
	$.ajax({
		type: "post",
		url: url,
		timeout: 10000,
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(para)
		},
		dataType: "json",
		success: function(data) {
			kendo.ui.progress($("body"), false);
			if(data.outstatus == 0)
				alert("处理成功");
			else
				alert("操作失败，请稍后再试");
		},
		error: function(data, status, e) {
			kendo.ui.progress($("body"), false);
			alert("请求服务器出错");
		}
	});
};

function viewShow() {
	//	$("#packingInput_actionsheet").attr("data-popup",'{ "width": '+document.body.scrollWidth+' }');
	//	$("#packingInput_actionsheet").data("kendoMobileActionSheet").options.popup = '{height: "auto", width: '+document.body.scrollWidth+' }';
	var dataSource = kendo.data.DataSource.create({
		data: [{}],
	});

	var listViewModel = new kendo.observable({
		packingInputDataSource: dataSource,
	});
	kendo.bind($("#packingInput_listview"), listViewModel);
}

//function packingInput_filter(value) {
//	$("#packingInput_filterButton").text(value);
//	$("#packingInput_actionsheet").data("kendoMobileActionSheet").close();
//}

$("#packingInput_confirmButton").click(function() {
	postPackingInputData();
});

$("#packingInput_button_1").click(function() {
	type = "0";
	$("#IMSPackingInput_yield").val("");
	$("#packingInput_button_1").attr("style", "width: 31%;background-color: #A9293D;color: #FFFFFF;border-color: #A9293D;");
	$("#packingInput_button_2").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
	$("#packingInput_button_3").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
});

$("#packingInput_button_2").click(function() {
	type = "1";
	$("#IMSPackingInput_yield").val("");
	$("#packingInput_button_1").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
	$("#packingInput_button_2").attr("style", "width: 31%;background-color: #A9293D;color: #FFFFFF;border-color: #A9293D;");
	$("#packingInput_button_3").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
});

$("#packingInput_button_3").click(function() {
	type = "2";
	$("#IMSPackingInput_yield").val("");
	$("#packingInput_button_1").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
	$("#packingInput_button_2").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
	$("#packingInput_button_3").attr("style", "width: 31%;background-color: #A9293D;color: #FFFFFF;border-color: #A9293D;");
});