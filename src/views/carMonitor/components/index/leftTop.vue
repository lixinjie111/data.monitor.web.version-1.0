<template>
  <ul class="c-info-wrap clearfix">
    <li class="c-info-list">
    	<p class="c-info-title">车辆总数(辆)</p>
    	<p class="c-info-text">{{parseFloat(responseData.vehNum).toLocaleString() || '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">总里程(公里)</p>
    	<p class="c-info-text">{{parseFloat(responseData.totalMileage).toLocaleString() || '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">总时长(小时)</p>
    	<p class="c-info-text">{{responseData.totalTime || '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">平均时长(分钟)</p>
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
