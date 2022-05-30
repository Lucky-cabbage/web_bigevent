// 注意:每次调用$.get() 或$.post()或$.ajax()的时候\
//会先调用ajaxPrefilter 这个函数
// 在这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter((options) => {
  options.url = 'http://www.liulongbin.top:3007' + options.url
  if (options.url.includes('/my/')) {
    options.headers = {
      Authorization: localStorage.getItem('token')
    };
  }
  // 每次发送请求回来校验token是否存在是否过期
  options.complete = (res) => {
    if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败!") {
      //1.强制清空
      localStorage.removeItem('token')
      // 2.跳转到页面
      location.href = '/login.html'
    }
  }
})
