<template>
	<div class="header clearfix">
        <router-link tag="a" class="logo-wrap" to="/">  
            <img class="logo" src="@/assets/images/logo.png">
        </router-link>
        <ul class="menu-box clearfix">
           <router-link tag="li" v-for="item in navList" :key="item.id" class="menu-list" :to="item.path">{{item.name}}</router-link>
        </ul>
        <div class="sub-info clearfix">
            <span class="tip">2019-09-23 08:00:00</span>
            <span class="tip"><img src="@/assets/images/weather/default.png" class="weather-icon" /><span class="c-middle">15.6°</span></span>
            <span class="tip">预警<em class="num">30</em></span>
            <span class="tip">故障<em class="num">26</em></span>
        </div>
        <!-- <a href="javascript:;" class="userinfo" @click="logout">
            当前用户：{{sysAdminName}} 退出
        </a> -->
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
              {id:1,name:'概览',path:'/dataMonitor'},
              {id:2,name:'车辆',path:'/carMonitor'},
              {id:3,name:'路网',path:'/roadMonitor'},
              {id:4,name:'路测设备',path:'/equipmentMonitor'}
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
    height: 40px;
    color: #fff;
    padding: 24px 30px;
    text-align: center;
    letter-spacing: 1px;
    .logo-wrap {
        float: left;
        padding: 5px 0;
        cursor: pointer;
        height: 30px;
        .logo {
            height: 100%;
            vertical-align: top;
        }
    }
    .menu-box{
        display: inline-block;
        white-space: nowrap;
        .menu-list {
            float: left;
            margin:0px 46px;
            height:100%;
            font-size: 20px;
            line-height:40px;
            vertical-align: middle;
            cursor: pointer;
            &:hover {
                border-bottom: 3px solid #925d00;
            }
            &.is-active {
                border-bottom: 3px solid #925d00;
                cursor: default;
            }
        }
    }
    .sub-info {
        float: right;
        font-size: 14px;
        .tip {
            margin-left: 40px;
            &:first-child {
                margin-left: 0;
            }
            .weather-icon {
                display: inline-block;
                width: 26px;
                vertical-align: middle;
                margin-right: 8px;
            }
            .num {
                margin-left: 15px;
                color: #dc8c00;
            }
        }
    }
    // .userinfo {
    //     font-size: 12px;
    //     height: 100%;
    //     color: #fff;
    //     @include layoutMode();
    // }
}
</style>


