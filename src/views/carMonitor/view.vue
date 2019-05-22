<template>
    <div class="car-view-monitor">
        <el-button type="primary" class="c-view-btn" @click="showView">查看"单车监控"大屏视图</el-button>
    </div>
</template>
<script>
export default {
    name: "CarViewMonitor",
    components: {},
    data () {
        return {

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
    mounted () {
    }
}
</script>
<style scoped lang="scss">
</style>
