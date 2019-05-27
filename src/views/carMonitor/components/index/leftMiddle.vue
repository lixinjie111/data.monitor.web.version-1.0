<template>
  <!-- <div class="c-circle-wrap clearfix c-car-list"> -->
  <div class="c-circle-wrap clearfix">
    <h3 class="c-title">{{title}}</h3>
    <ul class="c-circle-ul clearfix">
    	<li class="c-circle-list">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right"></div>
			　　</div>
    			<span class="c-circle-num">12</span>
    		</div>
    		<p class="c-circle-text">L0级</p>
    	</li>
    	<li class="c-circle-list">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right"></div>
			　　</div>
    			<span class="c-circle-num">12</span>
    		</div>
    		<p class="c-circle-text">L1级</p>
    	</li>
    	<li class="c-circle-list">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right"></div>
			　　</div>
    			<span class="c-circle-num">12</span>
    		</div>
    		<p class="c-circle-text">L2级</p>
    	</li>
    	<li class="c-circle-list">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right"></div>
			　　</div>
    			<span class="c-circle-num">12</span>
    		</div>
    		<p class="c-circle-text">L3级</p>
    	</li>
    </ul>
    <!-- <h3 class="c-title">车辆用途</h3>
    <ul class="c-circle-ul">
    	<li class="c-circle-list">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right"></div>
			　　</div>
    			<span class="c-circle-num">12</span>
    		</div>
    		<p class="c-circle-text">私家车</p>
    	</li>
    	<li class="c-circle-list">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right"></div>
			　　</div>
    			<span class="c-circle-num">12</span>
    		</div>
    		<p class="c-circle-text">客用商用车</p>
    	</li>
    	<li class="c-circle-list">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right"></div>
			　　</div>
    			<span class="c-circle-num">12</span>
    		</div>
    		<p class="c-circle-text">货用商用车</p>
    	</li>
    	<li class="c-circle-list">
    		<div class="c-circle">
    			<div class="c-circle-inner c-circle-left">
			　　　　<div class="left"></div>
			　　</div>
			　　<div class="c-circle-inner c-circle-right">
			　　　　<div class="right"></div>
			　　</div>
    			<span class="c-circle-num">12</span>
    		</div>
    		<p class="c-circle-text">渣土车</p>
    	</li>
    </ul> -->
  </div>
</template>

<script>
// import { requestGetShareData } from '@/api/carMoniter'
export default {
	name: 'LeftMiddle',
	props: {
	    title: String
	},
	data () {
		return {
					
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

</style>
