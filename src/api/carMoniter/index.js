import axios from 'axios';
import {HTTPURL} from '../requestUrl';

/**
 * 车辆列表监控
 */

/**
 * 获取车辆总数（辆）
 * I_M2_M21_01_01 参考 I_M1_M11_01_01
 */
 export const getVehCount = params => {return axios.post(`${HTTPURL}getVehCount`, params).then(res => res.data); };
/**
 * 获取总行驶里程（公里）
 * I_M2_M21_02_01
 */
 export const getDrivMileage = params => {return axios.post(`${HTTPURL}getDrivMileage`, params).then(res => res.data); };
/**
 * 获取总行驶时长
 * I_M2_M21_02_02
 */
 export const getTravelTime = params => {return axios.post(`${HTTPURL}getTravelTime`, params).then(res => res.data); };
/**
 * 获取平均行驶时长（分钟）
 * I_M2_M21_02_03
 */
 export const getAvgTravelTime = params => {return axios.post(`${HTTPURL}getAvgTravelTime`, params).then(res => res.data); };
/**
 * 获取自动驾驶级别分布数据
 * I_M2_M21_03_01
 */
 export const getAutoPilotLevelScat = params => {return axios.post(`${HTTPURL}getAutoPilotLevelScat`, params).then(res => res.data); };
/**
 * 获取车辆用途分布数据
 * I_M2_M21_03_02
 */
 export const getVehUsageScat = params => {return axios.post(`${HTTPURL}getVehUsageScat`, params).then(res => res.data); };
/**
 * 获取在驶车辆信息
 * I_M2_M21_04_01 参考 I_M1_M12_01
 * I_M1_M12_01_02   getLastWeeksDayVehicle	获取上周当天在驶车辆分布数量（分钟）
 * I_M1_M12_01_03	getToDayVehicle	获取平台当天0点到目前的车辆分布数据
 */
 // export const getAvgTravelTime = params => {return axios.post(`${HTTPURL}getAvgTravelTime`, params).then(res => res.data); };


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











