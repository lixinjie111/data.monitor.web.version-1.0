<template>
  <ul class="c-info-wrap clearfix">
    <li class="c-info-list">
    	<p class="c-info-title">路测点</p>
    	<p class="c-info-text">{{filterData.sideCount|| '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">RSU</p>
    	<p class="c-info-text">{{filterData.rsuCount|| '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">红绿灯</p>
    	<p class="c-info-text">{{filterData.lightCount|| '--'}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">路侧雷达</p>
    	<p class="c-info-text">{{filterData.radarCount|| '--'}}</p>
    </li>
    <li class="c-info-list">
      <p class="c-info-title">RCU</p>
      <p class="c-info-text">{{filterData.rcuCount|| '--'}}</p>
    </li>
    <li class="c-info-list">
      <p class="c-info-title">摄像头</p>
      <p class="c-info-text">{{filterData.videoCount|| '--'}}</p>
    </li>
  </ul>
</template>

<script>
import { getDevCount } from '@/api/sideDeviceMonitor'
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
	mounted() {
		this.getDevCount();
	},
	methods: {
    getDevCount() {
      var _this = this;
        getDevCount().then(res => {
          var result = res.data;
          result.forEach(function (item) {
            if(item.type==1){
              _this.responseData.videoCount = item.count;
            }
            if(item.type==2){
              _this.responseData.radarCount = item.count;
            }
            if(item.type==3){
              _this.responseData.lightCount = item.count;
            }
            if(item.type==4){
              _this.responseData.rcuCount = item.count;
            }
            if(item.type==5){
              _this.responseData.rsuCount = item.count;
            }
            if(item.type==5){
              _this.responseData.sideCount = item.count;
            }
          })

        });
    }
	}
}
</script>
<style lang="scss" scoped>
  .c-info-wrap{
    margin-top: 0px!important;
  }
.c-info-list{
  padding:0!important;
}
</style>
