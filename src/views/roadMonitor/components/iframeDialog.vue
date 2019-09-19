<template>
	<div>
		<div class="c-dialog-wrapper">
			<div class="c-dialog-container">
				<div class="c-dialog-header">
					<span class="c-dialog-title">路口监控</span>
					<i class="c-dialog-close" @click="closeDialog"></i>
				</div>
				<div class="c-dialog-content m-side-dialog-content">
					<iframe  frameborder="no"  src="http://csdpx.huali-cloud.com/home/"  style="width: 100%;height:100%"></iframe>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {}
		},
		props: ["selectedItem"],
		methods: {
			closeDialog(){
         		 this.$emit("closeDialog");
        	}
		}
	};
</script>
<style lang="scss" scoped>
	@import "@/assets/scss/dialog.scss";
	.c-dialog-content{
		margin:0 !important;
		padding:0 !important;
	}
</style>
