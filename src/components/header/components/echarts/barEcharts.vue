<template>
	<div class="echarts-list-box" :id="id"></div>
</template>

<script>
export default {
	props: {
		barEchartsData: Array,
		activeName: String,
		id: String,
		count: Number
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
                this.initEcharts();
            }
        },
		count(newVal, oldVal) {
            if(newVal-oldVal > 3) {
            	this.changeRander();
			}else {
            	this.initEcharts();
			}
		}
	},
    mounted() {
        this.initEcharts();
    },
	methods: {
		changeRander() {
            if (this.myBarChart) {
                this.myBarChart.resize();
            } else {
                this.initEcharts();
            }
		},
		initEcharts() {
			let _option = this.defaultOption();
			if(!this.myBarChart) {
				this.myBarChart = this.$echarts.init(document.getElementById(this.id));
			}
			this.myBarChart.setOption(_option);
		},
		defaultOption() {
			let option = {
				    dataset: {
				        source: this.barEchartsData
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
			                y: 'name'
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

