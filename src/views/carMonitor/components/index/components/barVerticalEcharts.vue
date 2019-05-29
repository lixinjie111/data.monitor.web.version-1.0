
<template>
	<ul class="echarts-list-wrap clearfix">
		<li class="echarts-list" v-for="(item, index) in responseData">
			<p class="echarts-list-title">{{item.topFiveName}}</p>
			<div class="echarts-list-box" :id="item.id"></div>
		</li>
	</ul>
</template>

<script>
import { getActiveVehStat } from '@/api/carMonitor'
export default {
	name: 'BarVerticalEcharts',
	props: {
		dialogVisible: Boolean
	},
	data () {
		return {
			loaded: false,
			responseData: []
		}
	},
	watch: {
      	deep: true,
		dialogVisible: {
			handler(newVal, oldVal) {
				if(newVal) {
					this.loaded = true;
				}
			}
		},
		loaded: {
			handler(newVal, oldVal) {
				if(newVal) {
					this.getActiveVehStat();
				}
			}
		}
	},
	mounted() {
	},
	methods: {
		getActiveVehStat() {
            console.log('获取活跃车辆（近30天）');
			getActiveVehStat().then(res => {

				let _responseData = res.data.data,
					_defaultOption = this.defaultOption();

				this.responseData = _responseData.map((item, index) => {
					item.id = "echarts-bar-vertical-" + index;
					return item;
				});

				setTimeout(() => {
					this.responseData.forEach(item => {
						if(item.data.length > 0) {
							let _echarts = this.$echarts.init(document.getElementById(item.id)),
								_option = this.defaultOption(item.data);
							_echarts.setOption(_option);
						}
					});
				}, 0);
			});
		},
		defaultOption(data) {
			let option = {
				    dataset: {
				        source: data
				        // source: [
				        //     {platNo:'沪A898810', count: 89.3},
				        //     {platNo:'沪A898811', count: 57.1},
				        //     {platNo:'沪A898812', count: 74.4},
				        //     {platNo:'沪A898813', count: 50.1},
				        //     {platNo:'沪A898814', count: 89.7}
				        // ]
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
			                x: 'count',
			                y: 'platNo'
			            },
			    		barCategoryGap: '50%',
			    		label: {
			    			show: true,
			    			distance: 10,
			    			position: 'right',
			    			color: '#fff'
			    		}
			        }
				}
			return option;
		}
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/echarts.scss";
</style>
