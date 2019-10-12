// import axios from 'axios';
import {HTTPURL} from '../requestUrl';

/**
 * 车辆列表监控
 */

/**
 * 获取车辆信息
 * I_G1_01
 */
 export const getBaseStat = params => {return axios.post(`${HTTPURL}g/baseStat/getBaseStat`, params).then(res => res.data); };
/**
 * 获取道路级别统计信息
 * I_G1_03
 */
 export const getRoadLevelStat = params => {return axios.post(`${HTTPURL}g/roadStat/getRoadLevelStat`, params).then(res => res.data); };
/**
 * 获取设备良好率统计信息
 * I_G1_04
 */
 export const getDevStatusStat = params => {return axios.post(`${HTTPURL}g/baseStat/getDevStatusStat`, params).then(res => res.data); };


/**
 * 概览 和 车辆 共用
 * 获取上周当天在驶车辆分布数量（分钟）
 * 当天0点到目前的分布数量 websocket 配合使用
 * I_G2_01 && I_G2_02
 */
 export const getHisVehStat = params => {return axios.post(`${HTTPURL}g/platStat/getHisVehStat`, params).then(res => res.data); };

/**
 * 获取平台总数据流量
 * websocket 配合使用
 * I_G2_03 && I_G2_04
 */
 export const getTotalFlow = params => {return axios.post(`${HTTPURL}g/platStat/getTotalFlow`, params).then(res => res.data); };