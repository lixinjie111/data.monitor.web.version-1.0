<template>
  <ul class="c-info-wrap clearfix">
    <li class="c-info-list">
    	<p class="c-info-title">路测点</p>
    	<p class="c-info-text">{{parseFloat(responseData.vehNum).toLocaleString() || '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">RCU</p>
    	<p class="c-info-text">{{parseFloat(responseData.totalMileage).toLocaleString() || '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">红绿灯</p>
    	<p class="c-info-text">{{responseData.totalTime || '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">路侧雷达</p>
    	<p class="c-info-text">{{responseData.avgTime || '--'}}</p>
    </li>
    <li class="c-info-list">
      <p class="c-info-title">监控摄像头</p>
      <p class="c-info-text">{{responseData.avgTime || '--'}}</p>
    </li>
    <li class="c-info-list">
      <p class="c-info-title">智能摄像头</p>
      <p class="c-info-text">{{responseData.avgTime || '--'}}</p>
    </li>
  </ul>
</template>

<script>
import { getTotalStat } from '@/api/carMonitor'
export default {
	name: 'LeftTop',
	data () {
		return {
			responseData: {}
		}
	},
	mounted() {
		this.getTotalStat();
	},
	methods: {
		getTotalStat() {
            // console.log('获取车辆信息');
            getTotalStat().then(res => {
                this.responseData = res.data;
            });
        }
	}
}
</script>
<style lang="scss" scoped>

</style>
