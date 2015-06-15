'use strict';

function requireLogin(req,res,next){
	if(req.session.user){
		next();
		return true;
	}else{
		res.redirect('/login');
	}

}

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