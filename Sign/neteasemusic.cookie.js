/*
配置 (Surge & Loon)
[MITM]
music.163.com

[Script]
http-request ^https:\/\/music.163.com\/weapi\/user\/level script-path=https://raw.githubusercontent.com/chavyleung/scripts/master/neteasemusic/neteasemusic.cookie.js,requires-body=true
cron "10 0 0 * * *" script-path=https://raw.githubusercontent.com/chavyleung/scripts/master/neteasemusic/neteasemusic.js
配置 （QuanX）
[MITM]
music.163.com

[rewrite_local]
^https:\/\/music.163.com\/weapi\/user\/level url script-request-body neteasemusic.cookie.js

[task_local]
1 0 * * * neteasemusic.js
说明
先登录: https://music.163.com/m/login
再访问: https://music.163.com/#/user/level
提示: 获取会话: 成功!
第 1 条脚本是用来获取 cookie 的, 用浏览器访问一次获取 cookie 成功后就可以删掉或注释掉了, 但请确保在登录成功后再获取 cookie.

第 2 条脚本是签到脚本, 每天00:00:10执行一次.

常见问题
无法写入 Cookie

检查 Surge 系统通知权限放开了没
如果你用的是 Safari, 请尝试在浏览地址栏手动输入网址(不要用复制粘贴)
写入 Cookie 成功, 但签到不成功

看看是不是在登录前就写入 Cookie 了
如果是，请确保在登录成功后，再尝试写入 Cookie

*/

const $ = new Env('网易云音乐')

!(async () => {
  $.log('', `🔔 ${$.name}, 获取会话: 开始!`, '')
  const session = {}
  session.url = $request.url
  session.body = $request.body
  session.headers = $request.headers
  delete session.headers['Content-Length']
  $.log('', `url: ${session.url}`, `body: ${session.body}`, `headers: ${JSON.stringify(session.headers)}`)
  if ($.setdata(JSON.stringify(session), 'chavy_cookie_neteasemusic')) {
    $.subt = '获取会话: 成功!'
  } else {
    $.subt = '获取会话: 失败!'
  }
})()
  .catch((e) => {
    $.subt = '获取会话: 失败!'
    $.desc = `原因: ${e}`
    $.log(`❌ ${$.name}, 获取会话: 失败! 原因: ${e}!`)
  })
  .finally(() => {
    $.msg($.name, $.subt, $.desc), $.log('', `🔔 ${$.name}, 获取会话: 结束!`, ''), $.done()
  })

// prettier-ignore
function Env(s){this.name=s,this.data=null,this.logs=[],this.isSurge=(()=>"undefined"!=typeof $httpClient),this.isQuanX=(()=>"undefined"!=typeof $task),this.isNode=(()=>"undefined"!=typeof module&&!!module.exports),this.log=((...s)=>{this.logs=[...this.logs,...s],s?console.log(s.join("\n")):console.log(this.logs.join("\n"))}),this.msg=((s=this.name,t="",i="")=>{this.isSurge()&&$notification.post(s,t,i),this.isQuanX()&&$notify(s,t,i);const e=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];s&&e.push(s),t&&e.push(t),i&&e.push(i),console.log(e.join("\n"))}),this.getdata=(s=>{if(this.isSurge())return $persistentStore.read(s);if(this.isQuanX())return $prefs.valueForKey(s);if(this.isNode()){const t="box.dat";return this.fs=this.fs?this.fs:require("fs"),this.fs.existsSync(t)?(this.data=JSON.parse(this.fs.readFileSync(t)),this.data[s]):null}}),this.setdata=((s,t)=>{if(this.isSurge())return $persistentStore.write(s,t);if(this.isQuanX())return $prefs.setValueForKey(s,t);if(this.isNode()){const i="box.dat";return this.fs=this.fs?this.fs:require("fs"),!!this.fs.existsSync(i)&&(this.data=JSON.parse(this.fs.readFileSync(i)),this.data[t]=s,this.fs.writeFileSync(i,JSON.stringify(this.data)),!0)}}),this.wait=((s,t=s)=>i=>setTimeout(()=>i(),Math.floor(Math.random()*(t-s+1)+s))),this.get=((s,t)=>this.send(s,"GET",t)),this.post=((s,t)=>this.send(s,"POST",t)),this.send=((s,t,i)=>{if(this.isSurge()){const e="POST"==t?$httpClient.post:$httpClient.get;e(s,(s,t,e)=>{t&&(t.body=e,t.statusCode=t.status),i(s,t,e)})}this.isQuanX()&&(s.method=t,$task.fetch(s).then(s=>{s.status=s.statusCode,i(null,s,s.body)},s=>i(s.error,s,s))),this.isNode()&&(this.request=this.request?this.request:require("request"),s.method=t,s.gzip=!0,this.request(s,(s,t,e)=>{t&&(t.status=t.statusCode),i(null,t,e)}))}),this.done=((s={})=>this.isNode()?null:$done(s))}
