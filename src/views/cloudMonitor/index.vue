<template>
    <div class="cloud-monitor">
        <el-button type="primary" class="c-view-btn" @click="showView">查看"云端监控"大屏视图</el-button>
    </div>
</template>
<script>
export default {
    name: "CloudMonitor",
    data () {
        return {}
    },
    methods: {
        showView() {
            const { href } = this.$router.resolve({
                name: 'CloudViewMonitor'
            })
            window.open(href, '_blank')
        }
    },
    mounted () {

    }
}
</script>
<style lang="scss" scoped>
</style>
