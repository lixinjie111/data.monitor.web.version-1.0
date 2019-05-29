import axios from 'axios';
import {ROADURL} from '../requestUrl';
/*
const ROADRUL = 'http://10.0.1.57:8090/rCUDataApp';*/
export const findBaseData = params => {return axios.post(`${ROADURL}cam/findBaseData`, params).then(res => res.data); };
export const getRTMPData = params => {return axios.post(`${ROADURL}cam/getRTMPData`, params).then(res => res.data); };
export const getDeviceStatus = params => {return axios.post(`${ROADURL}rcu/finddeviceStatus`, params).then(res => res.data); };
