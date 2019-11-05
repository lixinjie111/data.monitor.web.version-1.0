<template>
  <ul class="c-info-wrap clearfix">
    <li class="c-info-list">
    	<p class="c-info-title">车辆总数(辆)</p>
    	<p class="c-info-text">{{filterData.vehNum || '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">总里程(公里)</p>
    	<p class="c-info-text">{{filterData.totalMileage || '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">总时长(小时)</p>
    	<p class="c-info-text">{{filterData.totalTime || '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">平均时长(分钟)</p>
    	<p class="c-info-text">{{filterData.avgTime || '--'}}</p>
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
    computed: {
        filterData() {
            let _filterData = {};
            for(let attr in this.responseData) {
                // _filterData[attr] = parseFloat(this.responseData[attr]).toLocaleString() || '--';
                _filterData[attr] = parseFloat(this.responseData[attr]).toString() || '--';
            }
            return _filterData;
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
