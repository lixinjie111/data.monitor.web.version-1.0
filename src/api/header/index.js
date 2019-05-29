import axios from 'axios';
import {HTTPURL} from '../requestUrl';

/**
 * 获取天气数据、预警故障数量
 * I_G3_01
 */
export const getTopHead = params => { return axios.post(`${HTTPURL}g/comStat/getTopHead`, params).then(res => res.data); };
