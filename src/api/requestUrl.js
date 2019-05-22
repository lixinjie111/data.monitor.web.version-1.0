let HTTPURL = '';

if(process.env.NODE_ENV == 'development') { // 开发环境
    HTTPURL = window.cfg.url;
}else {
    HTTPURL = window.cfg.url;
}

export {
	HTTPURL
} 