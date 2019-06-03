
<template>
	<ul class="echarts-list-wrap clearfix">
		<li class="echarts-list" v-for="(item, index) in responseData">
			<p class="echarts-list-title">{{item.scatName}}</p>
			<div class="echarts-list-box" :id="item.id"></div>
		</li>
	</ul>
</template>

<script>
import { getRouteStat } from '@/api/carMonitor'
export default {
	name: 'BarHorizontalEcharts',
	props: {
		dialogVisible: Boolean,
		resizeFlag: Boolean
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
					if(this.loaded) {
						this.changeRander();
					}else {
						this.loaded = true;
					}
				}
			}
		},
		loaded: {
			handler(newVal, oldVal) {
				if(newVal) {
					this.getRouteStat();
				}
			}
		},
		resizeFlag: {
			handler(newVal, oldVal) {
				if(newVal) {
					// console.log('改变窗口');
					this.changeRander();
					this.$emit("alreadyRender", 'resizeFlagHorizontal');
				}
			}
		}
	},
	methods: {
		getRouteStat() {
            // console.log('获取行程分析（近30天）');
			getRouteStat().then(res => {
				let _responseData = res.data.data,
					_defaultOption = this.defaultOption();

				this.responseData = _responseData.map((item, index) => {
					item.id = "echarts-bar-horizontal-" + index;
					item.echarts = null;
					return item;
				});

				setTimeout(() => {
					this.responseData.forEach(item => {
						if(item.data.length > 0) {
							if(!item.echarts) {
								item.echarts = this.$echarts.init(document.getElementById(item.id));
							}
							let _option = this.defaultOption(item.data);
							item.echarts.setOption(_option);
						}
					});
				}, 0);
			});
		},
		changeRander() {
			this.responseData.forEach(item => {
            	if(item.echarts) {
					item.echarts.resize();
            	}else {
            		if(item.data.length > 0) {
						item.echarts = this.$echarts.init(document.getElementById(item.id));
						let _option = this.defaultOption(item.data);
						item.echarts.setOption(_option);
					}
				}
			});
		},
		defaultOption(data) {
			let option = {
					dataset: {
						source: data
				        // source: [
				        //     {name: '0-3', count: 89.3},
				        //     {name: '3-6', count: 57.1},
				        //     {name: '6-9', count: 74.4},
				        //     {name: '9-12', count: 50.1},
				        //     {name: '12-15', count: 89.7},
				        //     {name: '15-18', count: 57.1},
				        //     {name: '18-21', count: 74.4},
				        //     {name: '21-24', count: 89.}
				        // ]
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
			                x: 'name',
			                y: 'count'
			            },
			    		barCategoryGap: '50%'
			        }
				};
			return option;
		}
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/echarts.scss";
</style>
