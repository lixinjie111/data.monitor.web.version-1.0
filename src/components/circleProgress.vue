<template>
  <!-- <div class="c-circle-wrap clearfix c-car-list"> -->
  <div class="c-circle-wrap clearfix">
    <h3 class="c-title">{{title}}</h3>
    <ul class="c-circle-ul clearfix">
    	<li class="c-circle-list" v-for="item of filterData" :key="item.title">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left" v-if="item.angle <= 180" :style="{'transform': 'rotate(-180deg)'}"></div>
			　　　　<div class="left" v-else :style="{'transform': 'rotate(' +item.angle+ 'deg)'}"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right" v-if="item.angle <= 180" :style="{'transform': 'rotate(' + (item.angle + 180) + 'deg)'}"></div>
			　　　　<div class="right" v-else></div>
			　　</div>
    			<span class="c-circle-num">{{item.value}}</span>
    		</div>
    		<p class="c-circle-text">{{item.title}}</p>
    	</li>
    </ul>
  </div>
</template>

<script>
// import { requestGetShareData } from '@/api/carMoniter'
export default {
	name: 'CircleProgress',
	props: {
	    title: String
	},
	data () {
		return {
			requestData: [{
				title: "标题一",
				value: "50",
				percent : "25"
			},{
				title: "标题二",
				value: "100",
				percent : "50"
			},{
				title: "标题三",
				value: "150",
				percent : "75"
			},{
				title: "标题四",
				value: "200",
				percent : "100"
			},{
				title: "标题五",
				value: "20",
				percent : "10"
			}]	
		}
	},
	computed: {
		 filterData() {
		 	if(this.requestData.length > 0) {
			 	let filterData = this.requestData.map(function(item,index,self){
	                let filterItem = item.percent*360/100;
	                item.angle = filterItem;
	                console.log(item.angle);
	                return item;
	            });
	            return filterData;
		 	}else {
		 		return [];
		 	}
		 }
	},
	watch: {
	},
	created() {
		
	},
	mounted() {
		
	},
	methods: {
		circleFunc() {
			// $('.spinner').each(function(index, el) {
	  //           var pra = $(this).data('praise');   
	  //           if(pra < 10 ) { 
	  //               pra = 10;   
	  //           }   
	  //           if(pra > 300) {
	  //               pra = 300;  
	  //           }   
	  //           var num = (pra/300)*360;
	    
	  //           if(num <= 180) {    
	  //               $(this).find('.right').css('transform', "rotate(" + (num + 180) + "deg)");
	  //               $(this).find('.left').css('transform', "rotate(" + (-180) + "deg)");
	  //           } else {
	  //               $(this).find('.left').css('transform', "rotate(" + num  + "deg)");
	  //           }   
			// }); 
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
	    width: 60px;
	    height: 60px;
	    .left, .right {
	        position: absolute;
	        top: 0;
	        left: 0;
	        width: 60px;
	        height: 60px;
	        border-radius: 50%;
	        box-shadow: inset 0 0 0 3px #37ba7b;
	        transition: transform 1s ease;
	    }
	    .left {
	        clip: rect(0, 30px, 60px, 0);
	    }
	    .right {
	        clip: rect(0, 60px, 60px, 30px);
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
	}
}
</style>
