<template>
  <ul class="c-info-wrap clearfix">
    <li class="c-info-list">
    	<p class="c-info-title">路测点</p>
    	<p class="c-info-text">{{responseData.sideCount}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">RSU</p>
    	<p class="c-info-text">{{responseData.rsuCount}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">红绿灯</p>
    	<p class="c-info-text">{{responseData.lightCount}}</p>
    </li>
    <li class="c-info-list">
    	<p class="c-info-title">路侧雷达</p>
    	<p class="c-info-text">{{responseData.radarCount}}</p>
    </li>
    <li class="c-info-list">
      <p class="c-info-title">RCU</p>
      <p class="c-info-text">{{responseData.rcuCount}}</p>
    </li>
    <li class="c-info-list">
      <p class="c-info-title">摄像头</p>
      <p class="c-info-text">{{responseData.videoCount}}</p>
    </li>
  </ul>
</template>

<script>
import { getDevCount } from '@/api/sideDeviceMonitor'
export default {
	name: 'LeftTop',
	data () {
		return {
			responseData: {
			  'videoCount':0,
        'radarCount':0,
        'lightCount':0,
        'rcuCount':0,
        'rsuCount':0,
        'sideCount':0
      }
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

</style>
