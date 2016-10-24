/**
 * Created by apple on 16/1/8.
 */
define('app/usercenter/view/mycourse/MyCourseOverClassView',
	[
		'underscore',
		'backbone',
		'jquery',
		'text!/app/usercenter/template/mycourse/MyCourseOverClass.ejs',
		'app/usercenter/view/mycourse/TeacherDetailView',
		'app/usercenter/view/mycourse/CourseDetailView',
		'i18n!/nls/uchome.js'

	],
	function(_, Backbone, $, tmpl,TeacherDetailView,CourseDetailView,MyCourse){
		var v = Backbone.View.extend({
			el:this.el,
			events:{
				"click #mycourse_end_mark_course":"mycourse_end_mark_course_handler",
				"click #mycourse_end_mark_teacher":"mycourse_end_mark_teacher_handler"
			},
			initialize:function(option){
				this.template = _.template(tmpl);
				this.elems = {

				};
				this.views = {};
				this.models = {};

			},
			render:function(){

				$(this.el).html(this.template({datas:this.collection.toJSON(),locale:MyCourse}));
				return this;
			},
			hide:function(){
				$(this.el).css({
					'display':'none'
				});
			},
			show:function(){
				$(this.el).css({
					'display':'block'
				});
			},
			_CollectionChange:function(){
				console.log(this.collection)
				this.render();
			},
			addActionListener:function(){
				this.collection.on('change', this._CollectionChange, this);
				this.collection.on('add', this._CollectionChange, this);
				this.collection.on('remove', this._CollectionChange, this);
			},
			mycourse_end_mark_course_handler:function(evt){
				var ucrelid =  $(evt.currentTarget).attr("keyvalue");
				var mm = this.collection.get(ucrelid);
				var courseid = mm.attributes.courceid._id;

				var that = this;
				/*$.ajax({
					"url":"/users/getCourseInfo",
					type:"get",
					data:{"ucrelid":ucrelid,"courseid":courseid},
					success:function(data){*/
						that.showDetailCourseView(mm);
				/*	},error:function(data){
						alert("系统错误;")
					}
				})*/
			},
			showDetailCourseView:function(data){

				if(this.views.detailCourseView){
					this.views.detailCourseView.remove();
				}
				this.views.detailCourseView = new CourseDetailView({
					model:data

				})
				$(this.el).append(this.views.detailCourseView.render().el);
				this.views.detailCourseView.mycousrstar_mouse_out();
				this.views.detailCourseView.myeasystar_mouse_out();
				this.views.detailCourseView.myteastar_mouse_out();
			},
			showDetailTeacherView:function(data){
				if(this.views.detailTeacherView){
					this.views.detailTeacherView.remove();
				}
				this.views.detailTeacherView = new TeacherDetailView({
					model:data
				});
				$(this.el).append(this.views.detailTeacherView.render(data).el);

			}
			,
			mycourse_end_mark_teacher_handler:function(evt){
				var ucrelid =  $(evt.currentTarget).attr("keyvalue");
				var mm = this.collection.get(ucrelid);
				var teacher = mm.attributes.teacherid;
				if(teacher == undefined){
					return;
				}
				var teacherid = mm.attributes.teacherid._id;
				var that = this;
				$.ajax({
					"url":"/users/getTeacherInfo",
					type:"get",
					data:{"ucrelid":ucrelid,"teacherid":teacherid},
					success:function(data){
						that.showDetailTeacherView(data);
					},error:function(data){
						alert(MyCourse.MyCourse.systemerror)
					}
				})

			}


		});
		return v;
	});
