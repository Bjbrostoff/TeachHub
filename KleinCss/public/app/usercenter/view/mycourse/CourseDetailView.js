/**
 * Created by apple on 16/1/8.
 */
define('app/usercenter/view/mycourse/CourseDetailView',
	[
		'underscore',
		'backbone',
		'jquery',
		'text!/app/usercenter/template/mycourse/CourseDetailView.ejs',
		'bootbox',
		'i18n!/nls/uchome.js',
	],
	function(_, Backbone, $, tmpl,bootbox,MyCourse
	         ){
		var v = Backbone.View.extend({
			events:{
				'click .teacher-detail-close':'closeView_handler',
				'click #profile-button':'openProfileView_handler',
				'mouseover #coursestar li':"mycousrstar_mouse_over",
				'click #coursestar li':"mycousrstar_mouse_click",
				'mouseout #coursestar li':"mycousrstar_mouse_out",
				'mouseover #easystar li':"myeasystar_mouse_over",
				'click #easystar li':"myeasystar_mouse_click",
				'mouseout #easystar li':"myeasystar_mouse_out",
				'click #mycourse_sub_btn': 'mycourse_sub_btn_handler',
				'click #mycourse_cancel_btn':'mycourse_cancel_btn_handler',
				'mouseout #teastar li':"myteastar_mouse_out",
				'mouseover #teastar li':"myteastar_mouse_over",
				'click #teastar li':"myteastar_mouse_click"

			},
			initialize:function(options){

				this.template = _.template(tmpl);

				this.els = {
					"mycourse_detail_star":"#coursestar",
					"mycourse_easy_star":"#easystar",
					"mycourse_tea_star":"#teastar"

				};
				this.oldStar = {
					coursestar:0,
					easystar:0,
					teastar:0
				};

				this.curel = {};


			},
			render:function(){
				this.curel = this.model;
				var json = this.model.toJSON();

				if(json.easyscore != undefined){
					this.oldStar.easystar = json.easyscore;
				}
				if(json.teacherscore != undefined){
					this.oldStar.teastar = json.teacherscore;
				}
				if(json.coursescore != undefined){
					this.oldStar.coursestar = json.coursescore;
				}

				$(this.el).html(this.template({
					info:json,
					locale:MyCourse
				}));


				return this;
			},

			closeView_handler:function(){
				//console.log('11');
				this.remove();
			},
			addSlimScroll:function(){
				$('.full-height-scroll').slimscroll({
					height: '100%'
				});
			},
			openProfileView_handler:function(){
				//console.log(this.model.attributes);
				this.trigger('open-profile-view', {userid:this.model.attributes.uuid});
			},mycousrstar_mouse_over:function(evt){
				var i = $(evt.currentTarget).find("a").html();
					i = parseInt(i);
				$(this.els.mycourse_detail_star +" li").removeClass("on");
				for(var index = 0; index < i ; index++ ){
					var elstar = 	$(this.els.mycourse_detail_star).find("li")[index];
				$(elstar).addClass("on");
				}
			},mycousrstar_mouse_click:function(evt){
				var i = $(evt.currentTarget).find("a").html();
				i = parseInt(i);
				this.oldStar.coursestar = i;
			},mycousrstar_mouse_out:function(evt){

				$(this.els.mycourse_detail_star +" li").removeClass("on");
				var old = this.oldStar.coursestar;

				for(var index = 0; index < old ; index++ ){
					var elstar = 	$(this.els.mycourse_detail_star).find("li")[index];
					$(elstar).addClass("on");
				}
			},myeasystar_mouse_over:function(evt){
				var i = $(evt.currentTarget).find("a").html();
				i = parseInt(i);
				$(this.els.mycourse_easy_star +" li").removeClass("on");
				for(var index = 0; index < i ; index++ ){
					var elstar = 	$(this.els.mycourse_easy_star).find("li")[index];
					$(elstar).addClass("on");
				}
			},myeasystar_mouse_click:function(evt){
				var i = $(evt.currentTarget).find("a").html();
				i = parseInt(i);
				this.oldStar.easystar = i;
			},myeasystar_mouse_out:function(evt){
				$(this.els.mycourse_easy_star +" li").removeClass("on");
				var old = this.oldStar.easystar;

				for(var index = 0; index < old ; index++ ){
					var elstar = 	$(this.els.mycourse_easy_star).find("li")[index];
					$(elstar).addClass("on");
				}
			},myteastar_mouse_over:function(evt){
				var i = $(evt.currentTarget).find("a").html();
				i = parseInt(i);
				$(this.els.mycourse_tea_star +" li").removeClass("on");
				for(var index = 0; index < i ; index++ ){
					var elstar = 	$(this.els.mycourse_tea_star).find("li")[index];
					$(elstar).addClass("on");
				}
			},myteastar_mouse_click:function(evt){
				var i = $(evt.currentTarget).find("a").html();
				i = parseInt(i);
				this.oldStar.teastar = i;
			},myteastar_mouse_out:function(evt){
				$(this.els.mycourse_tea_star +" li").removeClass("on");
				var old = this.oldStar.teastar;
				for(var index = 0; index < old ; index++ ){
					var elstar = 	$(this.els.mycourse_tea_star).find("li")[index];
					$(elstar).addClass("on");
				}
			},mycourse_sub_btn_handler:function(){
				var json = this.curel.toJSON();
				if(json.easyscore != undefined && json.teacherscore != undefined && json.coursescore != undefined){
					bootbox.alert(MyCourse.MyCourse.notevaluatedagain)//"已经做过评价，无法再次评价！"
					return;
				}
				var curelid = this.curel.attributes._id;
				var courseid = this.curel.attributes.courceid._id
				var teacherid = this.curel.attributes.teacherid._id


				var easystar = 	this.oldStar.easystar;
				var coursestar = this.oldStar.coursestar;
				var teastar = this.oldStar.teastar;
				if(coursestar == 0){
					bootbox.alert(MyCourse.MyCourse.CourseRating);
					return;
				}
				if(easystar == 0){
					bootbox.alert(MyCourse.MyCourse.coursedifficultyRating);
					return;
				}
				if(teastar == 0){
					bootbox.alert(MyCourse.MyCourse.giveteacherRating);
					return;
				}
				var self = this;
				$.ajax({
					type:"post",
					url:"/users/markTheCourse",
					data:{'curelid':curelid,'courseid':courseid,'easystar':easystar,'coursestar':coursestar,'teastar':teastar,'teacherid':teacherid},
					success:function(data){
						if(data.code == '202'){
							bootbox.alert(data.msg);
						}else{
							bootbox.alert(MyCourse.MyCourse.RatingSuccess);
							self.curel.attributes.coursescore = coursestar;
							self.curel.attributes.teacherscore = teastar;
							self.curel.attributes.easyscore = easystar;
							var xx = self.curel.clone();
							var coll = self.model.collection;
							coll.remove(self.curel);
							coll.add(xx);

						}
					},
					error:function(){
						bootbox.alert(MyCourse.MyCourse.systemerror);
					}
				})
			},
			mycourse_cancel_btn_handler:function(){
				this.remove();
			}

		});
		return v;
	})
