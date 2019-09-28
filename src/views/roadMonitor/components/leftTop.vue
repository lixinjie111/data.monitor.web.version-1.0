<template>
    <ul class="c-car-list c-info-wrap clearfix">
      <li class="c-info-list">
        <p class="c-info-title">总里程(公里)</p>
        <p class="c-info-text">{{filterData.distance|| '--'}}</p>
      </li>
      <li class="c-info-list">
        <p class="c-info-title">路口数</p>
        <p class="c-info-text">{{filterData.crossing|| '--'}}</p>
      </li>
      <li class="c-info-list">
        <p class="c-info-title">红绿灯数</p>
        <p class="c-info-text">{{filterData.trafficLight|| '--'}}</p>
      </li>
      <li class="c-info-list">
        <p class="c-info-title">路侧点数</p>
        <p class="c-info-text">{{filterData.roadSide|| '--'}}</p>
      </li>
    </ul>
</template>

<script>
import { totalData } from '@/api/roadMonitor'
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
              _filterData[attr] = parseFloat(this.responseData[attr]).toLocaleString() || '--';
          }
          return _filterData;
      }
  },
	methods: {
    getTotalData() {
      totalData().then(res => {
        this.responseData = res.data;
        // this.responseData.distance = (this.responseData.distance/1000).toFixed(1);
      });
    },
    toThousands(num) {
      var result = '', counter = 0;
      num = (num || 0).toString();
      for (var i = num.length - 1; i >= 0; i--) {
        if(i>1){
          counter++;
        }
        result = num.charAt(i) + result;
        if (!(counter % 3) && i != 0) { result = ',' + result; }
      }
      return result;
    }
	},
  mounted() {
    this.getTotalData();

  },
}
</script>
<style scoped lang="scss">
.c-info-wrap {
  padding: 0 0 0 40px;
}
</style>
