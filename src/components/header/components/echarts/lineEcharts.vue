<template> 
    <div class="echarts-list-box" :id="id"></div>
</template>

<script>
export default {
    props: {
        lineEchartsData: Array,
        activeName: String,
        id: String,
		count: Number
    },
    data () {
		return {
			myLineChart: null,
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
        if(this.activeName == 'tabTwo') {
            this.initEcharts();
        }
    },
    methods: {
        changeRander() {
            if (this.myLineChart) {
                this.myLineChart.resize();
            } else {
                this.initEcharts();
            }
		},
        initEcharts() {
            let _option = this.defaultOption();
            if (!this.myLineChart) {
                this.myLineChart = this.$echarts.init(document.getElementById(this.id));
            }
            this.myLineChart.setOption(_option);
        },
        dealData() {
            let arr = [];
            this.lineEchartsData.map(x => {
                arr.push(x.count);
            });
            return arr;
        },
        defaultOption() {
            let option = {
                grid:{
                    left: 0,
                    right: 0,
                    x: 25,
                    y: 40,
                    x2: 25,
                    y2: 40
                },
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
