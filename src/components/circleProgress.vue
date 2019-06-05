<template>
  <!-- <div class="c-circle-wrap clearfix c-car-list"> -->
  <div class="c-circle-wrap clearfix">
    <h3 class="c-title">{{title}}</h3>
    <ul class="c-circle-ul clearfix" :class="filterData.length > 4 ? 'c-circle-more' : ''">
    	<li class="c-circle-list" v-for="item of filterData" :key="item.name">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left" v-if="item.angle <= 180" :style="{'transform': 'rotate(-180deg)'}"></div>
			　　　　<div class="left" v-else :style="{'transform': 'rotate(' + (item.angle - 360) + 'deg)'}"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right" v-if="item.angle <= 180" :style="{'transform': 'rotate(' + (item.angle + 180) + 'deg)'}"></div>
			　　　　<div class="right" v-else></div>
			　　</div>
    			<span class="c-circle-num" v-if="type == 1">{{item.count}}</span>
    			<span class="c-circle-num" style="font-size: 16px; letter-spacing: 0px;" v-else>{{item.rate*100}}%</span>
    		</div>
    		<p class="c-circle-text">{{item.name}}</p>
    	</li>
    </ul>
  </div>
</template>

<script>
export default {
	name: 'CircleProgress',
	props: {
	    title: String,
	    requestUrl: Function,
	    type: {
	    	default: 1
	    }
	},
	data () {
		return {
			responseData: []
		}
	},
	computed: {
		 filterData() {
		 	if(this.responseData.length > 0) {
			 	let filterData = this.responseData.map(function(item,index,self){
	                let filterItem = item.rate*360;
	                item.angle = filterItem;
	                return item;
	            });
	            return filterData;
		 	}else {
		 		return [];
		 	}
		 }
	},
	mounted() {
		this.requestFunc();
	},
	methods: {
		requestFunc() {
		  debugger
			// console.log("获取--"+ this.title +"--数据");
			this.requestUrl({}).then(res => {
				this.responseData = res.data.data;
			});
		}
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.c-circle-wrap {
	font-size: 20px;
	.c-circle-ul {
		text-align: center;
		padding: 10px 0;
		// @include layoutMode(between);
		.c-circle-list {
			float: left;
			width: 25%;
			margin-top: 20px;
		}
		.c-circle {
			position: relative;
			width: 60px;
			height: 60px;
			margin: 0 auto;
			border-radius: 50%;
			overflow: hidden;
			box-shadow: inset 0 0 0 3px #595756;
		}
		.c-circle-inner {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			.left, .right {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border-radius: 50%;
				transition: transform 1s ease;
				box-shadow: inset 0 0 0 3px #37ba7b;
				transform: rotate(0deg);
			}
			&.c-circle-left, .left {
				clip: rect(0, 30px, auto, 0);
			}
			&.c-circle-right, .right {
				clip: rect(0, auto, auto, 30px);
			}
		}
		.c-circle-num {
			position: absolute;
			left: 3px;
			top: 3px;
			right: 3px;
			bottom: 3px;
			border-radius: 50%;
			overflow: hidden;
			font-size: 20px;
			@include layoutMode();
		}
		.c-circle-text {
			margin-top: 6px;
			font-size: 16px;
			color: #ccc;
			@include lineClampOne();
		}
		&.c-circle-more {
			.c-circle-list {
				width: 20%;
			}
			.c-circle {
				width: 54px;
				height: 54px;
			}
			.c-circle-left, .left {
				clip: rect(0, 27px, auto, 0);
			}
			.c-circle-right, .right {
				clip: rect(0, auto, auto, 27px);
			}
			.c-circle-text {
				font-size: 14px;
			}
		}
	}
}
</style>
