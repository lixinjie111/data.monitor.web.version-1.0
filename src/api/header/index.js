import axios from 'axios';
import {HTTPURL} from '../requestUrl';

/**
 * 获取天气数据
 * I_M1_M13_01_01
 */
export const getWeather = params => { return axios.post(`${HTTPURL}getWeather`, params).then(res => res.data); };
/**
 * 获取预警故障数量
 * I_M1_M13_01_02
 */
export const getWarnAndFaultCount = params => { return axios.post(`${HTTPURL}getWarnAndFaultCount`, params).then(res => res.data); };


