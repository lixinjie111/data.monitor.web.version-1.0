import axios from 'axios';
import {HTTPURL} from '../requestUrl';

/**
 * 车辆监控
 */

/**
 * 4-02-01	获取行车统计数据
 * 参数：
 */
 export const getDrivingStatisticsData = params => {return axios.post(`${HTTPURL}singleMoniter/getDrivingStatisticsData`, params).then(res => res.data); };

/**
 * 4-01-01 获取单车基本数据
 * 参数：
 */
 export const getVehicleBaseData = params => {return axios.post(`${HTTPURL}singleMoniter/getVehicleBaseData`, params).then(res => res.data); };

 /**
 * 4-02-02 获取行车日历
 * 参数：
 */
export const getVehicleCalendarData = params => {return axios.post(`${HTTPURL}singleMoniter/getVehicleCalendarData`, params).then(res => res.data); };

 /**
 * 4-04-03 获取车辆实时视频数据
 * 参数：
 */
export const getLiveDeviceInfo = params => {return axios.post(`${HTTPURL}singleMoniter/getLiveDeviceInfo`, params).then(res => res.data); };

 /**
 * 4-04-03 获取车辆实时视频数据
 * 参数：
 */
export const startStream = params => {return axios.post(`${HTTPURL}singleMoniter/startStream`, params).then(res => res.data); };

 /**
 * 4-04-03 获取车辆实时视频数据
 * 参数：
 */
export const sendStreamHeart = params => {return axios.post(`${HTTPURL}singleMoniter/sendStreamHeart`, params).then(res => res.data); };











