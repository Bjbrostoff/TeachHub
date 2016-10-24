define('app/usercenter/collection/coursemanage/StudentCollection',
[
    'jquery',
    'underscore',
    'backbone',

    'app/usercenter/model/coursemanage/StudentModel',
    'i18n!/nls/uchome.js'
],
function($, _, Backbone, Model,localName){
    var c = Backbone.Collection.extend({
        model:Model,
        initialize:function(){
            this.urls = {
                'fetchSigned':'/users/my/courseSigned'
            };
            this.eventNames = {
                'fetchSignedComplete':'course-manage-select-student-fetch-signed-complete'
            }
        },
        fetchSignedStudents:function(crsid){
            this._doAjax({
                url:this.urls.fetchSigned,
                data:{
                    courseid:crsid
                },
                type:'get',
                eventName:this.eventNames.fetchSignedComplete
            });
        },
        _doAjax:function(params){
            var self = this;
            $.ajax({
                url:params['url'],
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
                        msg:localName.netError,
                        state:false
                    })
                }
            });
        }
    });

    return c;
})
