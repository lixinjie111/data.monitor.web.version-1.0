<template>
    <div class="c-view-main" :id="id"></div>
</template>
<script>
import { getRoadData } from '@/api/dataMonitor'
export default {
    name: "MapContainer",
    data () {
        return {
            id: "data-map-container",
            AMap: null,
            mapOption: {  
                center: this.$parent.defalutCenterPoint,
                zoom: 11,
                mapStyle: "amap://styles/7b007636f01d8a19e9cc2841a85dc083"
            },
            linePath: [
                [new AMap.LngLat(116.41, 39.93), new AMap.LngLat(116.43, 39.91)],
                [new AMap.LngLat(116.380823,39.944022), new AMap.LngLat(116.370438,39.929083)]
            ],
            linePolygon: [
                [
                    new AMap.LngLat(116.40654,39.946872),
                    new AMap.LngLat(116.404191,39.932851),
                    new AMap.LngLat(116.413053,39.936289)
                ],
                [
                    new AMap.LngLat(116.40786,39.95251),
                    new AMap.LngLat(116.401079,39.939415),
                    new AMap.LngLat(116.429146,39.938692)
                ],
                [
                    new AMap.LngLat(116.46, 39.93),
                    new AMap.LngLat(116.44, 39.91),
                    new AMap.LngLat(116.49, 39.91)
                ]
            ],
            polygonStyle: [
                // 深绿-无边框
                {
                    fillColor: "#08a225",
                    fillOpacity: 0.4,
                    strokeColor: "transparent"
                },
                // 浅绿-有边框
                {
                    fillColor: "#6fb07d",
                    fillOpacity: 0.1,
                    strokeWeight: 1,
                    strokeStyle: "solid",
                    strokeColor: "#6fb07d"
                },
                // 灰色-无边框
                {
                    fillColor: "#c9c9c9",
                    fillOpacity: 0.32,
                    strokeColor: "transparent"
                }
            ]
        }
    },
    mounted() {
        this.AMap = new AMap.Map(this.id, this.mapOption);
        this.getRoadData();
    },
    methods: {
        getRoadData() {
            // console.log('获取路网信息（地图呈现）数据');
            // getRoadData().then(res => {
            //     console.log(res);
                // 画线
                if(this.linePath && this.linePath.length) {
                    this.linePath.forEach((item, index) => {
                        this.drawLine(index);
                    });
                }
                // 画区域
                if(this.linePolygon && this.linePolygon.length) {
                    this.linePolygon.forEach((item, index) => {
                        this.drawPolygon(index);
                    });
                }

            // });
        },
        drawLine(i) {
            let _this = this;
            new AMap.Polyline({
                map: _this.AMap,
                path: _this.linePath[i],
                strokeColor: "#6fb07d",
                strokeWeight: 1,
                strokeStyle: "solid",
                lineJoin: 'round',
                lineCap: 'round',
                zIndex: 50
            });
            // 缩放地图到合适的视野级别
            this.AMap.setFitView();
        },
        drawPolygon(i) {
            let _this = this,
                _style = this.polygonStyle[i%3],
                _defaultOption = {
                    map: _this.AMap,
                    path: _this.linePolygon[i],
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
