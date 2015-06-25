'use strict';

/**
 * 20150619
 * 认证用户登录
 * 未登录则调转登录页
 * @param  {Object}   req  请求对象
 * @param  {Object}   res  响应对象
 * @param  {Function} next 回调
 * @return {null}
 */
function requireLogin(req,res,next){
	if(req.session.user){
		next();
		return;
	}else{
		res.redirect('/login');
	}

}

/**
 * 20150619
 * 认证用户登录
 * 登录则调转首页
 * @param  {Object}   req  请求对象
 * @param  {Object}   res  响应对象
 * @param  {Function} next 回调
 * @return {null}
 */
function requireLoginRedirect(req,res,next){
	if(req.session.user){
		res.redirect('/');
	}else{
		next();
		return false;
	}
}

module.exports = requireLogin;

module.exports.redirect = requireLoginRedirect;