<template>
    <div class="c-view-wrapper car-monitor">
        <div class="c-view-side c-view-left">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <left-top></left-top>
                    <left-middle :title="circleTitleOne"></left-middle>
                    <left-middle :title="circleTitleTwo"></left-middle>
                    <left-bottom :title="circleTitleThree"></left-bottom>
                </div>
            </div>
        </div>
        <div class="c-view-main" id="map-container"></div>
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
import LeftMiddle from './components/index/leftMiddle.vue'
import LeftBottom from './components/index/leftBottom.vue'
import RightList from './components/index/rightList.vue'
import MoreBtn from './components/index/moreBtn.vue'
// import Mask from './components/index/mask.vue'
export default {
    name: "CarMonitor",
    components: { LeftTop, LeftMiddle, LeftBottom, RightList, MoreBtn },
    data () {
        return {
            circleTitleOne: "自动驾驶分布",
            circleTitleTwo: "车辆用途",
            circleTitleThree: "在驶车辆",
            AMap: null,
            mapOption: {  
                center: [116.395577, 39.892257],
                zoom: 11,
                mapStyle: "amap://styles/7b007636f01d8a19e9cc2841a85dc083"
            }
        }
    },
    methods: {
        showView() {
            const { href } = this.$router.resolve({
                name: 'SingleCarMonitor',
                params: {
                    vehicleId: "B21E-00-017"
                }
            })
            window.open(href, '_blank')
        }
    },
    mounted() {
        this.AMap = new AMap.Map("map-container", this.mapOption);
    }
}
</script>
<style scoped lang="scss">
</style>
