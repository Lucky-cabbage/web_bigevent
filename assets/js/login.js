$(function () {
  // 点击去注册账号让 登录框隐藏，注册框显示
  $("#link_reg").click(() => {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  // 点击去登录让 注册框隐藏，登录框显示
  $("#link_login").click(() => {
    $(".login-box").show();
    $(".reg-box").hide();
  });
  // 引入form 模块
  const form = layui.form
  // 自定义校验规则
  form.verify({
    // 密码校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位,且不能出现空格"],
    // 确认密码校验规则
    repwd: (value) => {
      // 1.获取当前输入的值
      //2.获取密码框的值
      //3.两者进行判断
      //4.如果不一致,提示消息
      const pwd = $("#form_reg [name=password]").val();
      if (pwd !== value) return "两次密码不一致"
    },
  });
  // 设置baseUrl

  // 注册功能
  $('#form_reg').on('submit', (e) => {
    // 阻止默认提交事件
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val(),
      },
      success: (res) => {
        if (res.status !== 0) return layer.msg('注册失败')
        layer.msg('注册成功')
        // 模拟点击跳转登录
        $('#link_login').click()
      }
    })
  })
  // 登录功能
  $('#form_login').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg('登陆失败')
        layer.msg('登陆成功')
        // 登录成功后需要吧token令牌存放在本地
        // 本地存储的集项里面的令牌
        // token 登录的唯一标识
        localStorage.setItem('token', res.token)
        // 跳转到主页
        location.href = '/index.html'
      }
    })
  })
});
