let HTTPURL = '';
let ROADURL = '';

if(process.env.NODE_ENV == 'development') { // 开发环境
    HTTPURL = window.cfg.url;
    ROADURL = window.cfg.roadUrl;
}else {
    HTTPURL = window.cfg.url;
    ROADURL = window.cfg.roadUrl;
}

export {
	HTTPURL,
  ROADURL
}
