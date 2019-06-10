let HTTPURL = '';
let DLURL = '';
let ROADURL = '';

if(process.env.NODE_ENV == 'development') { // 开发环境
    HTTPURL = window.cfg.url;
    DLURL = window.cfg.dlUrl;
    // DLURL = '/apiUrl/';
    ROADURL = window.cfg.roadUrl;
    console.log("----------"+ROADURL);
}else {
    HTTPURL = window.cfg.url;
    DLURL = window.cfg.dlUrl;
    // DLURL = '/apiUrl/';
    ROADURL = window.cfg.roadUrl;
    console.log("----------"+ROADURL);
}

export {
	HTTPURL,
	DLURL,
  	ROADURL
}
