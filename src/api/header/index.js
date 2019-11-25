// import axios from 'axios';
import {HTTPURL} from '../requestUrl';

/**
 * 获取服务器时间、预警故障数量
 * I_G3_01
 */
export const getTopHead = params => { return axios.post(`${HTTPURL}g/comStat/getTopHead`, params).then(res => res.data); };

/**
 * 获取天气数据
 * I_G3_01
 */
// export const getTopWeather = params => { return axios.post(`${HTTPURL}g/comStat/getTopWeather`, params).then(res => res.data); };
export const getTopWeather = params => { return axios.post(`http://120.133.21.14:9093/monPlatApp/g/comStat/getTopWeather`, params).then(res => res.data); };

/**
 * 获取预警列表数据
 * EW_BS_02
 */
export const getWarningList = params => {return axios.post(`${HTTPURL}ew/bs/warningLst`, params).then(res => res.data); };

/**
 * 获取预警分析图表数据
 * EW_BS_03
 */
export const getWarningDis = params => {return axios.post(`${HTTPURL}ew/bs/warningDis`, params).then(res => res.data); };

/**
 * 获取故障列表数据
 * FT_BS_02
 */
export const getFaultList = params => {return axios.post(`${HTTPURL}ft/bs/faultLst`, params).then(res => res.data); };

/**
 * 获取故障分析图表数据
 * FT_BS_03
 */
export const getFaultDis = params => {return axios.post(`${HTTPURL}ft/bs/faultDis`, params).then(res => res.data); };