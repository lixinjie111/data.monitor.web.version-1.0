<template>
    <div class="c-view-main" :id="id"></div>
</template>
<script>
import { getRoadCenterIds, getRoadCenterPoints } from '@/api/dataMonitor'
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
