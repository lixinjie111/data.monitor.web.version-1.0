<template>
    <div class="c-view-main" :id="id"></div>
</template>
<script>
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
        this.AMap = new AMap.Map(this.id, window.defaultMapOption);
        setTimeout(()=>{
            this.AMap.setMapStyle(window.defaultMapOption.mapStyle);
        },0);
        // this.AMap.on( 'click',  function (e) {
        //     console.log(e.lnglat.toString());
        // });
        this.getWms();
    },
    methods: {
        getWms() {
            //	调用
            let _optionWms = Object.assign(
                {},
                window.dlWmsDefaultOption,
                {
                    params:{'LAYERS': window.dlWmsOption.LAYERS_dlzc, 'VERSION': window.dlWmsOption.VERSION}
                }
            );

            let _wms  = new AMap.TileLayer.WMS(_optionWms);


            _wms.setMap(this.AMap);
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
