<template>
  <el-select v-model="value4" clearable placeholder="请选择">
    <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value">
    </el-option>
  </el-select>
</template>
　　
<script>
    export default {
        data() {
          return {
            options: [{
              value: '1',
              label: '黄金糕'
            }, {
              value: '2',
              label: '双皮奶'
            }, {
              value: '3',
              label: '蚵仔煎'
            }, {
              value: '4',
              label: '龙须面'
            }, {
              value: '5',
              label: '北京烤鸭'
            }],
            value4: '5'
          }
        },
        methods: {},
        mounted() {

        }
    }
</script>
<style scoped></style>
