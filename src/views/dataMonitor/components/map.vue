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
            linePath: [
                [new AMap.LngLat(121.458138,31.230116), new AMap.LngLat(121.466721,31.215583)],
                [new AMap.LngLat(121.508606,31.229676), new AMap.LngLat(121.498821,31.187685)]
            ],
            linePolygon: [
                [
                    new AMap.LngLat(121.467064,31.20002),
                    new AMap.LngLat(121.487148,31.193266),
                    new AMap.LngLat(121.467064,31.189888)
                ],
                [
                    new AMap.LngLat(121.477707,31.213675),
                    new AMap.LngLat(121.471012,31.19958),
                    new AMap.LngLat(121.498135,31.201342)
                ],
                [
                    new AMap.LngLat(121.502426,31.21573),
                    new AMap.LngLat(121.499165,31.203691),
                    new AMap.LngLat(121.514614,31.206187)
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
        this.AMap = new AMap.Map(this.id, this.$parent.$parent.defaultMapOption);
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
            this.$parent.$parent.changeCenterPoint = this.AMap.getCenter();
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
