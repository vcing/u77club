module.exports = {
	search:search,
	search_7k7k: search_7k7k,
	search_17yy: search_17yy,
	search_4399: search_4399,
	search_kongregate: search_kongregate,
	search_3366: search_3366,
	search_2144: search_2144
}

function search(keyword,cb){
	searchAll = q.all([search_17yy(keyword),
		search_4399(keyword),
		search_kongregate(keyword),
		search_7k7k(keyword),
		search_3366(keyword),
		search_2144(keyword)
	]);
	searchAll.then(function(results){
		console.log('all done');
		var _r = {};
		_r['17yy'] = results[0];
		_r['4399'] = results[1];
		_r['kongregate'] = results[2];
		_r['7k7k'] = results[3];
		_r['3366'] = results[4];
		_r['2144'] = results[5];
		cb(_r);
	});
}


function search_17yy(keyword,page,sort){

	page = page ? page : 0;
	sort = sort ? sort : 'onclick';
	var deferred = q.defer();

	var url = "http://so.17yy.com/game/"+encodeURI(keyword)+"/"+sort+"/"+page+".html";
	var _t = new Date();
	request({
		url:url,
		method:"GET",
		encoding:null
	},function(err,res,body){
		if(err)deferred.reject(new Error('17yy game search faild'));
		var html = iconv.decode(new Buffer(body),'GBK').toString();
		jsdom.env({
			html:html,
			scripts:[jquery],
			done:function(err,window){
				if(err){
					deferred.reject(new Error('17yy game search faild'));
				}else{
					var games = parse_17yy(window);
					var t = new Date();
					console.log('search 17yy use '+(t-_t)+'ms');
					var result = {
						src:'17yy',
						sort:{
							'最多人玩':'onclick',
							'最新发布':'newstime',
							'评分最高':'star',
						},
						current_sort:sort,
						current_page:page,
						games:games
					}
					deferred.resolve(result);
				}
			}
		});
	});
	return deferred.promise;
}

function parse_17yy(window){
	var $ = window.$;
	var games = [];
	_.forEach($('.search_list'),function(dom){
		var game = {
			title: $(dom).find('.g_name1').text().split('(')[0],
			title_en: $(dom).find('.g_name1').text().split('(')[2] ? $(dom).find('.g_name1').text().split('(')[2].split(')')[0] : $(dom).find('.g_name1').text().split('(')[1] ? $(dom).find('.g_name1').text().split('(')[1].split(')')[0] : '',
			description: $(dom).find('.g_intro').text(),
			url: $(dom).find('.g_name1').attr('href'),
			img: $(dom).find('.late_list img').attr('src'),
			date: moment($(dom).find('.s_da label').text(), "YYYY-MM-DD").toString(),
			src: "17yy"
		}
		games.push(game);
	});
	return games;
}

function search_4399(keyword,page,sort){
	var deferred = q.defer();

	page = page ? page : 1;
	sort = sort ? sort : 'rel';
	var url = "http://so2.4399.com/search/search.php?k="+encodeURI(keyword)+"&p="+page+"&sort="+sort;
	var _t = new Date();
	request({
		url:url,
		method:"GET",
		encoding:null
	},function(err,res,body){
		if(err)deferred.reject(new Error('4399 game search faild'));
		var html = iconv.decode(new Buffer(body),'GBK').toString();
		jsdom.env({
			html:html,
			scripts:[jquery],
			done:function(err,window){
				if(err){
					deferred.reject(new Error('4399 game search faild'));
				}else{
					var games = parse_4399(window);
					var t = new Date();
					console.log('search 4399 use '+(t-_t)+'ms');
					var result = {
						src:'4399',
						sort:{
							'推荐结果':'rel',
							'点击排行':'hits',
							'更新时间':'thetime',
							'评论排行':'comments'
						},
						current_sort:sort,
						current_page:page,
						games:games
					}
					deferred.resolve(result);
				}
			}
		});
	});
	return deferred.promise;
}

function parse_4399(window){
	var $ = window.$;
	var games = [];
	_.forEach($('.type_d'),function(dom){
		var game = {
			title: $(dom).find('.fr_d .pop b a').text().split('(')[0],
			title_en: $(dom).find('.fr_d .pop b a').text().split('英文:')[1] ? $(dom).find('.fr_d .pop b a').text().split('英文:')[1].split(')')[0] : '',
			description: $(dom).find('.fr_d p').text(),
			url: $(dom).find('.fr_d .pop b a').attr('href'),
			img: $(dom).find('.fl_img img').attr('src'),
			date: moment($(dom).find('.fr_d .pop span').text().split('更新时间：')[1], "YYYY-MM-DD").toString(),
			src: "4399"
		}
		games.push(game);
	});
	return games;
}

function search_kongregate(keyword,page){
	var deferred = q.defer();
	page = page ? page : 1 ;
	var url = "http://www.kongregate.com/search?q="+encodeURI(keyword)+'&page='+page;
	var _t = new Date();
	request({
		url:url,
		method:"GET",
		encoding:null
	},function(err,res,body){
		if(err)deferred.reject(new Error('kongregate game search faild'));
		var html = iconv.decode(new Buffer(body),'UTF8').toString();
		jsdom.env({
			html:html,
			scripts:[jquery],
			done:function(err,window){
				if(err){
					deferred.reject(new Error('kongregate game search faild'));
				}else{
					var games = parse_kongregate(window);
					var t = new Date();
					console.log('search kongregate use '+(t-_t)+'ms');
					var result = {
						src:'kongregate',
						current_page:page,
						games:games
					}
					deferred.resolve(result);
				}
			}
		});
	});
	return deferred.promise;
}

function parse_kongregate(window){
	var $ = window.$;
	var games = [];
	_.forEach($('#results .search_result'),function(dom){
		var game = {
			title: '',
			title_en: $(dom).find('.result_title a').text(),
			description: $(dom).find('.regtext').text(),
			url: $(dom).find('.result_title a').attr('href'),
			img: $(dom).find('.thumb a img').attr('src'),
			date: moment($(dom).find('.game_date').text(), "MMM. DD,YYYY").toString(),
			src: "kongregate"
		}
		games.push(game);
	});
	return games;
}

function search_7k7k(keyword,page){
	var deferred = q.defer();

	page = page ? page : 1;
	var url = "http://so.7k7k.com/game/"+encodeURI(keyword)+"/click/1/0/0/-1/0/1/"+page+".htm";
	var _t = new Date();
	request({
		url:url,
		method:"GET",
		encoding:null
	},function(err,res,body){
		if(err)deferred.reject(new Error('7k7k game search faild'));
		var html = iconv.decode(new Buffer(body),'UTF8').toString();
		jsdom.env({
			html:html,
			scripts:[jquery],
			done:function(err,window){
				if(err){
					deferred.reject(new Error('7k7k game search faild'));
				}else{
					var games = parse_7k7k(window);
					var t = new Date();
					console.log('search 7k7k use '+(t-_t)+'ms');
					var result = {
						src:'7k7k',
						current_page:page,
						games:games
					}
					deferred.resolve(result);
				}
			}
		});
	});
	return deferred.promise;
}

function parse_7k7k(window){
	var $ = window.$;
	var games = [];
	_.forEach($('.lazyload-part li'),function(dom){
		var game = {
			title: $(dom).find('.game_name a').text(),
			title_en: '',
			description: $(dom).find('.game_info').text(),
			url: $(dom).find('.game_name a').attr('href'),
			img: $(dom).find('.game_pic img').attr('src'),
			date: moment($(dom).find('.game_name i').text().split('时间：')[1], "YYYY-MM-DD").toString(),
			src: "7k7k"
		}
		games.push(game);
	});
	return games;
}

function search_3366(keyword,page,sort){
	var deferred = q.defer();
	page = page ? page : 0;
	sort = sort ? sort : 'D';
	var url = "http://fcg.3366.com/fcg-bin/search/mgp_search?sk="+encodeURI(keyword)+"&pg="+page+"&ch=txt.result.t&osstype=&sorttype=N"+sort+"_0_rel_0&pp=20&type=&first=0&sCSRFToken=";
	var _t = new Date();
	request({
		url:url,
		method:"POST",
		encoding:null,
		headers: {
			"Cookie":"sitetipskey=0*1440039069912; visittime=1440039074837; pgv_info=pgvReferrer=&ssid=s6740680504; pgv_pvid=2266549208",
			"Host":"fcg.3366.com",
			"Origin":"http://fcg.3366.com",
			"Referer":"http://fcg.3366.com/jqproxy.html?qqgame_ajax_data138440",
			"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.155 Safari/537.36",
			"X-Requested-With":"XMLHttpRequest"
		}
	},function(err,res,body){
		if(err)deferred.reject(new Error('3366 game search faild'));
		var html = iconv.decode(new Buffer(body),'UTF8').toString();
		// html = html.split('var gMgpSearchResult = ')[1];
		// html = html.split(';')[0];
		eval(html);
		var games = [];
		_.forEach(gMgpSearchResult.search_result.result_list,function(obj){
			var meta = JSON.parse(obj.doc_meta);
			var game = {
				title: meta.TA,
				title_en: meta.TB,
				description: meta.TE,
				url: "http://www.3366.com/game/"+obj.doc_id+".shtml",
				img: "http://img4.3366img.com/fileupload/img/"+parseInt(obj.doc_id.substr(-2))+"/"+obj.doc_id+"_75_round.jpg",
				date: moment(meta.NE,'X').toString(),
				src: "3366"
			}
			games.push(game);
		});
		var result = {
			src:'3366',
			sort:{
				'最相关的':'D',
				'最新发布':'E',
				'最多人玩':'C',
				'评分最高':'B'
			},
			current_sort:sort,
			current_page:page,
			games:games,
		}
		var t = new Date();
		console.log('search 3366 use '+(t-_t)+'ms');
		deferred.resolve(result);
	});
	return deferred.promise;
}

function search_2144(keyword,page,sort){
	var deferred = q.defer();

	page = page ? page : 1;
	sort = sort ? sort : 'related';
	// http://search.2144.cn/index.php?keywords=%E8%8B%B1%E9%9B%84&sortby=score&page=2
	var url = "http://search.2144.cn/index.php?keywords="+encodeURI(keyword)+"&page="+page+"&sortby="+sort;
	var _t = new Date();
	request({
		url:url,
		method:"GET",
		encoding:null
	},function(err,res,body){
		if(err)deferred.reject(new Error('2144 game search faild'));
		var html = iconv.decode(new Buffer(body),'UTF8').toString();
		jsdom.env({
			html:html,
			scripts:[jquery],
			done:function(err,window){
				if(err){
					deferred.reject(new Error('2144 game search faild'));
				}else{
					var games = parse_2144(window);
					var t = new Date();
					console.log('search 2144 use '+(t-_t)+'ms');
					var result = {
						src:'2144',
						sort:{
							'推荐结果':'related',
							'最新发布':'updatetime',
							'最多人玩':'view',
							'评分排行':'score'
						},
						current_sort:sort,
						current_page:page,
						games:games
					}
					deferred.resolve(result);
				}
			}
		});
	});
	return deferred.promise;
}

function parse_2144(window){
	var $ = window.$;
	var games = [];
	_.forEach($('.searchitem li'),function(dom){
		var game = {
			title: $(dom).find('.stit0 h3 a').text(),
			title_en: '',
			description: $(dom).find('.scons').text(),
			url: $(dom).find('.stit0 h3 a').attr('href'),
			img: $(dom).find('.simg img').attr('src'),
			date: moment().toString(),
			src: "2144"
		}
		games.push(game);
	});
	return games;
}