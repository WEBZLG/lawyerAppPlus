var baseurl = 'http://mufa.ngdemo.cn/'; //服务器url
var imgurl = 'http://mufa.ngdemo.cn/statics'; //图片url
// var baseurl = 'http://192.168.0.22:8900/'; //服务器url
// var imgurl = 'http://192.168.0.22:8900/statics'; //图片url
// 复制
mui("body").on('tap', '#copy', function() {
	var num = this.getAttribute("num");
	copy_fun(num)
});
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
mui('body').on('tap', 'button', function() {
	document.activeElement.blur();
})
mui("body").on("tap", ".imageup", function() {
	document.activeElement.blur();
});
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
// 修改信息
function changeinfo(token, headimgurl, nickname, phone, code, fun) {
	mui.ajax({
		type: 'post',
		url: baseurl + "mffl/updateSysUser",
		dataType: "json",
		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader(
				"token", token
			);
		},
		header: {
			'contentType': "application/x-www-form-urlencoded",
			'token': token
		},
		data: {
			'headImgUrl': headimgurl,
			'nickname': nickname,
			'phone': phone,
			'code': code
		},
		success: function(data) {
			console.log(data);
			if (data.errCode == 200) {
				plus.storage.setItem('userinfo', data.datas);
				mui.toast("修改成功！")
				var userinfo = plus.storage.getItem('userinfo');
				console.log(userinfo)
				fun(data);
			} else {
				mui.toast("data.message")
			}
		},
		error: function(err) {
			console.log(err)
		}
	});
};
//扩展mui.showLoading
(function($, window) {
    //显示加载框
    $.showLoading = function(message,type) {
        if ($.os.plus && type !== 'div') {
            $.plusReady(function() {
                plus.nativeUI.showWaiting(message);
            });
        } else {
            var html = '';
            html += '<i class="mui-spinner mui-spinner-white"></i>';
            html += '<p class="text">' + (message || "数据加载中") + '</p>';

            //遮罩层
            var mask=document.getElementsByClassName("mui-show-loading-mask");
            if(mask.length==0){
                mask = document.createElement('div');
                mask.classList.add("mui-show-loading-mask");
                document.body.appendChild(mask);
                mask.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
            }else{
                mask[0].classList.remove("mui-show-loading-mask-hidden");
            }
            //加载框
            var toast=document.getElementsByClassName("mui-show-loading");
            if(toast.length==0){
                toast = document.createElement('div');
                toast.classList.add("mui-show-loading");
                toast.classList.add('loading-visible');
                document.body.appendChild(toast);
                toast.innerHTML = html;
                toast.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
            }else{
                toast[0].innerHTML = html;
                toast[0].classList.add("loading-visible");
            }
        }   
    };

    //隐藏加载框
      $.hideLoading = function(callback) {
        if ($.os.plus) {
            $.plusReady(function() {
                plus.nativeUI.closeWaiting();
            });
        } 
        var mask=document.getElementsByClassName("mui-show-loading-mask");
        var toast=document.getElementsByClassName("mui-show-loading");
        if(mask.length>0){
            mask[0].classList.add("mui-show-loading-mask-hidden");
        }
        if(toast.length>0){
            toast[0].classList.remove("loading-visible");
            callback && callback();
        }
      }
})(mui, window);