

//以上是配置说明
const $slowcity = slowcity();//声明必须

const u = "https://api.jyeoo.com/Profile/GetSignRules";
const h = {"Cookie": "jy=58B5FEAEFD6C91074A1D9646C7520424A6181DA707CE8FE3FFCAFEFC81B11A8D2D999110463D7F2FDF4C10CCE4FF7E3809257A95B5547034E2228B42A6C0514B1FAEAB1BBC85DFD6003BC150A14842C058EFD6B52431D0EF932FD61A31F292F368D8F2C26E31F470C83729F3893FD9BE5C01C8FEAF3D31CD988ADF763B7C3B42FA5B4D340E8C4F45CBC92AA2D8BB3BE0D8B509936674DF1954DEF6D205CCB4128B56F1E63E7848F7E282CA66187B5F5BCD8DA9F38DA2A1579FB2A054994FD6067B42EF83829F087C2B42E1DCFDB152224EBF625584831696692C47993DE86738493094B41DD8BF90EA8D7E8E46C3B5485956AB7A9777A5F0CE1C2F31DD7F980CDBF97F53CECFEB5C78563214542B2A9C4DA08BF558FD64088BDAED64294D0C70451DECE43B45CA3EC8294953910792148AAEC4072F2BB442577144E080694083388F633769EE4A16B22E02D625EFEB47B55D3EB19AB5E64DF5AA865C5816CDC1"};






//++++++++++++++++++++++++++++++++

//3.需要执行的函数都写这里
function main()
{


qx_main();

  

}




main()


//++++++++++++++++++++++++++++++++++++
//4.基础模板






function qx_main()
{
  const slowcityurl = {url:u,
  headers:h,

  }
     $slowcity.post(slowcityurl, function(error, response, data) {
      
 if(error){
          $slowcity.notify("获取金币失败","","");
      if(log) console.log("获取金币"+data)    
      }
      else {
          var obj = JSON.parse(data)
if(obj.err_no == 1)
{$slowcity.notify(obj.Sign.LastDate+". 菁优网签到成功","已经连续签到"+obj.Sign.Days+"天","")}
if(obj.Succ== 2)
{$slowcity.notify("今日菁优网已经签到过了","㊗️你生活愉快，万事如意！","已经连续签到"+obj.Sign.Days+"天")}
}



console.log("测试"+data)
})


}












//以下不要改动圈叉固定函数
function papa(x,y,z){

 $slowcity.notify(x,y,z);}




function slowcity() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};
