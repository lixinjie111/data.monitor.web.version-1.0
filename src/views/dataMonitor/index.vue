<template>
    <div class="c-view-wrapper car-monitor">
        <div class="c-view-side c-view-left">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                </div>
            </div>
        </div>
        <div class="c-view-main" id="map-container"></div>
        <div class="c-view-side c-view-right">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <div class="c-car-list">
                        <circle-progress title="道路级别"></circle-progress>
                    </div>
                    <div class="c-car-list">
                        <circle-progress title="设备良好"></circle-progress>
                    </div>
                    <div class="c-car-list">
                        <driving-car-echarts title="在驶车辆" id="driving-car-echarts-1"></driving-car-echarts>
                    </div>
                    <div class="c-car-list">
                        <driving-car-echarts title="平台数据" id="driving-car-echarts-2"></driving-car-echarts>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CircleProgress from '@/components/circleProgress.vue'
import DrivingCarEcharts from '@/components/drivingCarEcharts.vue'
export default {
    name: "DataMonitor",
    components: { CircleProgress, DrivingCarEcharts },
    data () {
        return {
            AMap: null,
            mapOption: {  
                center: [116.395577, 39.892257],
                zoom: 11,
                mapStyle: "amap://styles/7b007636f01d8a19e9cc2841a85dc083"
            }
        }
    },
    methods: {
    },
    mounted() {
        this.AMap = new AMap.Map("map-container", this.mapOption);
    }
}
</script>
<style scoped lang="scss">
.c-car-list {
    padding: 0 12px;
}
</style>
