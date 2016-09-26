/**
 * Created by mac on 16/9/7.
 */

var navbar = $("#navbar").kendoMobileNavBar();

$(document).ready(function() {

	dataSource = kendo.data.DataSource.create({
		data: [{message:"告警信息"}, 
		{message:"设备告警信息"}, 
		{message:"生产效率详细告警信息"}, 
		{message:""}]
	});

	var contentViewModel = kendo.observable({
		"dataSource": dataSource,

	});
	kendo.bind($("#warningInfoListView"), contentViewModel);
	$("#warningInfo_detilButton").click(function() {
//				window.location.href = "warningDetail.html";
				app.navigate("warningDetail.html");
			});
});