// var baseurl = 'http://dev.ngdemo.cn/mufa/'; //服务器url
// var imgurl = 'http://dev.ngdemo.cn/mufa/statics'; //图片url
var baseurl = 'http://192.168.0.22:8900/'; //服务器url
var imgurl = 'http://192.168.0.22:8900/statics'; //图片url

//  复制方法
function copy_fun(copy) { //参数copy是要复制的文本内容
	mui.plusReady(function() {
		//判断是安卓还是ios
		if (mui.os.ios) {
			//ios
			var UIPasteboard = plus.ios.importClass("UIPasteboard");
			var generalPasteboard = UIPasteboard.generalPasteboard();
			//设置/获取文本内容:
			generalPasteboard.plusCallMethod({
				setValue: copy,
				forPasteboardType: "public.utf8-plain-text"
			});
			generalPasteboard.plusCallMethod({
				valueForPasteboardType: "public.utf8-plain-text"
			});
			mui.toast("已成功复制到剪贴板");
		} else {
			//安卓
			var context = plus.android.importClass("android.content.Context");
			var main = plus.android.runtimeMainActivity();
			var clip = main.getSystemService(context.CLIPBOARD_SERVICE);
			plus.android.invoke(clip, "setText", copy);
			mui.toast("已成功复制到剪贴板");
		}
	});
}

var util = {
	request: function(method, url, data, success, error) {
		var token = plus.storage.getItem('token');
		if (!token) {
			mui.toast('请登录');
			return;
		}
		mui.ajax({
			type: 'get',
			url: baseurl + url,
			dataType: "json",
			beforeSend: function(XMLHttpRequest) {
				XMLHttpRequest.setRequestHeader(
					"token", token
				);
			},
			headers: {
				'contentType': "application/x-www-form-urlencoded",
				'token': token
			},
			data: data,
			success: function(data) {
				success(data);
			},
			error: function(err) {
				error(err);
			}
		})
	}
};
