<template>
    <div class="c-view-wrapper car-monitor">
        <div class="c-view-side c-view-left">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <left-top></left-top>
                    <circle-progress title="自动驾驶分布" :requestUrl="getAutoLevelStat"></circle-progress>
                    <circle-progress title="车辆用途" :requestUrl="getVehUsageStat"></circle-progress>
                    <driving-car-echarts title="在驶车辆"></driving-car-echarts>
                </div>
            </div>
        </div>
        <map-container></map-container>
        <div class="c-view-side c-view-right">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <right-list></right-list>
                </div>
            </div>
        </div>
        <more-btn></more-btn>
    </div>
</template>
<script>
import LeftTop from './components/index/leftTop.vue'
import CircleProgress from '@/components/circleProgress.vue'
import DrivingCarEcharts from '@/components/drivingCarEcharts.vue'
import MapContainer from './components/index/map.vue'
import RightList from './components/index/rightList.vue'
import MoreBtn from './components/index/moreBtn.vue'
import { getAutoLevelStat, getVehUsageStat } from "@/api/carMonitor"
export default {
    name: "CarMonitor",
    components: { LeftTop, CircleProgress, DrivingCarEcharts, MapContainer, RightList, MoreBtn },
    data () {
        return {
            getAutoLevelStat: getAutoLevelStat,
            getVehUsageStat: getVehUsageStat
        }
    },
    methods: {
    },
    mounted() {
    }
}
</script>
<style scoped lang="scss">
</style>
