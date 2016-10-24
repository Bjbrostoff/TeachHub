/**
 * Created by apple on 16/1/5.
 */

define('app/usercenter/view/MyCertView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/usercenter/template/MyCertView.ejs',

	'bootstrap',
	'bootbox',
	'i18n!/nls/uchome.js'

],
function(_, Backbone, $ ,tmpl, bootstrap,bootbox,LocaleHome){
    var v = Backbone.View.extend({
	    events:{
		    'click #testBtn':'testBtn_clickHandler',
		    'click #more':'more_clickHandler',
		    'click #hide':'hide_clickHandler',
		    'click #mycertsub':"sub_clickHandler",
			"click #addList":"addServer",
			"click .closeIcon":"closeImg",
			"click #addListxx":"addServerxx",
			"click .closeIconxx":"closeImgxx"

	    },
        initialize:function(){
            this.template = _.template(tmpl);
	        this.elems = {
		        'testBtn':'#testBtn',
	            'mycertFields':'.mycert-field',
		        'more':"#more",
		        'mycert_hide':"#hide",
		        'expTeacher':"#expTeacher",
				'mycert_sub':"#mycertsub",
		        'mycert_opt':".mycert_teacher",
		        'mycert_radio':".mycert_radio",
		        'mycert_id':"#mycert_id",
				'mycert_anency':".mycert_agency",
				'add_list':"#addList"

	        }
			this.setFunc();
        },
        render:function(){
			this.imageArr = this.model.toJSON().servexerti;
			if(this.imageArr == undefined){
				this.imageArr = new Array();
			}
			this.imageArrxx = this.model.toJSON().servexerti;
			if(this.imageArrxx == undefined){
				this.imageArrxx = new Array();
			}
            $(this.el).html(
				this.template({
					locale:LocaleHome,
					mycert:this.model.toJSON()
				}));
            return this;
        },addServer:function(){
			var info = $("#infoText").val();
			var honorImg = $("#infoImg").val();
			var time = $("#infoTimeText").val();
			if( !((info !='' && honorImg !='' && time !='') )){
				bootbox.alert(LocaleHome.MyCert.completeInfo);
				return false;
			}
			var servexerti = {};
			if(info !='' && honorImg !='' && time !=''){

				servexerti.info = info;
				servexerti.image = honorImg;
				servexerti.time = time;
			}
			console.log(servexerti);

			var model = '	<div style="margin-bottom: 3px;" class="col-sm-5"><a count="'+this.imageArr.length+'"  class="closeIcon close_link " style="position: absolute; left: 53px;"> <i class="fa fa-times"></i> </a>'
				+'<img title='+LocaleHome.MyCert.time+time+LocaleHome.MyCert.info+info+'" class="hhhimg" style="width:50px;height:50px;" src="'+honorImg+'">'
				+'</div>';
			this.imageArr.push(servexerti);
			$("#honorList").append(model);

		},addServerxx:function(){
			var info = $("#infoTextxx").val();
			var honorImg = $("#honorImg").val();
			var time = $("#infoTimeTextxx").val();
			if( !((info !='' && honorImg !='' && time !='') )){
				bootbox.alert(LocaleHome.MyCert.completeInfo);
				return false;
			}
			var servexerti = {};
			if(info !='' && honorImg !='' && time !=''){

				servexerti.info = info;
				servexerti.image = honorImg;
				servexerti.time = time;
			}
			var model = '	<div style="margin-bottom: 3px;" class="col-sm-5"><a count="'+this.imageArrxx.length+'"  class="closeIconxx close_linkxx " style="position: absolute; left: 53px;"> <i class="fa fa-times"></i> </a>'
				+'<img title='+LocaleHome.MyCert.time+time+LocaleHome.MyCert.info+info+'" class="hhhimg" style="width:50px;height:50px;" src="'+honorImg+'">'
				+'</div>';
			this.imageArrxx.push(servexerti);
			$("#honorListxx").append(model);

		},setFunc:function(){
			console.log(11112);
			$(".closeIcon").unbind("click");
			var self = this;
			$(".closeIcon").bind("click",function(){
				self.closeImg(this);
			});
		}	,closeImgxx:function(evt){
			var that = evt.currentTarget;
			console.log(1111);
			$(that).parent().remove();
			var newarr = new Array();
			var i = $(that).attr("count");
			$("#honorListxx").empty();
			for(var x = 0 ;x < this.imageArrxx.length ; x++){
				if(x != i){
					var xx = this.imageArrxx[x];
					var model = '	<div style="margin-bottom: 3px;" class="col-sm-5"><a count="'+newarr.length+'"   class="close-linkxx closeIconxx" style="position: absolute; left: 53px;"> <i class="fa fa-times"></i> </a>'
						+'<img title="'+xx.info+'" class="hhhimg" style="width:50px;height:50px;" src="'+xx.image+'">'
						+'</div>';
					$("#honorListxx").append(model);
					newarr.push(xx);
				}
			}
			this.imageArrxx = newarr;
		}

		,closeImg:function(evt){
			var that = evt.currentTarget;
			console.log(1111);
			$(that).parent().remove();
			var newarr = new Array();
			var i = $(that).attr("count");
			$("#honorList").empty();
			for(var x = 0 ;x < this.imageArr.length ; x++){
				if(x != i){
					var xx = this.imageArr[x];
					var model = '	<div style="margin-bottom: 3px;" class="col-sm-5"><a count="'+newarr.length+'"   class="close-link closeIcon" style="position: absolute; left: 53px;"> <i class="fa fa-times"></i> </a>'
						+'<img title="'+xx.info+'" class="hhhimg" style="width:50px;height:50px;" src="'+xx.image+'">'
						+'</div>';
					$("#honorList").append(model);
					newarr.push(xx);
				}
			}
			this.imageArr = newarr;
		}
		,
	    testBtn_clickHandler:function(evt){
			console.log($(evt.currentTarget).attr('data'));
		    $(this.elems.testBtn).css({
			    'display':'none'
		    });
	    },
	    more_clickHandler:function(cc){
		    $(this.elems.expTeacher).show();
		    $(this.elems.more).hide();
		    /*$( this.elems.more).unbind("click");*/
		    $( this.elems.mycert_hide).show();
		   /* $( this.elems.mycert_hide).bind("click",hide_clickHandler());*/
	    },
	    hide_clickHandler:function(){
		    $( this.elems.expTeacher).hide();
		    $( this.elems.mycert_hide).hide();
		   /* $( this.elems.mycert_hide).unbind("click");*/
		    $( this.elems.more).show();
		   /* $( this.elems.more).bind("click",more_clickHandler);*/
	    },sub_clickHandler:function(){

		    var data ;
		    var url = '/users/authenticate';
		    var acId = $(this.elems.mycert_id).val();
		  var usertype =  $(":radio:checked").val();
		    console.log($(this.elems.mycert_radio).find(":checked"));
		    if(usertype == '1' && acId != ''){
			    url = '/users/authenticateDB';//教师补充认证
		    }else if(usertype == '2' && acId != ''){
				url = '/users/authagencyDB';//机构补充认证
		    }
			if(usertype =='2'&& acId == ''){
				url = '/users/authagency';
			}
			if(usertype == '1') {
				data = this.teacherCheck();
			}else{
				data = this.orderCheck()

			}
		    console.log(url);

		    if(typeof data !='object' &&!data){
			    return;
		    }
			data._id = acId;
		    $.ajax({
			    url: url,
			    type: 'POST',
			    dataType:"json",
			    data: data,
			    success: function(data1){
				    console.log(data1);
				    if(200 === data1.code) {
					    bootbox.alert(LocaleHome.MyCert.success)
				    } else {
					    var msg = data1.msg;
					    if(msg == undefined){
						    msg = LocaleHome.MyCert.error;
					    }
					    bootbox.alert(msg);
				    }

			    },
			    error: function(){
				    $("#spanMessage").html(LocaleHome.MyCert.errorNet);
			    }
		    });




	    },teacherCheck:function(){
			var data = {};
		    var cc = this.elems.mycert_opt;
		    var jsonData = {};
		    $(cc).each(function(i,n){
			   var fname = $(n).attr("name");
			    var value = $(n).val();
			    jsonData[fname] = value;
		    });
		    var name = jsonData['name']//真实姓名
		    var credentype = jsonData['credentype'];//证件类型
		    var credencode = jsonData['credencode'] ;//证件号码
		    var credenImg = jsonData['credenImg'] ;//证件照片
		    var payway = jsonData['payway'] ;//付款方式



		    if(name == ''){
			    bootbox.alert(LocaleHome.MyCert.trueName);
			    return false;
		    }
		    data.name = name;
		    if(credentype ==''){
			    bootbox.alert(LocaleHome.MyCert.card);
			    return false;
		    }
		    data.credentype = credentype;
		    if(credencode == ''){
			    bootbox.alert(LocaleHome.MyCert.cardNum);
			    return false;
		    }
		    data.credencode = credencode;
		    if(credenImg == ''){
			    bootbox.alert(LocaleHome.MyCert.cardPhoto);
			    return false;
		    }
		    data.credenImg = credenImg;
		    if(payway == ''){
			    bootbox.alert(LocaleHome.MyCert.payWay);
			    return false;
		    }
		    data.payway = payway;
		    //可选项

		    var level = jsonData['level'];
		    var image = jsonData['image'] ;
		    var code = jsonData['code'];
		    if( !((level !='' && image !=''  && code !='') ||(level =='' && image ==''  && code ==''))){
			    bootbox.alert(LocaleHome.MyCert.schoolInfo);
			    return false;
		    }
		    if(level !='' && image !=''  && code !='') {
			    var acadecerti = {};
			    acadecerti.level = level;
			    acadecerti.image = image;
			    acadecerti.code = code;
			    data.acadecerti = JSON.stringify(acadecerti);
		    }
		    var info = jsonData['info'];
		    var honorImg =  jsonData['honorImg'];
		    if( !((info !='' && honorImg !='') ||(info =='' && honorImg =='' ))){
			    bootbox.alert(LocaleHome.MyCert.completeInfo);
			    return false;
		    }
		    if(info !='' && honorImg !=''){
			    var servexerti = {};
			    servexerti.info = info;
			    servexerti.image = honorImg;
			    data.servexerti = JSON.stringify(servexerti);
		    }

		    var workexp = jsonData['workexp'];
		    if(workexp !=''){
			    data.workexp = workexp;
		    }

		    return data;
	    },orderCheck:function(){
			var data = {};
			var compname = $("[name='compname']").val();
			if (compname == '') {
				bootbox.alert(LocaleHome.MyCert.comName);
				return false;
			}
			data.name = compname;
			var yyimage = $("[name='yyimage']").val();
			if (yyimage == '') {
				bootbox.alert(LocaleHome.MyCert.open);
				return false;
			}
			data.image = yyimage;
			var leadname = $("[name='leadname']").val();
			var leadcode = $("[name='leadcode']").val();
			var leadimage = $("[name='leadimage']").val();
			if( !((leadname !='' && leadcode !=''  && leadimage !='') ||(leadname =='' && leadcode ==''  && leadimage ==''))){
				bootbox.alert(LocaleHome.MyCert.auth);
				return false;
			}
			if(leadname !='' && leadcode !=''  && leadimage !='') {
				var acadecerti = {};
				acadecerti.name = leadname;
				acadecerti.code = leadcode;
				acadecerti.image = leadimage;
				data.legalinfo  = JSON.stringify(acadecerti);
			}
			console.log(data.legalinfo);
			if(this.imageArr.length > 0){
				data.servexerti  = JSON.stringify(this.imageArr);
			}
			return data;
		},
	    show: function () {
		    this._show();
	    },
	    hide: function () {
		    this._hide();
	    },
	    _hide: function () {
		    $(this.el).css({
			    'display': 'none'
		    })
	    },
	    _show: function () {
		    $(this.el).css({
			    'display': 'block'
		    });
	    }
    });

    return v;
})