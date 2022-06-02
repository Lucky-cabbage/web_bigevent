$(function () {
  const form = layui.form;
  const laypage = layui.laypage
  // 定义查询参数对象,存放发送请求时的数据
  const q = {
    pagenum: 1,  // 页嘛值 默认为第一个
    pagesize: 5,  // 每页显示的数据
    cate_id: '', // 查询分类文章的id
    state: '',  // 查询文章的状态
  }
  // 获取表格数据
  const initTable = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      success: (res) => {
        if (res.status !== 0) return layer.msg('获取表格数据失败!!')
        const htmlStr = template('tpl-table', res)
        // 调用渲染分页的方法
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }
  // 初始化文章分类的方法
  const initCate = () => {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  };
  // 筛选数据
  $('#form-search').submit((e) => {
    e.preventDefault()
    q.cate_id = $('[name=cate_id]').val()
    q.state = $('[name=state]').val()
    console.log(q);
    // 重新调用获取文章列表的函数
    initTable()
  })
  // 定义渲染分页
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum,// 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],// 每页展示多少条
      // jump触发条件
      // 渲染的时候会先加载一次,此时 first 参数为true
      //切换页码的时候也会触发,此时first参数为undefined
      jump: (obj, first) => {
        console.log(first);
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        // 渲染的时候不要调用 切换的时候才会调用
        // if(!first) 不等于true就调用
        if (first == undefined) {
          initTable()
        };
      }
    });
  };
  // 删除文章
  $('tbody').on('click', '.btn-del', function () {
    // 获取页面上所有删除按钮的个数
    const len = $('.btn-del').length
    const id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 在重新获取文章列表之前改好q里面的参数
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
          layer.close(index)
        }
      })
    })
  })

  initTable()
  initCate()

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
})
