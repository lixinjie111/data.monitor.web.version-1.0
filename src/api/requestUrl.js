let HTTPURL = '';
let ROADURL = '';

if(process.env.NODE_ENV == 'development') { // 开发环境
    HTTPURL = window.cfg.url;
    ROADURL = window.cfg.roadUrl;
    console.log("----------"+ROADURL);
}else {
    HTTPURL = window.cfg.url;
    ROADURL = window.cfg.roadUrl;
    console.log("----------"+ROADURL);
}

export {
	HTTPURL,
  ROADURL
}
