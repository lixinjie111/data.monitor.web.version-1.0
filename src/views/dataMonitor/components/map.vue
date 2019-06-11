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
            AMap: null,
            // setCenter: [121.262939,31.245149]
        }
    },
    mounted() {
        this.AMap = new AMap.Map(this.id, this.$parent.$parent.defaultMapOption);
        // this.AMap.on( 'click',  function (e) {
        //     console.log(e.lnglat.toString());
        // });
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
            wms.setMap(this.AMap);
            this.AMap.setZoom(12);
            // this.AMap.setCenter(this.setCenter);
            this.$parent.$parent.changeCenterPoint = this.setCenter;
            // this.$parent.$parent.changeCenterPoint = this.AMap.getCenter();
        }
    }
}
</script>
<style scoped lang="scss">
</style>
