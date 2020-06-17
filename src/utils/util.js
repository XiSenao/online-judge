import {getToken} from '@/utils/auth'

const IMGUtils = {
  getSettings: function (url, data, method = 'GET') {
    return {
      url: url,
      method: method,
      async: true,
      crossDomain: true,
      headers: {
        token: getToken() // 不能使用store中的token, 由于刷新时就把store中的token清掉因此获取的是undefined, 因此直接获取本地cookie中的token即可
      },
      xhrFields: {
        withCredentials: true
      },
      data: data || ''
    }
  }
}
export default IMGUtils
