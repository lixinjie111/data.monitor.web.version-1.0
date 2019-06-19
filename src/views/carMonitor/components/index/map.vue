<template>
    <div class="c-view-main" :id="id"></div>
</template>
<script>
export default {
    name: "MapContainer",
    data () {
        return {
            id: "car-map-container",
            AMap: null,
            // 获取在驶车辆实时数据（辆）
            webSocket:{},
            webSocketData: {
                action: "vehicleOnline",
                token: 'fpx',
                vehicleId: 'vehicleOnline'
            },
            // responseData: [],
            responseDataDraw: [],
            setFitViewFlag: true,

            wholeData: [],
            count: 0,
            flag: true
        }
    },
    mounted() {
        this.initWebSocket();
        this.AMap = new AMap.Map(this.id, this.$parent.$parent.defaultMapOption);
    },
    methods: {
        initWebSocket(){
            // console.log('websocket获取地图行驶车辆展示');
            if ('WebSocket' in window) {
                this.webSocket = new WebSocket(window.cfg.socketUrl);  //获得WebSocket对象
            }
            this.webSocket.onmessage = this.onmessage;
            this.webSocket.onclose = this.onclose;
            this.webSocket.onopen = this.onopen;
            this.webSocket.onerror = this.onerror;
        },
        onmessage(message){
            let _this = this,
                _json = JSON.parse(message.data),
                _result = _json.result.allVehicle;
            if(_this.flag) {
                // console.log("绘制前--------");
                _this.flag = false;
                let _responseData = _result.map( item => {
                    let _option = {
                        vehicleId: item.vehicleId,
                        platNo: item.platNo,
                        source: item.source.join(','),
                        heading: item.heading,
                        position: new AMap.LngLat(item.longitude, item.latitude)
                    };
                    return _option;
                });
                // console.log(_responseData.length);
                _this.changeLngLat(_responseData);
            }
        },
        changeLngLat(_allPointData){
            let _this = this;
            _allPointData.forEach((item, index, arr) => {
                AMap.convertFrom(_allPointData[index].position, 'gps', function (status, result){
                    // console.log(result.info);
                    if (result.info === 'ok') {
                        let _point = result.locations[0];
                        _allPointData[index].position = _point;
                        _this.count ++;
                        if(_this.count == arr.length) {
                            //绘制线的轨迹
                            _this.drawMarker(_allPointData);
                        }
                    }
                });
            });
        },
        drawMarker(allPointData) {
            let _this = this,
                _responseDataDrawLength = _this.responseDataDraw.length,
                _allPointDataLength = allPointData.length;
            if(_responseDataDrawLength > 0) {
                for(let m = 0; m < _this.responseDataDraw.length; m++) {
                    _this.AMap.remove(_this.responseDataDraw[m].marker);
                    _this.AMap.remove(_this.responseDataDraw[m].platNoMarker);
                }
                _this.responseDataDraw = [];
            }
            for(let i = 0; i < _allPointDataLength; i++) {
                let _data = allPointData[i],
                    _markerObj = {
                        marker: null,
                        platNoMarker: null
                    };
                _markerObj.marker = new AMap.Marker({
                    map: _this.AMap,
                    position: _data.position,
                    icon: "static/images/car/point.png",
                    offset: new AMap.Pixel(-2, -2),
                    angle: _data.heading,
                    zIndex: 50
                });
                _markerObj.platNoMarker = new AMap.Text({
                    map: _this.AMap,
                    text: _data.platNo+"<br/><span style='color:#e6a23c'>"+_data.source+'</span>',
                    // text: '京N123456',
                    anchor: 'center', // 设置文本标记锚点
                    style: {
                        'padding': '0 5px',
                        'border-radius': '4px',
                        'background-color': 'rgba(55, 186, 123, .2)',
                        'border-width': 0,
                        'text-align': 'center',
                        'font-size': '10px',
                        'line-height': '16px',
                        'letter-spacing': '0',
                        'margin-top': '14px',  //车头
                        'color': '#ccc'
                    },
                    position: _data.position
                });
                _this.responseDataDraw.push(_markerObj);

                if(i == _allPointDataLength - 1) {
                    if(_this.setFitViewFlag) {
                        this.AMap.setFitView();
                        _this.setFitViewFlag = false;
                    }
                    setTimeout(() => {
                        _this.count = 0;
                        _this.flag = true;
                        // console.log("绘制结束--------");
                    }, 0);
                }
            }
        },
        onclose(data){
            // console.log("结束--vehicleOnline--连接");
        },
        onopen(data){
            // console.log("建立--vehicleOnline--连接");
            //行程
            this.sendMsg(JSON.stringify(this.webSocketData));
        },
        sendMsg(msg) {
            // console.log("vehicleOnline--连接状态："+this.webSocket.readyState);
            if(window.WebSocket){
                if(this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                    // console.log("vehicleOnline--已发送消息:"+ msg);
                }
            }else{
                return;
            }
        }
    },
    destroyed(){
        //销毁Socket
        this.webSocket.close();
    }
}
</script>
<style scoped lang="scss">
</style>
