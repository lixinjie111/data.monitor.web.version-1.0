<template>
    <div class="data-monitor">
        <el-button type="primary" class="c-view-btn" @click="showView">查看"数据概览"大屏视图</el-button>
    </div>
</template>
<script>
export default {
    name: "DataMonitor",
    data () {
        return {}
    },
    methods: {
        showView() {
            const { href } = this.$router.resolve({
                name: 'DataViewMonitor'
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
