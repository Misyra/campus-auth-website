// amiya.cc -> campus-auth.misyra.com 301 重定向 Worker
// 保留原始路径与查询参数：amiya.cc/docs?a=1 -> campus-auth.misyra.com/docs?a=1
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = new URL("https://campus-auth.misyra.com");
    target.pathname = url.pathname;
    target.search = url.search;
    return Response.redirect(target.toString(), 301);
  },
};
