<template>
    <div class="car-monitor">
        <el-button type="primary" class="c-view-btn" @click="showView">查看"车辆监控"大屏视图</el-button>
    </div>
</template>
<script>
// import LeftCar from './components/leftCar.vue'
// import HeaderCar from './components/headerCar.vue'
// import RightCar from './components/rightCar.vue'
// import MainCar from './components/mainCar.vue'
// import BottomCar from './components/bottomCar.vue'
export default {
    name: "CarMonitor",
    components: {},
    data () {
        return {

        }
    },
    methods: {
        showView() {
            const { href } = this.$router.resolve({
                name: 'CarViewMonitor'
            })
            window.open(href, '_blank')
        }
    },
    mounted () {
    }
}
</script>
<style scoped lang="scss">
</style>
