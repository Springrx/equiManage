import axios from 'axios';
import { message } from 'antd';

// export const HOST = 'https://www.y-droid.com/feedback';
export const HOST = 'http://10.177.44.94:9091';

export default function fetch(option = {}) {
  const { url, byteResponse = false, id,...rest } = option;
  return axios({
    url: `${HOST}${url}`,
    withCredentials: true,
    ...rest,
  }).then(res => {    
    const { code, data } = res.data;
    // if (code !== '200') {
    //   message.error('服务器错误，请重试');
    //   return Promise.reject(new Error('服务器错误，请重试'));
    // }
    const msg=res.data.message;
    // const { code, msg } = data || {};
    if (code === '200') {
      return data;
    }
    if (byteResponse) {
      return data;
    }
    message.error(msg || '服务器错误，请重试');
    return Promise.reject(new Error(msg));
  });
}