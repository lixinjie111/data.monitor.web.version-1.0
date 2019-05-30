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
            }
        }
    },
    methods: {
    },
    mounted() {
        this.AMap = new AMap.Map(this.id, this.mapOption);
    }
}
</script>
<style scoped lang="scss">
</style>
