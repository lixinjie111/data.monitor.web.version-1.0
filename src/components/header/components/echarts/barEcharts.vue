
<template>
	<div>
		<div class="echarts-list-box" id="myBarChart"></div>
	</div>
</template>

<script>
export default {
	props: {
		barEchartsData: Array,
		activeName: String,
		resizeBarFlag: Boolean
	},
	data () {
		return {
			myBarChart: null,
			loaded: false
		}
	},
	watch: {
		deep: true,
		activeName(newVal, oldVal) {
			if(newVal == 'tabTwo') {
				
				let _option = this.defaultOption();
				if(!this.myBarChart) {
					this.myBarChart = this.$echarts.init(document.getElementById('myBarChart'));
				}
				this.myBarChart.setOption(_option);
			}
		},
		resizeBarFlag: {
			handler(newVal, oldVal) {
				if(newVal) {
					this.changeRander();
					this.$emit("alreadyRender",'resizeBarFlag');
				}
			}
		}
	},
	computed: {
		filterData() {
			let _filterData = [];
			this.barEchartsData.map(x => {
				let obj = {};
				obj.value = x.count;
				obj.name = x.name;
				_filterData.unshift(obj);
			});
			return _filterData;
		}
	},
	methods: {
		// 根据窗口大小重新渲染
		changeRander() {
			let _option = this.defaultOption();
			// if(!this.myBarChart) {
			// 	this.myBarChart = this.$echarts.init(document.getElementById('myBarChart'));
			// }
			this.myBarChart = this.$echarts.init(document.getElementById('myBarChart'));
			this.myBarChart.setOption(_option);
		},
		defaultOption() {
			let option = {
				    dataset: {
				        source: this.filterData
				    },
				    grid: {
				    	left: 170,
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
	                        fontSize: 12,
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
			    			color: '#ccc',
	                        letterSpacing: 0
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

