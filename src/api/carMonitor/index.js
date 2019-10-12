// import axios from 'axios';
import {HTTPURL, TESTHTTPURL} from '../requestUrl';


/**
 * 车辆监控
 */


/**
 * 车辆列表监控
 */

/**
 * 获取车辆信息
 * I_VL1_01
 */
 export const getTotalStat = params => {return axios.post(`${HTTPURL}vl/platStat/getTotalStat`, params).then(res => res.data); };
/**
 * 获取自动驾驶级别分布数据
 * I_V1L_02
 */
 export const getAutoLevelStat = params => {return axios.post(`${HTTPURL}vl/vehStat/getAutoLevelStat`, params).then(res => res.data); };
 // export const getAutoLevelStat = params => {return axios.post(`${TESTHTTPURL}vl/vehStat/getAutoLevelStat`, params).then(res => res.data); };
/**
 * 获取车辆用途分布数据
 * I_VL1_03
 */
 export const getVehUsageStat = params => {return axios.post(`${HTTPURL}vl/vehStat/getVehUsageStat`, params).then(res => res.data); };
 // export const getVehUsageStat = params => {return axios.post(`${TESTHTTPURL}vl/vehStat/getVehUsageStat`, params).then(res => res.data); };
/**
 * 获取车型品牌分布数据
 * I_VL4_01
 */
 export const getVehStat = params => {return axios.post(`${HTTPURL}vl/vehStat/getVehStat`, params).then(res => res.data); };
 // export const getVehStat = params => {return axios.post(`${TESTHTTPURL}vl/vehStat/getVehStat`, params).then(res => res.data); };
/**
 * 获取最近30天活跃车辆top5的车辆数据
 * I_VL4_02
 */
 export const getActiveVehStat = params => {return axios.post(`${HTTPURL}vl/actVehStat/getActiveVehStat`, params).then(res => res.data); };
/**
 * 获取最近30天行程分析分布数据
 * I_VL4_03
 */
 export const getRouteStat = params => {return axios.post(`${HTTPURL}vl/routeStat/getRouteStat`, params).then(res => res.data); };
/**
 * 获取典型车辆列表初始化配置数据
 * I_VL3_01
 */
 export const getGpsRealConfig = params => {return axios.post(`${HTTPURL}vl/actVehStat/getGpsRealConfig`, params).then(res => res.data); };
/**
 * 初始化页面，获取典型车辆列表实时信息
 * I_VL3_01
 */
 export const getGpsRealList = params => {return axios.post(`${HTTPURL}vl/actVehStat/getGpsRealList`, params).then(res => res.data); };

/**
 * 单车监控
 */

/**
 * 4-02-01	获取行车统计数据
 */
 export const getDrivingStatisticsData = params => {return axios.post(`${HTTPURL}singleMoniter/getDrivingStatisticsData`, params).then(res => res.data); };

/**
 * 4-01-01 获取单车基本数据
 */
 export const getVehicleBaseData = params => {return axios.post(`${HTTPURL}singleMoniter/getVehicleBaseData`, params).then(res => res.data); };

 /**
 * 4-02-02 获取行车日历
 */
export const getVehicleCalendarData = params => {return axios.post(`${HTTPURL}singleMoniter/getVehicleCalendarData`, params).then(res => res.data); };

/**
 * 4-03-01	获取行车概览当前行程的历史路径
 */
 export const getRouteDataByVehId = params => {return axios.post(`${HTTPURL}vl/routeStat/getRouteDataByVehId`, params).then(res => res.data); };

 /**
 * 4-04-03 获取车辆实时视频数据
 */
export const getLiveDeviceInfo = params => {return axios.post(`${HTTPURL}singleMoniter/getLiveDeviceInfo`, params).then(res => res.data); };

 /**
 * 4-04-03 获取车辆实时视频数据
 */
export const startStream = params => {return axios.post(`${HTTPURL}singleMoniter/startStream`, params).then(res => res.data); };

 /**
 * 4-04-03 获取车辆实时视频数据
 */
export const sendStreamHeart = params => {return axios.post(`${HTTPURL}singleMoniter/sendStreamHeart`, params).then(res => res.data); };

/**
 * 告警的接口
 * */
export const getAlarmInformation = params => {return axios.post(`${HTTPURL}singleMoniter/getAlarmInformation`, params).then(res => res.data); };


/**
 * 预警的接口
 * */
export const getV2xInformation = params => {return axios.post(`${HTTPURL}singleMoniter/getEarlyWarningInformation`, params).then(res => res.data); };











