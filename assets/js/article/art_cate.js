$(function () {
  // 获取表格数据
  const initArtCateList = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: (res) => {
        const htmlStr = template("tpl-table", res)
        $('tbody').empty().html(htmlStr)
      }
    })
  }
  // 渲染页面
  initArtCateList()

  // 新增分类
  // 点击添加弹出页面
  const layer = layui.layer;
  let indexAdd = null
  $("#btnAddCate").click(() => {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $('#dialog-add').html()
    });
  });
  // 通过事件委托的方式监听提交事件  添加成功
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg('新增文章失败!')
        layer.msg('新增文章成功!')
        initArtCateList()
        layer.close(indexAdd)
      }
    })
  })
  // 编辑部分
  // 通过代理方式，为 btn-edit 按钮绑定点击事件
  let indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    // 弹出修改文章分类的弹窗
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    const id = $(this).attr('data-id')
    $.ajax({
      type: 'GET',
      url: '/my/article/cates/' + id,
      success: (res) => {
        console.log(res);
        layui.form.val('form-edit', res.data)
      }
    })
  });
  // 修改完成
  // 更新文章分类
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: (res) => {
        console.log(res);
        if (res.status !== 0) return layer.msg('修改失败!!!')
        layer.msg('修改成功!!!!!')
        // 渲染最新的页面
        initArtCateList()
        // 退出编辑小页面
        layer.close(indexEdit)

      }
    })
  })
  // 删除文章分类
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id')
    // 提示用户是否删除
    layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除分类失败！");
          }
          layer.msg("删除分类成功！");
          layer.close(index);
          initArtCateList();
        },
      });
    });
  })
})
