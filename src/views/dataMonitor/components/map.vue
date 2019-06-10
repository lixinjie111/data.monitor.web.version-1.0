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
        }
    }
}
</script>
<style scoped lang="scss">
</style>
