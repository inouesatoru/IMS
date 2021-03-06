function viewShow() {
	var navbar = $("#navbar").kendoMobileNavBar();
	warningListInitRequest();
	document.addEventListener("jpush.receiveMessage", function(event) {
		warningListInitRequest();
	}, false);
}

function removeEventListenerFunction(event) {

}

function viewBeforeHide() {
	document.removeEventListener("jpush.receiveMessage", removeEventListenerFunction, false);
}

function viewAfterShow() {
	//收起软键盘
	document.activeElement.blur();
	//dealloc
	IMSWarningInfo_dealloc();
}

function IMSWarningInfo_dealloc() {
	if($("#IMSWarningInfo").data("kendoMobileView"))
		$("#IMSWarningInfo").data("kendoMobileView").destroy();
	if($("#IMSWarningInfo"))
		$("#IMSWarningInfo").remove();
}

function warningListInitRequest() {

	var params = {
		"account": storage.get("account"),
		"srcid": storage.get("srcid"),
		"messageid": "*"
	};
	kendo.ui.progress($("#IMSWarningList"), true);
	$.ajax({
		type: "post",
		url: IMSUrl + "busi_alarm/",
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(params)
		},
		dataType: "json",
		success: function(data) {
			warningListBindView(data);
			kendo.ui.progress($("#IMSWarningList"), false);
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSWarningList"), false);
			alert("请求服务器出错");
		}
	});
}

function warningListBindView(data) {
	if(data.outstatus != 0) {
		GLOBAL_ErrorInfo(data);
	} else if(data.outstatus == 0) {
		//		alert(JSON.stringify(data.outputstr.Messagerows));
		var messageArray = data.outputstr.Messagerows;
		$.each(messageArray, function(n, value) {
			if(value.messagename == "设备告警")
				$("#warningListBadge_1").text(value.quantity);
		});
		$.each(messageArray, function(n, value) {
			if(value.messagename == "生产效率告警")
				$("#warningListBadge_2").text(value.quantity);
		});
		$.each(messageArray, function(n, value) {
			if(value.messagename == "质量告警")
				$("#warningListBadge_3").text(value.quantity);
		});
		$.each(messageArray, function(n, value) {
			if(value.messagename == "其他告警信息")
				$("#warningListBadge_4").text(value.quantity);
		});
	}
}