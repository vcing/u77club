// 处理日期
app.filter('dateFromNow',function(){
	return function(date){
		return moment(date).fromNow();
	}
})

app.filter('html',['$sce',function($sce){
	return function(data){
		return $sce.trustAsHtml(data);
	}
}])