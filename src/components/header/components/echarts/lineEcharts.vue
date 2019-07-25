<template> 
     <!-- <ul class="echarts-list-wrap clearfix ">
		<li class="echarts-list">
			<div class="echarts-list-box" id="myLineChart"></div>
		</li>
	</ul> -->
    <div class="echarts-list-box" id="myLineChart"></div>
</template>
<script>
export default {
    props: {
        lineEchartsData: Array,
        activeName: String,
        resizeLineFlag: Boolean,
        type: Number
    },
    data () {
		return {
			myLineChart: null,
            loaded: false,
            warningEcharts: [],
            faultEcharts: []
		}
    },
    watch: {
        deep: true,
        activeName(newVal, oldVal) {
            if(newVal == 'tabTwo') {
                // let _option = this.defaultOption();
                // if(!this.myLineChart) {
                //     this.myLineChart = this.$echarts.init(document.getElementById('myLineChart'));
                // }
                // this.myLineChart.setOption(_option);
                this.drawLine();
            }
        },
        resizeLineFlag: {
			handler(newVal, oldVal) {
				if(newVal) {
					// console.log('改变窗口');
					this.changeRander();
					this.$emit("alreadyRender",'resizeLineFlag');
				}
			}
		}
    },
    computed: {
        filterData() {
            let _filterData = [];
			this.lineEchartsData.map(x => {
				let obj = {};
				obj.value = x.count;
				obj.name = x.name;
				_filterData.push(obj);
            });
            return _filterData;
        }
    },
    methods: {
        // 根据窗口大小重新渲染
        drawLine() {
            let _option = this.defaultOption();
            // if (!this.myLineChart) {
            //     this.myLineChart = this.$echarts.init(document.getElementById('myLineChart'));
            // }
            this.myLineChart = this.$echarts.init(document.getElementById('myLineChart'));
            this.myLineChart.setOption(_option);
        },
		changeRander() {
			// let _option = this.defaultOption();
			// if(!this.myLineChart) {
			// 	this.myLineChart = this.$echarts.init(document.getElementById('myLineChart'));
			// }
            // this.myLineChart.setOption(_option);
            this.drawLine();
		},
        dealData() {
            let arr = [];
            this.filterData.map(x => {
                arr.push(x.value);
            });
            return arr;
        },
        defaultOption() {
            let option = {
                xAxis: {
                    type: 'category',
                    show: false
                },
                yAxis:  {
                    type: 'value',
                    show: false
                },
                series: {
                    type: 'line',
                    smooth: true,
                    color: '#37ba7b',
                    // symbol: 'circle',
                    lineStyle: {
                        color: '#37ba7b',
                        width: 1
                    },
                    markLine: {
                        symbol: 'circle'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {
                        color: 'rgba(55, 186, 123, .1)'
                    },
                    data: this.dealData()
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
