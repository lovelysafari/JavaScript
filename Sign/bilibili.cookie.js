/*
配置 (Surge)
[MITM]
*.bilibili.com

[Script]
http-request ^https:\/\/(www|live)\.bilibili\.com\/?.? script-path=https://raw.githubusercontent.com/chavyleung/scripts/master/bilibili/bilibili.cookie.js
cron "10 0 0 * * *" script-path=https://raw.githubusercontent.com/chavyleung/scripts/master/bilibili/bilibili.js
# 如需银瓜子转硬币，添加以下内容 
cron "10 0 0 * * *" script-path=https://raw.githubusercontent.com/chavyleung/scripts/master/bilibili/bilibili.silver2coin.js
配置 (QuanX)
[MITM]
*.bilibili.com

[rewrite_local]
# 189及以前版本
^https:\/\/(www|live)\.bilibili\.com\/?.? url script-response-body bilibili.cookie.js
# 190及以后版本
^https:\/\/(www|live)\.bilibili\.com\/?.? url script-request-header bilibili.cookie.js

[task_local]
1 0 * * * bilibili.js
# 如需银瓜子转硬币，添加以下内容 
1 0 * * * bilibili.silver2coin.js
说明
先在浏览器登录 (先登录! 先登录! 先登录!)
先把*.bilibili.com加到[MITM]
再配置重写规则:
Surge: 把两条远程脚本放到[Script]
QuanX: 把bilibili.cookie.js和bilibili.js传到On My iPhone - Quantumult X - Scripts (传到 iCloud 相同目录也可, 注意要打开 quanx 的 iCloud 开关)
打开浏览器访问: https://www.bilibili.com 或 https://live.bilibili.com
系统提示: 获取Cookie: 成功
最后就可以把第 1 条脚本注释掉了
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

const cookieName = 'bilibili'
const cookieKey = 'chavy_cookie_bilibili'
const chavy = init()
const cookieVal = $request.headers['Cookie']
if (cookieVal) {
  if (chavy.setdata(cookieVal, cookieKey)) {
    chavy.msg(`${cookieName}`, '获取Cookie: 成功', '')
    chavy.log(`[${cookieName}] 获取Cookie: 成功, cookie: ${cookieVal}`)
  }
}
function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
chavy.done()
