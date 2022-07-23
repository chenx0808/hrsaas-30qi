// 定义自定义指令
// 解决图片报错的问题
export const imgError = {
  inserted(el, options) {
    // el：指令所绑定的元素，可以用来直接操作dom
    // console.log(el)
    // console.log(options.value)
    // 如果图片赋值出错了就给他一个默认图片
    el.onerror = function() {
      el.src = options.value
    }
  }
}

export const focus = {
  // 当被绑定的元素插入dom中时。。
  inserted: function(el) {
    // 聚焦元素
    el.focus()
  }
}
