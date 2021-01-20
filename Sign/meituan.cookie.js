/*
配置 (Surge)
[MITM]
hostname = i.meituan.com

[Script]
http-request ^https:\/\/i.meituan.com\/evolve\/signin\/signpost\/ script-path=https://raw.githubusercontent.com/chavyleung/scripts/master/meituan/meituan.cookie.js, requires-body=true
cron "10 0 0 * * *" script-path=https://raw.githubusercontent.com/chavyleung/scripts/master/meituan/meituan.js
配置 (QuanX)
[MITM]
i.meituan.com

[rewrite_local]

# [商店版] QuanX v1.0.6-build194 及更早版本
# 不支持

# [TestFlight] QuanX v1.0.6-build195 及以后版本
^https:\/\/i.meituan.com\/evolve\/signin\/signpost\/ url script-request-body meituan.cookie.js

[task_local]
1 0 * * * meituan.js
说明
先把i.meituan.com加到[MITM]
再配置重写规则:
Surge: 把两条远程脚本放到[Script]
QuanX: 把meituan.cookie.js和meituan.js传到On My iPhone - Quantumult X - Scripts (传到 iCloud 相同目录也可, 注意要打开 quanx 的 iCloud 开关)
打开 APP , 然后手动签到 1 次, 系统提示: 获取Cookie: 成功 (首页 > 红包签到)
把获取 Cookie 的脚本注释掉
运行一次脚本, 如果提示重复签到, 那就算成功了!
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

const cookieName = '美团'
const tokenurlKey = 'chavy_tokenurl_meituan'
const tokenheaderKey = 'chavy_tokenheader_meituan'
const signurlKey = 'chavy_signurl_meituan'
const signheaderKey = 'chavy_signheader_meituan'
const signbodyKey = 'chavy_signbody_meituan'
const chavy = init()

const requrl = $request.url
if ($request && $request.method != 'OPTIONS' && requrl.match(/\/evolve\/signin\/signpost\//)) {
  const signurlVal = requrl
  const signheaderVal = JSON.stringify($request.headers)
  const signbodyVal = $request.body
  if (signurlVal) chavy.setdata(signurlVal, signurlKey)
  if (signheaderVal) chavy.setdata(signheaderVal, signheaderKey)
  if (signbodyVal) chavy.setdata(signbodyVal, signbodyKey)
  chavy.msg(cookieName, `获取Cookie: 成功`, ``)
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
