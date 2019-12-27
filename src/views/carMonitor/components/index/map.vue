<template>
    <div class="c-view-main" :id="id"></div>
</template>
<script>
import ConvertCoord from '@/assets/js/utils/coordConvert.js'
import WebSocketObj from '@/assets/js/utils/webSocket.js'
export default {
    name: "MapContainer",
    data () {
        return {
            id: "car-map-container",
            AMap: null,
            // 获取在驶车辆实时数据（辆）
            webSocket:null,
            webSocketData:{
                "action": "vehicle",
                "body": {},
                "type": 4
            },
            // responseData: [],
            prevData: [],
            setFitViewFlag: true,
            timeOut:3000
        }
    },
    mounted() {
        this.AMap = new AMap.Map(this.id, window.defaultMapOption);
        setTimeout(()=>{
            this.AMap.setMapStyle(window.defaultMapOption.mapStyle);
        },0);
        this.initWebSocket();
    },
    methods: {
        initWebSocket(){
            this.webSocket = new WebSocketObj(this, window.config.socketUrl, this.webSocketData, this.onmessage);
        },
        onmessage(message){
            let _this = this;
            let jsonData = JSON.parse(message.data);

            let data = jsonData.result.data;
            let _result = {};
            let _filterData = {};
            for(let vehicleId in data){
                if(data[vehicleId]&&data[vehicleId].length>0){
                    _result[vehicleId] = data[vehicleId][data[vehicleId].length-1];
                    //过滤过路车
                    if (_result[vehicleId].type == 2) {
                        return;
                    }
                    _filterData[vehicleId] = {
                        vehicleId: _result[vehicleId].vehicleId,
                        plateNo: _result[vehicleId].plateNo,
                        source: _result[vehicleId].source.join(','),
                        heading: _result[vehicleId].heading,
                        speed: _result[vehicleId].speed,
                        position: ConvertCoord.wgs84togcj02(_result[vehicleId].longitude, _result[vehicleId].latitude),
                        marker: null,
                        plateNoMarker: null,
                    };
                }
            }
            if (Object.keys(_filterData).length>0) {
                for (let id in _this.prevData) {
                    if(_filterData[id]) {   //表示有该点，做setPosition
                        if(_this.prevData[id].timer){
                            clearTimeout(_this.prevData[id].timer)
                        }
                        let _currentCar = _filterData[id];
                        _this.prevData[id].marker.setAngle(_currentCar.heading);
                        _this.prevData[id].marker.setPosition(_currentCar.position);
                        _this.prevData[id].plateNoMarker.setText(_currentCar.plateNo+"<br/><span style='color:#e6a23c'>"+_currentCar.source+'</span>');
                        _this.prevData[id].plateNoMarker.setPosition(_currentCar.position);
                    }
                }
                for (let id in _filterData) {
                    if(!_this.prevData[id]) {   //表示新增该点，做add
                        _this.addMarker(id,_filterData);
                        _this.addPlateNoMarker(id,_filterData);
                    }
                }

                if(_this.setFitViewFlag) {
                    setTimeout(()=>{
                        _this.AMap.setFitView();
                        _this.setFitViewFlag = false;
                    },500)
                }


                // _this.prevData[_filterData.vehicleId] = _filterData;
                // console.log(_this.prevData)
                for(let vehicleId in data){
                    _this.prevData[vehicleId].timer = setTimeout(() => {
                       // _this.prevData[vehicleId].plateNoMarker.setText(data[vehicleId][0].plateNo+"<br/><span style='color:red'>离线</span>")
                        //3s后消失
                        _this.prevData[vehicleId].marker.off('click', _this.showView);
                        _this.prevData[vehicleId].plateNoMarker.off('click', _this.showView);
                        _this.AMap.remove(_this.prevData[vehicleId].marker);
                        _this.AMap.remove(_this.prevData[vehicleId].plateNoMarker);
                        console.log("消失车辆",vehicleId)
                        delete _this.prevData[vehicleId];
                    }, this.timeOut);
                }
            // } else {
            //     // 返回的数据为空
            //     for (let id in _this.prevData) {
            //         // console.log("delete:-"+_this.prevData[id].plateNo);
            //         _this.prevData[id].marker.off('click', _this.showView);
            //         _this.prevData[id].plateNoMarker.off('click', _this.showView);
            //         _this.AMap.remove(_this.prevData[id].marker);
            //         _this.AMap.remove(_this.prevData[id].plateNoMarker);
            //         delete _this.prevData[id];
            //     }
            }
        },
        addMarker(id,_filterData) {
            this.prevData[id] = new Object();
            this.prevData[id].marker = new AMap.Marker({
                map: this.AMap,
                position: _filterData[id].position,
                icon: "static/images/car/point.png",
                offset: new AMap.Pixel(-2, -2),
                angle: _filterData[id].heading,
                zIndex: 50,
                vehicleId: _filterData[id].vehicleId
            });
            /*this.prevData[id] = new Object();
            this.prevData[id].marker = marker;*/
            this.prevData[id].marker.on('click', this.showView);
        },
        addPlateNoMarker(id,_filterData) {
            this.prevData[id].plateNoMarker = new AMap.Text({
                map: this.AMap,
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
                offset: new AMap.Pixel(0, -35),
                position: _filterData[id].position,
                vehicleId: _filterData[id].vehicleId,
                zIndex: 60
            });
            this.prevData[id].plateNoMarker.on('click', this.showView);
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
    },
    destroyed(){
        //销毁Socket
        this.webSocket&&this.webSocket.webSocket.close();
    }
}
</script>
<style scoped lang="scss">
</style>
