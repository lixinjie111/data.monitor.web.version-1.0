<template>
    <div class="c-view-wrapper car-monitor">
        <div class="c-view-side c-view-left">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <left-item></left-item>
                </div>
            </div>
        </div>
        <map-container></map-container>
        <div class="c-view-side c-view-right">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <div class="c-car-list">
                        <circle-progress title="道路级别" :requestUrl="getRoadLevelStat"></circle-progress>
                    </div>
                    <div class="c-car-list">
                        <circle-progress title="设备良好率" type="2" :requestUrl="getDevStatusStat"></circle-progress>
                    </div>
                    <div class="c-car-list">
                        <driving-car-echarts title="在驶车辆"></driving-car-echarts>
                    </div>
                    <div class="c-car-list">
                        <platform-data-echarts title="平台数据"></platform-data-echarts>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import LeftItem from './components/leftItem.vue'
import MapContainer from './components/map.vue'
import CircleProgress from '@/components/circleProgress.vue'
import DrivingCarEcharts from '@/components/drivingCarEcharts.vue'
import PlatformDataEcharts from './components/platformDataEcharts.vue'
import { getRoadLevelStat, getDevStatusStat } from "@/api/dataMonitor"
export default {
    name: "DataMonitor",
    components: { LeftItem, MapContainer, CircleProgress, DrivingCarEcharts, PlatformDataEcharts },
    data () {
        return {
            getRoadLevelStat: getRoadLevelStat,
            getDevStatusStat: getDevStatusStat
        }
    },
    methods: {
    },
    mounted() {
    }
}
</script>
<style scoped lang="scss">
.c-car-list {
    padding: 0 12px;
}
</style>
