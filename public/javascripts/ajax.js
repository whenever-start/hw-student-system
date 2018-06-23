$(function(){
	var options = {};
	$.get('./users/list',function(rs){
		updateTable(rs);
	})
	// 查询全部
	$('#search-query_all').click(function(){
		$.get('./users/list',function(rs){
			updateTable(rs);
		})
	});
	// 搜索
	$('#search_btn').click(function(){
		options = {};
		var inpVal = $('#serach_inp').val();
		console.log(inpVal);
		// 对输入内容简单校验
		if(inpVal === ''){
			$('.tips').text('输入不能为空！');
		}else if(/[\s]/.test(inpVal)){
			$('.tips').text('输入不能有空格！');
		}else if(!/^[\u2E80-\u9FFF]+$/.test(inpVal)){
			$('.tips').text('请输入中文查询！');
		}else{
			$('.tips').text('请在搜索框输入姓名查询，如需更多查询条件请点击高级搜索！');
			options = {
				stu_name:inpVal
			};
			$.get('/users/list',{
				options:options
			},function(rs){
				console.log(rs);
				updateTable(rs);
			})
		}
	});
	// 高级搜索
	$('#advanced_query').click(function(){
		$('.pop-advanced_query').slideDown('fast');
	});
	// 开始高级搜索
	$('#advanced_query-confirm').click(function(){
		options = {};
		var nameVal =  $('#query_name').val();
		var ageVal =  $('#query_age').val();
		var sexVal =  $('#query_sex input:checked').next().text();
		var classVal =  $('#query_class option:selected').val();
		var queryState = true;
		var data = {};
		// 校验输入内容
		console.log('输入内容：','1',nameVal,'2',ageVal,'3',sexVal,'4',classVal);
		var tipsText = '';
		if(nameVal != ''){
			if( /[\u2E80-\u9FFF]+[\s]/.test(nameVal) ){
				tipsText += '姓名不能有空格！';
				queryState = false;
			}else if( !/^[\u2E80-\u9FFF]+$/.test(nameVal) ){
				tipsText += '姓名必须为中文！';
				queryState = false;
			}
		}else if(ageVal != ''){
			if( ageVal < 1 || ageVal > 100 || (Math.ceil(ageVal) != ageVal) ){
				tipsText += '年龄必须为1-100之间的整数！';
				queryState = false;
			}
		}
		console.log(queryState)
		if(queryState){
			if(nameVal != ''){
				options.stu_name = nameVal;
			}
			if(ageVal != ''){
				options.stu_age = ageVal;
			}
			if(sexVal != '全选'){
				options.stu_sex = sexVal;
			}
			if(classVal != '不限'){
				options.stu_class = classVal;
			}
			closeAdvancedSearch();
			data.options = options;
			$.get('./users/list',data,function(rs){
				updateTable(rs);
			})
		}else{
			$('.tips').text(tipsText);
		}
	});

	// 取消高级搜索
	$('#advanced_query-cancel').click(function(){
		closeAdvancedSearch();
	});

	// 添加
	$('#btn-add_student').click(function(){
		console.log('add');
		$('#pop-add_students').show('fast');
	});
	$('#pop-add-confirm').click(function(){
		options = {};
		var nameVal =  $('#add_name').val();
		var ageVal =  $('#add_age').val();
		var sexVal =  $('#add_sex input:checked').next().text();
		var classVal =  $('#add_class option:selected').val();
		var queryState = true;
		var data = {};
		// 校验输入内容
		console.log('输入内容：','1',nameVal,'2',ageVal,'3',sexVal,'4',classVal);
		var tipsText = '';
			if(nameVal === ''){
				tipsText += '姓名不能为空！';
			}else if( /[\u2E80-\u9FFF]+[\s]/.test(nameVal) ){
				tipsText += '姓名不能有空格！';
				queryState = false;
			}else if( !/^[\u2E80-\u9FFF]+$/.test(nameVal) ){
				tipsText += '姓名必须为中文！';
				queryState = false;
			}
			if(ageVal === ''){
				tipsText += '年龄不能为空！';
				queryState = false;
			}else if( ageVal < 1 || ageVal > 100 || (Math.ceil(ageVal) != ageVal) ){
				tipsText += '年龄必须为1-100之间的整数！';
				queryState = false;
			}
		console.log(queryState)
		if(queryState){
			options.stu_name = nameVal;
			options.stu_age = ageVal;
			options.stu_sex = sexVal;
			options.stu_class = classVal;
			closeAddStudent();
			data.options = options;
			console.log(data);
			$.post('./users/add',options,function(rs){
				console.log(rs);
			})
		}else{
			$('.tips').text(tipsText);
		}
	});

	// 取消 添加
	$('#pop-add-cancel').click(function(){
		closeAddStudent();
	});

	

	/*********************************函数*************************************/
	// 刷新表格
	function updateTable(rs){
		var str = '';
		var selectInner;
		var lis = '';
		var len = 5 < rs.item.length ? 5 : rs.item.length;
		var pageTotal = Math.ceil(rs.item.length/5);

		// 表格插入内容
		for(var i=0;i<len;i++){
			var uName = rs.item[i].stu_name;
			var uAge = rs.item[i].stu_age;
			var uSex = rs.item[i].stu_sex;
			var uClass = rs.item[i].stu_class;
			str += '<tr><td class="table-idx">'+(i+1)+'</td><td><input class="select-box" type="checkbox" name="select" idx='+i+' /></td><td>'+uName+'</td><td>'+uAge+'</td><td>'+uSex+'</td><td>'+uClass+'</td></tr>';
		}
		if(len<5){
			for(var i=0;i<5-len;i++){
				str += '<tr><td class="table-idx"></td><td></td><td></td><td></td><td></td><td></td></tr>';
			}
		}
		$('#manager_table tbody').html(str);

		// 更新页数
		for(var i=0;i<pageTotal;i++){
			$('#manager_table_page').width(pageTotal*20);
			lis += '<li>'+(i+1)+'</li>'
		}
		$('#manager_table_page').html(lis);
		$('#manager_table_page>li:first').addClass('cur');

		// 分页
		$('#manager_table_page>li').click(function(){
			$('#manager_table tbody').empty();
			var num = $(this).index();
			var min = num * 5;
			var len;
			var str = '';
			pageTotal = Math.ceil(rs.item.length/5);
			if(num<pageTotal-1){
				len = 5;
			}else if(num === (pageTotal - 1)){
				len = rs.item.length - min;
			}
			for(var i=min;i<(min+len);i++){
				var uName = rs.item[i].stu_name;
				var uAge = rs.item[i].stu_age;
				var uSex = rs.item[i].stu_sex;
				var uClass = rs.item[i].stu_class;
				str += '<tr><td class="table-idx">'+(i+1)+'</td><td><input class="select-box" type="checkbox" name="selecte" idx='+i+' /></td><td>'+uName+'</td><td>'+uAge+'</td><td>'+uSex+'</td><td>'+uClass+'</td></tr>';
			}
			for(var i=min;i<(min+5-len);i++){
				str += '<tr><td class="table-idx"></td><td></td><td></td><td></td><td></td><td></td></tr>';
			}
			$('#manager_table tbody').html(str);
			$('#manager_table_page>li.cur').removeClass('cur');
			$('#manager_table_page>li').eq(num).addClass('cur');
			selectAllChekbox();
		});

		// 删除
		// 复选框全选操作
		selectAllChekbox();
		$('#btn-del_student').click(function(){
			var opt_id = {};
			var len = $('#manager_table input[name="select"]:checked').length;
			for(var i=0;i<len;i++){
				var idx = $('#manager_table input[name="select"]:checked').eq(i).attr('idx');
				opt_id[i] = rs.item[idx]._id;
			}
			$.post('./users/del',opt_id,function(rs){
				$.get('./users/list',options,function(rs){
					updateTable(rs);
				})
			})
		});
	}

	// 关闭高级搜索
	function closeAdvancedSearch(){
		$('.pop-advanced_query').slideUp('fast');
		// 清空表单
		$('#query_name').val('');
		$('#query_age').val('');
		$('#query_sex input:eq(0)').prop('checked',true);
		$('#query_class option:eq(0)').prop('selected',true);
	}

	// 关闭添加
	function closeAddStudent(){
		$('#pop-add_students').hide('fast');
		// 清空表单
		$('#add_name').val('');
		$('#add_age').val('');
		$('#add_sex input:eq(0)').prop('checked',true);
		$('#add_class option:eq(0)').prop('selected',true);
	}

	// 全选/反选
	function selectAllChekbox(){
		$('#checkbox-select_all').click(function(){
			if($(this).prop('checked')){
				$('#manager_table input[name="select"]').prop('checked',true);
			}else{
				$('#manager_table input[name="select"]').prop('checked',false);
			}
		});
		$('#manager_table').on('click','input[name="select"]',function(){
			var num = 0;
			for(var i=0;i<$('#manager_table input[name="select"]').length;i++){
				if($('#manager_table input[name="select"]').eq(i).prop('checked') === true){
					num++;
				}
			}
			if(num ===$('#manager_table input[name="select"]').length){
				$('#checkbox-select_all').prop('checked',true);
			}else{
				$('#checkbox-select_all').prop('checked',false);
			}
		})
	}
})

