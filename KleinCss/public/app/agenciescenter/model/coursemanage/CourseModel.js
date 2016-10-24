define('app/agenciescenter/model/coursemanage/CourseModel',
[
    'underscore',
    'backbone',
    'jquery'
],
function(_, Backbone, $){
    var m = Backbone.Model.extend({
        defaults:{

        },
        initialize:function(){
            this.urls = {
                create:'/users/my/createNewCourse',
                commit:'/users/my/commitCourse',
                pub:'/users/my/pubCourse',
                prepare:'/users/my/prepareCourse',
                begin:'/users/my/beginCourse',
                end:'/users/my/endCourse',
                sellout:'/users/my/selloutCourse'
            };
            this.eventNames = {
                createComplete:'manage-course-generate-complete',
                commitComplete:'manage-course--commit-complete',
                pubComplete:'manage-course--pub-complete',
                prepareComplete:'manage-course--prepare-complete',
                beginComplete:'manage-course--begin-complete',
                endComplete:'manage-course--end-complete',
                selloutComplete:'manage-course--sellout-complete'
            }
        },
        verifyAndSave:function(crs){
            this._doAjax({
                url:this.urls.create,
                type:'post',
                data:{
                    data:JSON.stringify(crs)
                },
                eventName:this.eventNames.createComplete
            })
        },
        commitCourse:function(){
            var crsid = this.attributes['_id'];
            if (!crsid) return;
            this._doAjax({
                url:this.urls.commit,
                data:{
                    courseid:crsid
                },
                type:'get',
                eventName:this.eventNames.commitComplete
            });
        },
        pubCourse:function(){
            var crsid = this.attributes['_id'];
            if (!crsid) return;
            this._doAjax({
                url:this.urls.pub,
                data:{
                    courseid:crsid
                },
                type:'get',
                eventName:this.eventNames.pubComplete
            });
        },
        prepareCourse:function(json){
            var crsid = this.attributes['_id'];
            if (!crsid) return;
            this._doAjax({
                url:this.urls.prepare,
                data:{
                    data:JSON.stringify({
                        courseid:crsid,
                        select:json.select,
                        unselect:json.unselect
                    })
                },
                type:'post',
                eventName:this.eventNames.prepareComplete
            });
        },
        beginCourse:function(){
            var crsid = this.attributes['_id'];
            if (!crsid) return;
            this._doAjax({
                url:this.urls.begin,
                data:{
                    courseid:crsid
                },
                type:'get',
                eventName:this.eventNames.beginComplete
            });
        },
        endCourse:function(){
            var crsid = this.attributes['_id'];
            if (!crsid) return;
            this._doAjax({
                url:this.urls.end,
                data:{
                    courseid:crsid
                },
                type:'get',
                eventName:this.eventNames.endComplete
            });
        },
        selloutCourse:function(){
            var crsid = this.attributes['_id'];
            if (!crsid) return;
            this._doAjax({
                url:this.urls.sellout,
                data:{
                    courseid:crsid
                },
                type:'get',
                eventName:this.eventNames.selloutComplete
            });
        },
        _doAjax:function(params){
            var self = this;
            $.ajax({
                url:(params.type=='get')?params['url']+'?datestamp='+new Date().getMilliseconds():params['url'],
                data:params['data'],
                type:params['type'],
                success:function(json){
                    if (json.state == true){
                        self.trigger(params['eventName'], {
                            data:json.data,
                            msg:json.msg,
                            state:true
                        })
                    }else{
                        self.trigger(params['eventName'], {
                            data:null,
                            msg:json.msg,
                            state:false
                        })
                    }

                },
                error:function(err){
                    self.trigger(params['eventName'], {
                        data:null,
                        msg:"网络请求失败",
                        state:false
                    })
                }
            });
        }
    });
    return m;
})
