import axios from 'axios';
import {HTTPURL} from '../requestUrl';


/**
 * 路侧设备
 */


/**
 * 车辆列表监控
 */

/**
 * 获取车辆信息
 * I_VL1_01
 */
 export const getTotalStat = params => {return axios.post(`${HTTPURL}vl/platStat/getTotalStat`, params).then(res => res.data); };







