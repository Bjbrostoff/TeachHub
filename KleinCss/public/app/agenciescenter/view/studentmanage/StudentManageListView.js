define('app/agenciescenter/view/studentmanage/StudentManageListView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/studentmanage/StudentManageListView.ejs',
        'app/agenciescenter/view/studentmanage/StudentManageMoreView',
        'i18n!/nls/achome.js',
    ],
    function(_, Backbone, $,tmpl, StudentManageMoreView,StudentManage){
        var v = Backbone.View.extend({
            events: {
                'click .mystudents-item-course':'MyStudent_ItemCourseHistoryClickHandler',
                'click .mystudents-item-more':'MyStudent_ItemMoreClickHandler',
                'click .agencies-studentmanage-allfind':'StudentManage_AllFindClickHandler'
            },
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.students = options.students;
                this.views = [];
                this.template = _.template(tmpl);
                this.elems = {
                    'studentmanage-container':'.studentmanage-container'
                };
            },
            render:function(datas){
                this.datas = datas;
                var data = datas.toJSON();
                var data1= data;
                var idarry = [];
                var namearry =[];
                data1.forEach(function(value){
                    idarry.push(value['userid']._id);
                    namearry.push(value['userid'].name);
                });
                var resultid = [], resultname = [],hash = {};
                for (var i = 0, elem; (elem = idarry[i]) != null; i++) {
                    if (!hash[elem]) {
                        resultid.push(elem);
                        resultname.push(namearry[i]);
                        hash[elem] = true;
                    }
                }
                var coursename =[[],[]];
                var teachername =[[],[]];
                for(var h=0;h<resultid.length;h++){
                    var count =0;
                    for(var j=0;j<data.length;j++){
                        if(resultid[h] == data[j]['userid']._id){
                            coursename[h][count]=data[j]['courceid'].name;
                            teachername[h][count]=data[j]['teacherid'].name;
                            count++;
                        }
                    }
                }
                this.json = {
                    "reID":resultid,
                    "reName":resultname,
                    "reCourseName":coursename,
                    "reTeacherName":teachername
                };
                $(this.el).html(this.template({
                    students:this.json,
                    locale:StudentManage
                }));


                return this;
            },
            MyStudent_ItemCourseHistoryClickHandler:function(e){
                var StudentId = $(e.currentTarget).attr("data-id");
                var student = this.teachers.findWhere({id: StudentId});
                //0正在授课:1:曾经授课
                var stateType = student.attributes.state.type;
                this.eventBus.trigger('myStudents-showCourseHistoryInfo', StudentId,stateType);
            },
           
            StudentManage_AllFindClickHandler:function(evt){

                if (this.views.studentManageMoreView) this.views.studentManageMoreView.remove();
                if (!this.views.studentManageMoreView) {
                    this.views.studentManageMoreView = new StudentManageMoreView({
                        eventBus: this.eventBus,
                        //model: model
                    });
                }

                var self=this;
                var num =  $(evt.currentTarget).attr("num");
                var data = {
                    "coursename":self.json.reCourseName[num],
                    "teachername":self.json.reTeacherName[num]
                };
                var acstudentManageMoreView = self.views.studentManageMoreView;
                $(self.elems['studentmanage-container']).append(self.views.studentManageMoreView.render(data).el);

                $(document).ready(function(){
                    $(".agenciesstumanage-findmoreview-close").click(function(){
                        acstudentManageMoreView.remove();
                    });
                });
                $(document).ready(function(){
                    $(".studentmanage-nav-tab").click(function(){
                        acstudentManageMoreView.remove();
                    });
                });
            }
        });
        return v;
    })