$(function(){
	var insertTr ='';
	// 表格初始化
	for(var i=0;i<5;i++){
		insertTr += '<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	}
	$('#manager_table tbody').html(insertTr);
})