
<template>
	<ul class="echarts-list-wrap clearfix">
		<li class="echarts-list">
			<p class="echarts-list-title">行程距离分布</p>
			<div class="echarts-list-box" id="echarts-bar-horizontal"></div>
		</li>
		<!-- <li class="echarts-list">
			<p class="echarts-list-title">行程时长分布</p>
			<div class="echarts-list-box" id="echarts"></div>
		</li>
		<li class="echarts-list">
			<p class="echarts-list-title">行程时段分布</p>
			<div class="echarts-list-box" id="echarts"></div>
		</li> -->
	</ul>
</template>

<script>
// import { requestGetShareData } from './api/share's
export default {
	name: 'BarHorizontalEcharts',
	props: {
		dialogVisible: Boolean
	},
	data () {
		return {
			echarts: null,
			echartsOption: {
				dataset: {
			        source: [
			            ['label', 'value'],
			            ['0-3', 89.3],
			            ['3-6', 57.1],
			            ['6-9', 74.4],
			            ['9-12', 50.1],
			            ['12-15', 89.7],
			            ['15-18', 57.1],
			            ['18-21', 74.4],
			            ['21-24', 89.7]
			        ]
			    },
			    grid: {
			    	left: 30,
			    	right: 30,
			    	top: 40,
			    	bottom: 40
			    },
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    color: "#41b27e",
			    xAxis: {
			        type: 'category',
			        boundaryGap: true,
			    	axisLine:{
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel:{
                        color:'#ccc',
                        fontSize: 12,
                        fontFamily: 'MicrosoftYaHei'
                    }
			    },
			    yAxis: {
			        show: false
			    },
			    series: {
		            type: 'bar',
		            encode: {
		                x: 'label',
		                y: 'value'
		            },
		    		barCategoryGap: '50%'
		        }
			}

		}
	},
	watch: {
      	deep: true,
		dialogVisible: {
			handler(newVal, oldVal) {
				if(newVal) {
					setTimeout(() => {
						if(!this.echarts) {
							console.log("初始化echarts-bar-horizontal实例");
							this.echarts = this.$echarts.init(document.getElementById("echarts-bar-horizontal"));
							this.echarts.setOption(this.echartsOption);
						}
						// console.log("重新设置echarts-bar-horizontal参数");
						// this.echarts.setOption(this.echartsOption);
					}, 100);
				}
			}
		}
	},
	created() {
	},
	mounted() {
	},
	methods: {
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/echarts.scss";
</style>
