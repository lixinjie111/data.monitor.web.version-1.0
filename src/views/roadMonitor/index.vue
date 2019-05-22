<template>
	<div class="road-monitor">
        <el-button type="primary" class="c-view-btn" @click="showView">查看"路测监控"大屏视图</el-button>
    </div>
</template>
<script>
export default {
  	name: "RoadMonitor",
    data () {
		return {}
    },
    methods: {
        showView() {
            const { href } = this.$router.resolve({
                name: 'RoadViewMonitor'
            })
            window.open(href, '_blank')
        }
    },
    mounted () {

    }
}
</script>
<style scoped></style>
