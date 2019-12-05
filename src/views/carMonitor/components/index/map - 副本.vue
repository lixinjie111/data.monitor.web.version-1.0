<template>
    <div class="c-view-main" :id="id"></div>
</template>
<script>
import ConvertCoord from '@/assets/js/utils/coordConvert.js'
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
            prevVehiclesData: [],
            setFitViewFlag: true,
            count: 0,
            flag: true
        }
    },
    mounted() {
        this.initWebSocket();
        this.AMap = new AMap.Map(this.id, window.defaultMapOption);
    },
    methods: {
        initWebSocket(){
            // console.log('websocket获取地图行驶车辆展示');
            if ('WebSocket' in window) {
                this.webSocket = new WebSocket(window.config.socketUrl);  //获得WebSocket对象
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
            if (_result.length > 0) {
                console.log(_result.length);
                let _filterData = {};
                _result.forEach((item, index) => {
                    _filterData[item.vehicleId] = {
                        vehicleId: item.vehicleId,
                        plateNo: item.plateNo,
                        source: item.source.join(','),
                        heading: item.heading,
                        speed: item.speed,
                        position: ConvertCoord.wgs84togcj02(item.longitude, item.latitude),
                        marker: null,
                        plateNoMarker: null
                    };
                });
                for (let id in _this.prevVehiclesData) {
                    if(_filterData[id]) {   //表示有该点，做setPosition
                        console.log(_this.prevVehiclesData[id].plateNo, "moveTo");
                        _filterData[id].marker = _this.prevVehiclesData[id].marker;
                        let _currentCar = _filterData[id];
                        _filterData[id].marker.setAngle(_currentCar.heading);
                        _filterData[id].marker.moveTo(_currentCar.position, _currentCar.speed);
                        // _filterData[id].plateNoMarker.setPosition(_currentCar.position);
                    }else {   //表示没有该点，做remove
                        console.log(_this.prevVehiclesData[id].plateNo, "remove");
                        _this.prevVehiclesData[id].marker.off('click', _this.showView);
                        _this.prevVehiclesData[id].plateNoMarker.off('click', _this.showView);
                        _this.AMap.remove(_this.prevVehiclesData[id].marker);
                        _this.AMap.remove(_this.prevVehiclesData[id].plateNoMarker);
                    }
                }
                for (let id in _filterData) {
                    if(!_this.prevVehiclesData[id]) {   //表示新增该点，做add
                        console.log(_filterData[id].plateNo, "add");
                        _filterData[id].marker = new AMap.Marker({
                            map: _this.AMap,
                            position: _filterData[id].position,
                            icon: "static/images/car/point.png",
                            offset: new AMap.Pixel(-2, -2),
                            angle: _filterData[id].heading,
                            zIndex: 50,
                            vehicleId: _filterData[id].vehicleId
                        });
                        _filterData[id].plateNoMarker = new AMap.Text({
                            map: _this.AMap,
                            text: _filterData[id].plateNo+"<br/><span style='color:#e6a23c'>"+_filterData[id].source+'</span>',
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
                            position: _filterData[id].position,
                            vehicleId: _filterData[id].vehicleId
                        });
                        _filterData[id].marker.on('click', _this.showView);
                        _filterData[id].plateNoMarker.on('click', _this.showView);
                    }       
                }

                if(_this.setFitViewFlag) {
                    _this.AMap.setFitView();
                    _this.setFitViewFlag = false;
                }
                _this.prevVehiclesData = _filterData;
            } else {
                // 返回的数据为空
                for (let id in _this.prevVehiclesData) {
                _this.aMap.remove(_this.prevVehiclesData[id].marker);
                }
                _this.prevVehiclesData = {};
            }
        },
        showView(e) {
            const { href } = this.$router.resolve({
                name: 'SingleCarMonitor',
                params: {
                    vehicleId: e.target.get("vehicleId")
                }
            })
            window.open(href, '_blank')
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
        this.webSocket&&this.webSocket.close();
    }
}
</script>
<style scoped lang="scss">
</style>
