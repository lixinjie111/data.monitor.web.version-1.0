import Vue from 'vue'
import axios from 'axios'
// Element-ui
import ElementUI from 'element-ui'

axios.defaults.withCredentials = true;
Vue.prototype.$http = axios;

// 避免在账号登录失效后提示多次
let isOutLogin = true;
/**
 * axios过滤器
 */
function axiosFilter(vm) {
    // request
    axios.create({
      baseURL: cfg.url,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      responseType: 'json',
      transformResponse: [function(data) { //后端发送过来的数据
        return data;
      }],
      transformRequest: [function(data) {
        return data;
      }]
    });

    // response
    axios.interceptors.response.use(function(response) {
        let returnStatus = response.data.status || response.data.code;
        switch (returnStatus.toString()) {
            case '200': {
                return response;
                break;
            }
            case '403': {
                vm.$message.error('无权限');
                reject();
                break;
            }
            case '407': {
                vm.$message.error('需要身份验证');
                reject();
                break;
            }
            case '500': {
                vm.$message.error('服务器出错，操作失败');
                reject();
                break;
            }
            default: {
                vm.$message.error('操作失败');
                reject();
            }
        }

        // 失去效果登录
        if(isOutLogin && (response.data.status == '204')) {
            isOutLogin = false;
            vm.$confirm(response.data.msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeAuthInfo();
                window.location.href = '/'
                isOutLogin = true;
            }).catch(() => {
                removeAuthInfo();
                window.location.href = '/'
                isOutLogin = true;
            });
        }
        // return response;
    }, function(error) {
        vm.$message.error('error!');
        console.log(error);
        return Promise.reject(error);
        // vm.$alert('登录已过期，请重新登录', '', {
        //     confirmButtonText: '确定',
        //     callback: action => {
        //         removeAuthInfo();
        //         window.location.href = '/'
        //         isOutLogin = true;
        //     }
        // });
    });
}

export default axiosFilter