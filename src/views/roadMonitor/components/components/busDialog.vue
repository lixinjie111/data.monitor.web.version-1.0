<template>
  <div class="c-dialog-wrapper">
    <div class="c-dialog-container">
      <div class="c-dialog-header">
        <span class="c-dialog-title">{{this.selectedItem.crossingName}}</span>
        <i class="c-dialog-close" @click="closeDialog"></i>
      </div>
      <div class="c-dialog-content m-side-dialog-content">
            <template v-if="hasData">
              <ul  class="lightBox" >
                <li v-for="(item,index) in busListData" :key="index"  :class="item.position">
                  <div class="light"  
                    v-for="subItem in item.list"
                    :key="subItem.id"
                    :class="subItem.light"
                    v-show="subItem.flag" 
                    :id="subItem.id" >
                    <img :src="'static/images/smartlight/'+subItem.twords+'.png'" alt="">
                  </div>
                </li>
                <li class="direction"><img src="static/images/pointer.png" alt=""></li>
              </ul>
            </template>
            <template v-else>
              暂无数据
            </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hasData:false,
      busListData:[{
          position:'east',
          list:[
            {flag:false,light:'', id:4,twords:'turn-around'},
            {flag:false,light:'', id:2,twords:'turn-left'},
            {flag:false,light:'', id:1,twords:'forward'},
            {flag:false,light:'', id:3,twords:'turn-right'},
          ]
        },{
          position:'south',
          list:[
            {flag:false,light:'', id:14,twords:'turn-around'},
            {flag:false,light:'', id:12,twords:'turn-left'},
            {flag:false,light:'', id:11,twords:'forward'},
            {flag:false,light:'', id:13,twords:'turn-right'},
          ]
        },{
          position:'west',
          list:[
            {flag:false,light:'', id:24,twords:'turn-around'},
            {flag:false,light:'', id:22,twords:'turn-left'},
            {flag:false,light:'', id:21,twords:'forward'},
            {flag:false,light:'', id:23,twords:'turn-right'},
          ]
        },{
          position:'north',
          list:[
            {flag:false,light:'', id:34,twords:'turn-around'},
            {flag:false,light:'', id:32,twords:'turn-left'},
            {flag:false,light:'', id:31,twords:'forward'},
            {flag:false,light:'', id:33,twords:'turn-right'},
          ]
        },{
          position:'northeast',
          list:[
            {flag:false,light:'', id:39,twords:'turn-around'},
            {flag:false,light:'', id:37,twords:'turn-left'},
            {flag:false,light:'', id:36,twords:'forward'},
            {flag:false,light:'', id:38,twords:'turn-right'},
          ]
        },{
          position:'northwest',
          list:[
            {flag:false,light:'', id:29,twords:'turn-around'},
            {flag:false,light:'', id:27,twords:'turn-left'},
            {flag:false,light:'', id:26,twords:'forward'},
            {flag:false,light:'', id:28,twords:'turn-right'},
          ]
        },{
          position:'southeast',
          list:[
            {flag:false,light:'', id:9,twords:'turn-around'},
            {flag:false,light:'', id:7,twords:'turn-left'},
            {flag:false,light:'', id:6,twords:'forward'},
            {flag:false,light:'', id:8,twords:'turn-right'},
          ]
        },{
          position:'southwest',
          list:[
            {flag:false,light:'', id:19,twords:'turn-around'},
            {flag:false,light:'', id:17,twords:'turn-left'},
            {flag:false,light:'', id:16,twords:'forward'},
            {flag:false,light:'', id:18,twords:'turn-right'},
          ]
        },
      ],
    };
  },
  props: ['wescoketData','selectedItem'],
  computed: {
    lightData() {
      return this.wescoketData;
    }
  },
  created() {
    this.initData();
  },
  watch: {

    lightData: {
      handler(newVal, oldVal) {
        this.initBusList(newVal);
      },
      deep: true
    }
  },
  methods: {
    initData(){
      if(this.selectedItem){
        if(this.selectedItem.subItem){
          this.busListData.forEach(item=>{//循环初始数据 没有的相位 id隐藏
              item.list.forEach(item1=>{
                this.selectedItem.subItem.forEach(item2=>{
                  if(item1.id==item2.phaseId){
                    this.$set(item1, "flag", true);
                    this.hasData=true;
                  }
                })
              })
          })
        }else{//相位列表为空，全部置灰；
            this.busListData.forEach(item=>{
              item.list.forEach(item1=>{
                  this.$set(item1, "flag", true);
                  this.hasData=true;
              })
          })
        }
        this.initBusList();
      }
    },
    initBusList(newVal) {
      let _data = newVal || this.lightData;
      if(_data){
        for(var key in _data){//变幻灯的颜色和显示隐藏
          this.selectedItem.subItem.forEach(item2=>{
            let _id=this.selectedItem.id+"_"+item2.phaseId;
              if(key==_id){
                let realData=_data[key];
                this.busListData.forEach(item3=>{
                    item3.list.forEach(item4=>{
                        if(item4.id==realData.phaseId){
                          this.$set(item4, "flag", true);
                          this.$set(item4, "light", realData.light);
                        }
                    })
                })
              }
            })
        }
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
@import "@/assets/scss/dialog.scss";
.c-dialog-wrapper .c-dialog-container{
    left: 30%;
    right: 30%;
    top: 18%;
    bottom: 18%;
}
.m-side-dialog-content {
  padding: 0;
  background-color: #000;
  @include layoutMode();
  .lightBox{
    position: absolute;
    width:200px;
    height: 200px;
    border:1px dotted #ccc;
    li{
      position: absolute;
      height: 40px;
      background-color:#000;
      &.direction{
        width:40px;
        height: 40px;
        left:50%;
        top:50%;
        transform:translateY(-50%) translateX(-50%);
        img{
          display: block;
          width: 100%;
        }
      }
       @include layoutMode();
      .light{
        width: 20px;
        height: 20px;
        border-radius:50%;
        margin:2px;
        padding:5px;
        background:gray;
        &.RED{
          background:#d41010
        }
        &.GREEN{
          background:#00ff86
        }
        &.YELLOW{
          background:#fda53f
        }
        img{
          display: block;
          width:100%;
        }
      }
    }
    .east{
      right:0;
      top:50%;
      transform:translateX(50%) translateY(-50%)
    }
    .south{
      bottom:0;
      left:50%;
      transform:translateY(50%) translateX(-50%)
    }
    .west{
      left:0;
      top:50%;
      transform:translateX(-50%) translateY(-50%)
    }
    .north{
      top:0;
      left:50%;
       transform:translateY(-50%) translateX(-50%)
    }
    .northeast{
      right:0;
      top:0;
      transform:translateX(50%) translateY(-50%)
    }
    .northwest{
      left:0;
      top:0;
      transform:translateX(-50%) translateY(-50%)
    }
    .southeast{
      right:0;
      bottom:0;
      transform:translateX(50%) translateY(50%)
    }
    .southwest{
      left:0;
      bottom:0;
      transform:translateX(-50%) translateY(50%)
    }

  }
}
</style>