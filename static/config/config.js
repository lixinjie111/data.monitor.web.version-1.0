window.config = {

    //望京 内网
    // staticUrl: "http://172.17.1.16:9090/", //静态文件路径
    // url: 'http://172.17.1.16:9093/monPlatApp/', //监控平台
    // operateUrl: 'http://172.17.1.16:9090/operateApp/',	//运营平台
    // websocketUrl:'ws://172.17.1.16:9982/mon',  //监控
    // socketUrl:'ws://172.17.1.16:9999/ws',  //影子系统
    // dlUrl: 'http://10.0.1.22:8085/', //迪路
    // dlWmsUrl: 'http://10.0.1.22:8080/', //迪路
    // picPath: 'http://172.17.1.16:9090/file', // 设备icon图片

    //望京 外网
    staticUrl: "http://120.133.21.14:9090/", //静态文件路径
    url: 'http://120.133.21.14:9093/monPlatApp/', //监控平台
    operateUrl: 'http://120.133.21.14:9090/operateApp/',    //运营平台
    websocketUrl:'ws://120.133.21.14:49982/mon',  //监控
    socketUrl:'ws://120.133.21.14:49999/ws',  //影子系统
    dlUrl: 'http://117.114.144.227:8085/', //迪路
    dlWmsUrl: 'http://117.114.144.227:8080/', //迪路
    picPath: 'http://120.133.21.14:9090/file', // 设备icon图片
    
    //测试环境 内网
    // staticUrl: "http://10.0.1.181:9090/", //静态文件路径
    // url: 'http://10.0.1.183:9093/monPlatApp/', //监控平台
    // operateUrl: 'http://10.0.1.181:9090/operateApp/',    //运营平台
    // websocketUrl:'ws://10.0.1.183:49982/mon',  //监控
    // socketUrl:'ws://10.0.1.182:49999/ws',  //影子系统
    // dlUrl: 'http://10.0.1.199:8085/', //迪路
    // dlWmsUrl: 'http://10.0.1.199:8080/', //迪路
    // picPath: 'http://10.0.1.181:9090/file', // 设备icon图片

    //上海正式环境  外网
    // staticUrl: "http://116.236.72.205:49092/", //静态文件路径 -- 影子服务器
    // url: 'http://116.236.72.206:49093/monPlatApp/', //监控平台
    // operateUrl: 'http://116.236.72.204:49090/operateApp/', //运营平台
    // websocketUrl:'ws://116.236.72.206:49982/mon',  //监控
    // socketUrl:'ws://116.236.72.205:49999/ws',  //影子系统
    // dlUrl: 'http://116.236.72.204:48085/', //迪路
    // dlWmsUrl: 'http://116.236.72.204:48080/', //迪路
    // picPath: 'http://116.236.72.204:49090/file', // 设备icon图片

    version: "1.2",       // 版本号
}
//地图额外配置项添加
window.mapOption = {
    // center: [121.551976, 31.276054], //上海-高德地图坐标点
    // center: [113.07876,28.255618],   //长沙-高德地图坐标点
    // mapStyleEmpty: "amap://styles/bc5a63d154ee0a5221a1ee7197607a00", // 纯灰色背景地图 路口
    mapStyleEmpty: "amap://styles/7b007636f01d8a19e9cc2841a85dc083", // 纯绿色背景地图 路口
    defaultCenterPoint :  [121.262939,31.245149],   // 上海默认中心点 --- 高德坐标点
    centerPoint :  [121.17265957261286,31.284096076877844],     // 数据概览 中心点位置(获取地理位置计算天气) --- 高德坐标点
    singlePoint:[121.18653381418872,31.274421462567677],    // 单车监控 大地图中心点 --- 高德坐标点
};
window.defaultMapOption = {
    center: window.mapOption.defaultCenterPoint,
    zoom: 11,       // 默认：比例尺显示100m
    resizeEnable: true, //是否监控地图容器尺寸变化
    rotateEnable: true,
    mapStyle: "amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8"
}
//路网配置参数
window.dlWmsOption = {
    'LAYERS_dlzc': 'shanghai_qcc:gd_dlzc',
    'LAYERS_gjlk': 'shanghai_qcc:dl_shcsq_wgs84_gjlk',
    'LAYERS_centerline': 'shanghai_qcc:gd_road_centerline',
    'LAYERS_laneavgspeed': 'shanghai_qcc:dl_shcsq_wgs84_laneavgspeed',
    'STYLES':'shanghai_qcc:dl_shcsq_wgs84_road_centerline_car_statistics',
    'VERSION':'1.1.0',
}
window.dlWmsDefaultOption = {
    url:window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
    blend: true,
    tileSize: 256,
    params:{}
}
// 3D地图范围默认参数配置
window.defaultMapParam = {
    x:121.1703343194661,
    y:31.28428377276655,
    z:16.421176839179324,
    radius:78.0534223809687,
    pitch:-0.28445655573236484,
    yaw:0.003034199561255946       
};

window.mapUrl=window.config.dlWmsUrl+"geoserver/gwc/service/wmts/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=shanghai_qcc:dl_shcsq_wgs84_zc_0709&STYLE=&FORMAT=image/png&TILEMATRIXSET=EPSG:900913&TileMatrix=EPSG:900913:{TileMatrix}&TileCol={TileCol}&TileRow={TileRow}"
window.defualtZ=0.1;
