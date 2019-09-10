
<template>
	<div class="more-wrapper">
		<a href="javascript:;" class="more-btn c-car-list" @click="dialogVisible = true">更多</a>
		<div class="c-dialog-wrapper" v-show="dialogVisible">
			<div class="c-dialog-container">
				<div class="c-dialog-header">
					<span class="c-dialog-title">车辆数据</span>
					<i class="c-dialog-close" @click="dialogVisible = false"></i>
				</div>
				<div class="c-dialog-content">
					<div class="c-scroll-wrap">
						<ul class="c-scroll-inner">
							<li class="echarts-classify-wrap">
								<p class="title">车辆分析</p>
								<pie-echarts :dialogVisible="dialogVisible" :resizeFlag="resizeFlagPie" @alreadyRender="alreadyRender"></pie-echarts>
							</li>
							<li class="echarts-classify-wrap">
								<p class="title">活跃车辆（近30天）</p>
								<bar-vertical-echarts :dialogVisible="dialogVisible" :resizeFlag="resizeFlagVertical" @alreadyRender="alreadyRender"></bar-vertical-echarts>
							</li>
							<li class="echarts-classify-wrap">
								<p class="title">行程分析（近30天）</p>
								<bar-horizontal-echarts :dialogVisible="dialogVisible" :resizeFlag="resizeFlagHorizontal" @alreadyRender="alreadyRender"></bar-horizontal-echarts>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import pieEcharts from './components/pieEcharts.vue'
import BarVerticalEcharts from './components/barVerticalEcharts.vue'
import BarHorizontalEcharts from './components/barHorizontalEcharts.vue'
export default {
	name: 'MoreBtn',
    components: { pieEcharts, BarVerticalEcharts, BarHorizontalEcharts },
	data () {
		return {
			dialogVisible: false,
			resizeFlagPie: false,
			resizeFlagVertical: false,
			resizeFlagHorizontal: false
		}
	},
	mounted() {
		let _this = this;
		window.onresize = function(){ // 定义窗口大小变更通知事件
            _this.resizeFlagPie = true;
            _this.resizeFlagVertical = true;
            _this.resizeFlagHorizontal = true;
        };
	},
	methods: {
		alreadyRender(classifyFlag) {
			this[classifyFlag] = false;
			// console.log(classifyFlag+'监听完毕');
		}
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.more-btn {
    position: absolute;
    top: 100px;
    right: 420px;
    z-index: 3;
    width: 65px;
    height: 30px;
    @include layoutMode();
   /* font-size: 20px;*/
    color: #ccc;
    padding: 0;
}
.echarts-classify-wrap {
	margin-bottom: 18px;
	margin-right: 20px;
	&:last-child {
		margin-bottom: 0;
	}
	.title {
		position: relative;
		padding-left: 11px;
		height: 30px;
		line-height: 30px;
		font-size: 18px;
		&:before {
			content: "";
			position: absolute;
			left: 0;
			top: 50%;
			margin-top: -9px;
			width: 2px;
			height: 18px;
			background-color: #41b27e;
		}
	}
}
</style>
