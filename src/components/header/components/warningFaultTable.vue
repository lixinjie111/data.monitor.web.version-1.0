<template>
    <div>
        <!-- 预警列表查询参数 -->
       <el-form size="mini" :inline="true" ref="form" :model="searchKey" >
           <el-form-item :label="type === 1 ? '预警来源:': '故障来源:'" class="warning-label">
                <el-select v-model="searchKey.warningSource" placeholder="请选择" size="mini" @change="handleChange(1)">
                    <el-option
                        v-for="(item, index) in filterOrigin"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
           </el-form-item>
           <el-form-item v-if="type === 2" label="故障类型:" class="warning-label">
                <el-select v-model="searchKey.warningType" placeholder="请选择" size="mini" @change="handleChange(4)">
                    <el-option
                        v-for="(item, index) in faultType"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
           </el-form-item>
           <el-form-item :label="type === 1 ? '预警等级:': '故障等级:'" class="warning-label">
               <el-select v-model="searchKey.warningLevel" placeholder="请选择" size="mini" @change="handleChange(2)">
                    <el-option
                        v-for="(item, index) in filterLevel"
                        :key="index"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
           </el-form-item>
           <el-form-item :label="type === 1 ? '预警时间:' : '故障时间:'" class="warning-label">
                <el-date-picker
                    @change="handleChange(3)"
                    v-model="searchKey.warningTime"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
           </el-form-item>
       </el-form>
        <!-- 预警列表table表格数据 -->
        <div class="c-dialog-content" style="top: 109px;bottom:68px;padding:0px 15px">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <table class="c-table" v-if="type == 1">
                        <tr>
                            <th width="10%">序号</th>
                            <th width="15%">预警名称</th>
                            <th width="15%">预警来源</th>
                            <th width="15%">预警级别</th>
                            <th width="20%">预警时间</th>
                            <th width="15%">车牌号</th>
                            <th width="10%">设备ID</th>
                        </tr>
                        <tr v-for="(item,index) in warningData">
                            <td>{{index+1}}</td>
                            <td>{{item.warningName}}</td>
                            <td>{{item.warningSource}}</td>
                            <td>{{item.warningLevel}}</td>
                            <td>{{item.warningTime}}</td>
                            <td>{{item.plateNo}}</td>
                            <td></td>
                        </tr>
                    </table>
                    <table class="c-table" v-if="type == 2">
                        <tr>
                            <th width="5%">序号</th>
                            <th width="15%">故障名称</th>
                            <th width="15%">故障来源</th>
                            <th width="15%">故障类型</th>
                            <th width="10%">故障级别</th>
                            <th width="15%">故障发生时间</th>
                            <th width="15%">车牌号/设备编号</th>
                            <th width="10%">设备类型</th>
                        </tr>
                        <tr v-for="(item,index) in warningData">
                            <td>{{index+1}}</td>
                            <td>{{item.faultName}}</td>
                            <td>{{item.faultSource}}</td>
                            <td>{{item.faultType}}</td>
                            <td>{{item.faultLevel}}</td>
                            <td>{{item.faultTime}}</td>
                            <td>{{item.devId}}</td>
                            <td>{{item.devType}}</td>
                        </tr>
                    </table>
                </div>
             </div>
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="searchKey.size"
                layout="total, prev, pager, next"
                :total="type === 1 ? totalWarning : totalFault" >
            </el-pagination>
        </div>
       
        <!-- 分页 -->
    
    </div>
</template>
<script>
import { getWarningList, getFaultList } from '@/api/header';
import Moment from 'moment';
export default {
    props: {
        type: Number
    },
    data() {
        return {
            warningData: [], // 预警列表数据
            totalWarning: null, // 总数
            totalFault: null,
            searchHistory: {},
            tableLoading: false,
            searchKey: {
                warningTime: [new Date(2019, 6, 11), new Date(2019, 6, 23)],
                startTime: '',
                endTime: '',
                warningType: 'null',
                warningSource: 'null',
                warningLevel: '全部',
                index: 1,
                size: 10
            },
            warningSource: [
                {
                    label: '全部',
                    value: 'null'
                },
                {
                    label: 'OBU',
                    value: 'OBU'
                },
                {
                    label: '行车记录仪',
                    value: 'DRIVINGRECORDER'
                },
                {
                    label: '云',
                    value: 'CLOUD'
                }
            ],
            warningLevel: ['全部' , '1', '2', '3', '4', '5', '6', '7', '8'],
            faultSource: [
                {
                    label: '全部',
                    value: 'null'
                },
                {
                    label: '车辆故障',
                    value: 'VEHICLE'
                },
                {
                    label: '路测设备故障',
                    value: 'ROADSIDEDEVICE'
                },
                {
                    label: '云端设备故障',
                    value: 'CLOUDDEVICE'
                },
                {
                    label: '第三方接入故障',
                    value: 'THIRDPARTYACCESS'
                }
            ],
            falultLevel: ['全部' , '1', '2', '3', '4', '5', '6', '7', '8'],
            faultType: [
                {
                    label: '全部',
                    value: 'null'
                },
                {
                    label: '自动驾驶硬件模块故障',
                    value: 'AUTOPILOT'
                },
                {
                    label: '车身故障',
                    value: 'CARBODY'
                },
                {
                    label: '软件故障',
                    value: 'SOFTWARE'
                },
                {
                    label: '联网故障',
                    value: 'NETWORKING'
                },
                {
                    label: '设备XX硬件模块故障',
                    value: 'DEVICEHARDWARE'
                },
                {
                    label: '设备软件故障',
                    value: 'DEVICESOFTWARE'
                }
            ],
            // timeList: ['当日'],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            }
        };
    },
    mounted() {
        if (this.type === 1) {
            this.fetchWarningList();
        } else {
            this.fetchFaultList();
        } 
    },
    methods: {
        fetchWarningList() {
            this.warningData = [];
            this.searchHistory = this.searchKey;
            this.tableLoading = true;
            let params = {
                'warningLevel': this.searchKey.warningLevel === '全部' ? null : this.searchKey.warningLevel,
                'warningSource': this.searchKey.warningSource === 'null' ? null : this.searchKey.warningSource,
                'startTime': Moment(this.searchKey.warningTime[0]).format('YYYY-MM-DD'),
                'endTime': Moment(this.searchKey.warningTime[1]).format('YYYY-MM-DD'),
                'index': this.searchKey.index,
                'size': this.searchKey.size
            }
            console.log('params ', params);
            getWarningList(params).then(res => {
               this.warningData = res.data.res;
               this.warningData.map(x => {
                   x.warningTime = Moment(x.warningTime).format('YYYY-MM-DD HH:mm:ss');
               });
               this.totalWarning = res.data.total;
               this.tableLoading = false;
            });
        },
        fetchFaultList() {
            this.warningData = [];
            this.searchHistory = this.searchKey;
            this.tableLoading = true;
            let params = {
                'faultSource': this.searchKey.warningSource === 'null' ? null : this.searchKey.warningSource,
                'faultType': this.searchKey.warningType === 'null' ? null : this.searchKey.warningType,
                'faultLevel': this.searchKey.warningLevel === '全部' ? null : this.searchKey.warningLevel,
                'startTime': Moment(this.searchKey.warningTime[0]).format('YYYY-MM-DD'),
                'endTime': Moment(this.searchKey.warningTime[1]).format('YYYY-MM-DD'),
                'index': this.searchKey.index,
                'size': this.searchKey.size
            }
            getFaultList(params).then(res => {
                this.warningData = res.data.res;
                this.warningData.map(x => {
                    x.warningTime = Moment(x.warningTime).format('YYYY-MM-DD HH:mm:ss');
                });
                this.totalFault = res.data.total;
                this.tableLoading = false;
            })
        },
        // 查询条件
        handleChange(val, num) {
            if (this.type === 1) {
                if (num === 1) {
                    this.searchKey.warningSource = val;
                } else if (num === 2) {
                    this.searchKey.warningLevel = val;
                } else if (num === 3) {
                    this.searchKey.startTime = val[0];
                    this.searchKey.endTime = val[1];
                }
                this.searchKey.index = 1;
                this.searchHistory = this.searchKey;
                this.fetchWarningList();
            } else if (this.type === 2) {
                if (num === 1) {
                    this.searchKey.warningSource = val;
                } else if (num === 2) {
                    this.searchKey.warningLevel = val;
                } else if (num === 3) {
                    this.searchKey.startTime = val[0];
                    this.searchKey.endTime = val[1];
                } else if (num === 4) {
                    this.searchKey.warningType = val;
                }
                this.searchKey.index = 1;
                this.searchHistory = this.searchKey;
                this.fetchFaultList();
            }
        },
        //当前条
        handleSizeChange(val) {
            if (this.type === 1) {
                this.searchKey.size = val;
                this.fetchWarningList();
            } else if (this.type === 2) {
                this.searchKey.size = val;
                this.fetchFaultList();
            }  
        },
        // 当前页
        handleCurrentChange(val) {
            if (this.type === 1) {
                this.searchKey.index = val;
                this.fetchWarningList();
            } else if (this.type === 2) {
                this.searchKey.index = val;
                this.fetchFaultList();
            }  
        },
        headerRowStyle({row, rowIndex}) {
            return 'background-color: #3a3941; color：#fff: border:none';
        },
        rowStyle({row, rowIndex}) {
            return 'background-color: #333333;border:none';
        }
    },
    computed: {
        filterOrigin() {
            if (this.type === 1) {
                return this.warningSource;
            } else if (this.type === 2) {
                return this.faultSource;
            }
        },
        filterLevel() {
            if(this.type === 1) {
                return this.warningLevel;
            } else if (this.type === 2) {
                return this.falultLevel;
            }
        }
    }
}
</script>
<style scoped lang="scss">
.c-table {
    width: 100%;
    // margin-bottom: 48px;
}
</style>



