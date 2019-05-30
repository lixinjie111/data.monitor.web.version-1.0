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
                // }
            AMap.convertFrom(new AMap.LngLat(_result.longitude, _result.latitude), 'gps', function (status, result){
                if (result.info === 'ok') {
                    let gaodePosition = result.locations[0];
                    if(!_this.responseData[_vehicleId]) {
                        _this.responseData[_vehicleId] = {
                            angle: _result.heading,
                            position: gaodePosition,
                            marker: null
                        }
                    }else {
                        _this.responseData[_vehicleId].position = gaodePosition;
                    }
                    _this.drawMarker(_vehicleId);
                }
            });
        },
        drawMarker(carId) {
            let _this = this,
                _data = this.responseData[carId];
            if(_data.marker) {
                _data.marker.setPosition(_data.position);
                _data.marker.setAngle(_data.angle);
            }else {
                _data.marker = new AMap.Marker({
                    map: _this.AMap,
                    position: _data.position,
                    icon: "static/images/car/point.png",
                    offset: new AMap.Pixel(-2, -37),
                    angle: _data.angle,
                    zIndex: 50
                });
            }
            // // 缩放地图到合适的视野级别
            this.AMap.setFitView();
        },
        onclose(data){
            console.log("结束--trackAll--连接");
        },
        onopen(data){
            console.log("建立--trackAll--连接");
            //行程
            this.sendMsg(JSON.stringify(this.webSocketData));
        },
        sendMsg(msg) {
            console.log("trackAll--连接状态："+this.webSocket.readyState);
            if(window.WebSocket){
                if(this.webSocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                    console.log("trackAll--已发送消息:"+ msg);
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
