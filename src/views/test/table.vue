<template>
  <table class="c-table">
    <tr>
      <th width="">序号</th>
      <th>告警时间</th>
      <th>告警名称</th>
      <th>告警级别</th>
      <th>告警车辆</th>
    </tr>
    <tr>
      <th>1</th>
      <th>2019-08-27 09:05:34:322</th>
      <th>前向碰撞预警</th>
      <th>3</th>
      <th>沪A5237490</th>
    </tr>
    <tr>
      <th>2</th>
      <th>2019-08-27 09:05:34:322</th>
      <th>前向碰撞预警</th>
      <th>3</th>
      <th>沪A5237490</th>
    </tr>
  </table>
</template>
<script>
    export default {
        data() {
            return {}
        },
        methods: {},
        mounted() {

        }
    }
</script>
<style lang="scss" scoped>
  .c-table{
    border:1px solid #5e5970;
    /*background-color: #5e5970;*/
    width:100%;
    margin: 15px;
    text-align: center;
    color: #fff;
    letter-spacing: 1px;
    th,td{
      border:1px solid #5e5970;
      opacity: 0.3;
    }
  }
</style>
