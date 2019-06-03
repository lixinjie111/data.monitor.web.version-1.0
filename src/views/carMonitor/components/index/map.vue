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
            mapOption: {  
                center: this.$parent.defalutCenterPoint,
                zoom: 11,
                mapStyle: "amap://styles/7b007636f01d8a19e9cc2841a85dc083"
            },
            // 获取在驶车辆实时数据（辆）
            webSocket:{},
            webSocketData: {
                action: "trackAll",
                token: 'fpx',
                vehicleId: 'trackAll'
            },
            responseData: {},

            wholeData: [],
            count: 0,
            flag: true
        }
    },
    mounted() {
        this.initWebSocket();
        this.AMap = new AMap.Map(this.id, this.mapOption);
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
                _result = _json.result,
                _vehicleId = _result.vehicleId;
                // _result = {
                //     acceleration: 0
                //     alt: 0
                //     gpsTime: 1559185216693
                //     heading: 180.01354098548435
                //     icon: ""
                //     latitude: 31.2938845750231
                //     longitude: 120.76585657889538
                //     source: ["bsm"]
                //     speed: 100.75319017246728
                //     vehicleId: "B21E-00-024"
                //     platNo: "京N123456"
                // }
            let _option = {
                vehicleId: _vehicleId,
                platNo: _result.platNo,
                angle: _result.heading,
                position: new AMap.LngLat(_result.longitude, _result.latitude)
            };
            this.wholeData.push(_option);

            this.changeLngLat();
        },
        changeLngLat(){
            var _this = this;
            if(this.flag && this.count < this.wholeData.length){
                this.flag = false;
                let _filterCurData = this.wholeData[this.count];
                if(!_this.responseData[_filterCurData.vehicleId]) {
                    _this.responseData[_filterCurData.vehicleId] = {
                        marker: null,
                        platNoMarker: null
                    }
                }
                AMap.convertFrom(this.wholeData[this.count].position, 'gps', function (status, result){
                    if (result.info === 'ok') {
                        let _point = result.locations[0];
                        //绘制线的轨迹
                        _this.drawMarker(_filterCurData, _point);

                        _this.count++;
                        _this.flag = true;
                        _this.changeLngLat();
                    }
                });
            }
        },
        drawMarker(curData, point) {
            let _this = this,
                _data = this.responseData[curData.vehicleId];
            if(_data.marker) {
                _data.marker.setPosition(point);
                _data.marker.setAngle(curData.angle);
                _data.platNoMarker.setPosition(point);
            }else {
                _data.marker = new AMap.Marker({
                    map: _this.AMap,
                    position: point,
                    icon: "static/images/car/point.png",
                    offset: new AMap.Pixel(-2, -2),
                    angle: curData.angle,
                    zIndex: 50
                });
                let _random = Math.floor(Math.random()*2);
                // console.log(_random);
                _data.platNoMarker = new AMap.Text({
                    text: curData.platNo,
                    // text: '京N123456',
                    anchor: 'center', // 设置文本标记锚点
                    // angle: curData.angle,
                    style: {
                        'padding': '0 5px',
                        'border-radius': '4px',
                        'background-color': 'rgba(55, 186, 123, .2)',
                        'border-width': 0,
                        'text-align': 'center',
                        'font-size': '10px',
                        'line-height': '16px',
                        'letter-spacing': '0',
                        // 'margin-top': '-16px',  //车尾
                        'margin-top': '14px',  //车头
                        // 'margin-top': _random ? '-16px' : '14px',
                        // 'margin': '16px 80px 0 0',
                        'color': '#ccc'
                    },
                    position: point
                });
                _data.platNoMarker.setMap(this.AMap);
            }
            // 缩放地图到合适的视野级别
            this.AMap.setFitView();
        },
        onclose(data){
            console.log("结束--trackAll--连接");
        },
        onopen(data){
            // console.log("建立--trackAll--连接");
            //行程
            this.sendMsg(JSON.stringify(this.webSocketData));
        },
        sendMsg(msg) {
            // console.log("trackAll--连接状态："+this.webSocket.readyState);
            if(window.WebSocket){
                if(this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                    // console.log("trackAll--已发送消息:"+ msg);
                }
            }else{
                return;
            }
        }
    }
}
</script>
<style scoped lang="scss">
</style>
