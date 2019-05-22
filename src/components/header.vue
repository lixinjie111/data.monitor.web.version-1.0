<template>
	<div class="header">
        <div class="left">
            <router-link tag="div" class="logo-wrap" to="/">  
                <img class="logo" src="@/assets/images/logo.png">
                <span class="title">矩阵管理后台</span>
            </router-link>
            <ul class="menu-box">
               <router-link tag="li" v-for="item in navList" :key="item.id" class="menu-list" :to="item.path">{{item.name}}</router-link>
            </ul>
        </div>
        <a href="javascript:;" class="userinfo" @click="logout">
            当前用户：{{sysAdminName}} 退出
        </a>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
	name: "Header",
    data() {
        return {
            sysAdminName: this.$store.state.admin.adminName,
            navList: [
              {id:1,name:'数据概览',path:'/dataMonitor'},
              {id:2,name:'车辆监控',path:'/carMonitor'},
              {id:3,name:'路测监控',path:'/roadMonitor'},
              {id:4,name:'云端监控',path:'/cloudMonitor'},
              {id:5,name:'告警监控',path:'/alertMonitor'}
            ]
        }
    },
    methods: {
        ...mapActions(['goLogOut']),
        //退出登录
        logout: function() {
            let that = this;
            that.$confirm('确认退出吗?', '提示', {
            }).then(() => {
                that.goLogOut(that).then(res => {
                    that.ClearMenuList();
                    that.$router.push({ path: '/' });
                });
            }).catch(() => {
            });
        },
        navClick(item){
            this.$router.push({path: item.path});
            //点击的时候，选中
            this.initUIByURL(item.path);
        },
        initUIByURL(path){
            var url = window.location.hash;
            url = url.slice(1);
            //开始初始化不需要遍历渲染
            if(url == '/home'){
                return;
            }
            //刷新的时候
            path=url;
            for(let i=0;i<this.navList.length;i++){
                let temp = this.navList[i];
            }
        }
    },
    mounted(){
        this.initUIByURL('/dataOverview');
        window.vheader=this;
    }
}
</script>
<style scoped lang="scss"> 
@import '@/assets/scss/theme.scss'; 
.header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 2;
    height: 44px;
    background: #080808;
    color: #fff;
    padding: 10px 20px;
    @include layoutMode(between);
    .left {
        @include layoutMode();
        .logo-wrap {
            @include layoutMode();
            cursor: pointer;
            .logo {
                margin-right: 10px;
                height: 30px;
            }
            .title {
                line-height: 64px;
                font-size: 22px;
                font-family: 'MicrosoftYaHei';
                font-weight: 100;
            }
        }
    }
    .userinfo {
        font-size: 12px;
        height: 100%;
        color: #fff;
        @include layoutMode();
    }
}
.menu-box{
    height: 64px;
    padding: 0px 50px;
    display: inline-block;
    text-align: center;
    font-size: 15px;
    .menu-list {
    	margin: 0px;
	    padding:0px 20px;
	    height:62px;
	    line-height:62px;
	    vertical-align: middle;
	    float: left;
	    cursor: pointer;
	    &:hover {
	    	border-bottom:2px solid #5aaaeb;
    		color:#5aaaeb;
	    }
	    &.is-active {
	    	border-bottom: 2px solid #37B6E6;
    		color: #37B6E6;
	    }
    }
}
</style>


