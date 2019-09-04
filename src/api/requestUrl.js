let HTTPURL = '';
let OPERATEURL = '';
let DLURL = '';
let ROADURL = '';
let TESTHTTPURL = '';



if(process.env.NODE_ENV == 'development') { // 开发环境
    HTTPURL = window.config.url;
    OPERATEURL = window.config.operateUrl;
    DLURL = window.config.dlUrl;
    // DLURL = '/apiUrl/';
    ROADURL = window.config.roadUrl;
    TESTHTTPURL = window.config.testUrl;
    // console.log("----------"+ROADURL);
}else {
    HTTPURL = window.config.url;
    OPERATEURL = window.config.operateUrl;
    DLURL = window.config.dlUrl;
    // DLURL = '/apiUrl/';
    ROADURL = window.config.roadUrl;
    TESTHTTPURL = window.config.testUrl;
    // console.log("----------"+ROADURL);
}

export {
    HTTPURL,
    OPERATEURL,
	DLURL,
  	ROADURL,
    TESTHTTPURL

}
