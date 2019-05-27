
<template>
	<ul class="echarts-list-wrap clearfix">
		<li class="echarts-list">
			<p class="echarts-list-title">行驶里程Top5</p>
			<div class="echarts-list-box" id="echarts-bar-verticals"></div>
		</li>
		<!-- <li class="echarts-list">
			<p class="echarts-list-title">行驶时长Top5</p>
			<div class="echarts-list-box" id="echarts-2-2"></div>
		</li> -->
	</ul>
</template>

<script>
// import { requestGetShareData } from './api/share'
export default {
	name: 'BarVerticalEcharts',
	props: {
		dialogVisible: Boolean
	},
	data () {
		return {
			echarts: null,
			echartsOption: {
			    dataset: {
			        source: [
			            {name:'沪A898810', value: 89.3},
			            {name:'沪A898811', value: 57.1},
			            {name:'沪A898812', value: 74.4},
			            {name:'沪A898813', value: 50.1},
			            {name:'沪A898814', value: 89.7}
			        ]
			    },
			    grid: {
			    	left: 124,
			    	right: 40,
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
			    	show: false
			    },
			    yAxis: {
			    	type: 'category',
			    	boundaryGap: false,
			    	axisLine:{
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    axisLabel:{
                        color:'#ccc',
                        fontSize: 14,
                        fontFamily: 'MicrosoftYaHei'
                    }
			    },
			    series: {
		            type: 'bar',
		            encode: {
		                x: 'value',
		                y: 'name'
		            },
		    		barCategoryGap: '50%',
		    		label: {
		    			show: true,
		    			distance: 10,
		    			position: 'right',
		    			// position: 'insideRight',
		    			color: '#fff'
		    		}
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
							console.log("初始化echarts-bar-verticals实例");
							this.echarts = this.$echarts.init(document.getElementById("echarts-bar-verticals"));
							this.echarts.setOption(this.echartsOption);
						}
						// console.log("重新设置echarts-bar-verticals参数");
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
