<template>
	<div class="alert-monitor">
        <el-button type="primary" class="c-view-btn" @click="showView">查看"告警监控"大屏视图</el-button>
	</div>
</template>
<script>
export default {
  	name: "AlertMonitor",
    data () {
        return {}
    },
    methods: {
        showView() {
            const { href } = this.$router.resolve({
                name: 'AlertViewMonitor'
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
