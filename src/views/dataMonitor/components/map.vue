<template>
    <div class="c-view-main" :id="id"></div>
</template>
<script>
import { getRoadCenterIds, getRoadCenterPoints } from '@/api/dataMonitor'
import result from '@/views/test/dlMapData.js'
// import result from '@/views/test/dlMapData2.js'
export default {
    name: "MapContainer",
    data () {
        return {
            id: "data-map-container",
            AMap: null
        }
    },
    mounted() {
        this.AMap = new AMap.Map(this.id, this.$parent.$parent.defaultMapOption);
        // this.getRoadCenterIds();
        // this.getRoadCenterPoints();
        this.getWms();
    },
    methods: {
        getWms() {
            var wms  = new AMap.TileLayer.WMS({
                url:'http://10.0.1.22:8080/geoserver/shanghai_qcc/wms',
                blend: false,
                tileSize: 256,
                params:{'LAYERS': 'shanghai_qcc:gd_road_centerline',VERSION:'1.1.0'}
            })
            wms.setMap(this.AMap)
        },
        getRoadCenterIds() {
            // console.log('获取路网信息（地图呈现）道路ID数据');
            getRoadCenterIds().then(res => {
                // console.log(res);
                // 画线
                // if(this.linePath && this.linePath.length) {
                //     this.linePath.forEach((item, index) => {
                //         this.drawLine(index);
                //     });
                // }
                // // 画区域
                // if(this.polygonPoint && this.polygonPoint.length) {
                //     this.polygonPoint.forEach((item, index) => {
                //         this.drawPolygon(index);
                //     });
                // }
            });
        },
        getRoadCenterPoints() {
            // console.log('获取路网信息（地图呈现）数据');
            getRoadCenterPoints({
                roadCenterId: ''
            }).then(res => {
                console.log(res);
                this.linePath = res.data;
                // 画线
                for(let attr in this.linePath) {
                    this.drawLine(attr);
                }
                // 画区域
                // for(let attr in this.polygonPoint) {
                //     this.drawPolygon(attr);
                // }
            });
        },
        drawLine(attr) {
            let _this = this;
            new AMap.Polyline({
                map: _this.AMap,
                path: _this.linePath[attr],
                strokeColor: "#6fb07d",
                strokeWeight: 1,
                strokeStyle: "solid",
                lineJoin: 'round',
                lineCap: 'round',
                zIndex: 50
            });
            // 缩放地图到合适的视野级别
            this.AMap.setFitView();
            this.$parent.$parent.changeCenterPoint = this.AMap.getCenter();
        },
        drawPolygon(attr) {
            let _this = this,
                _style = this.polygonStyle[Number(attr)%3],
                _defaultOption = {
                    map: _this.AMap,
                    path: _this.polygonPoint[attr],
                    zIndex: 50
                },
                _option = Object.assign(_defaultOption, _style);
                new AMap.Polygon(_option);
            // 缩放地图到合适的视野级别
            this.AMap.setFitView();
        }
    }
}
</script>
<style scoped lang="scss">
</style>
