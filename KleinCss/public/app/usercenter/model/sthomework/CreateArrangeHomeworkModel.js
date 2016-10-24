/**
 * Created by Administrator on 2016/1/27.
 */
define('app/usercenter/model/sthomework/CreateArrangeHomeworkModel',
    [
        'underscore',
        'jquery',
        'backbone'

    ],
    function(_, $, Backbone){
        var m = Backbone.Model.extend({
            url:'/homework/stharrangeselect',
            initialize:function(){
                this.urls = {
                    release:'/homework/homeworkrelease'
                };
                this.eventNames = {
                    homeworkReleaseComplete:'hw-release-complete'
                }
            },
            arrangeHomeworkRelease:function(data){
                this._doAjax({
                    url:this.urls.release,
                    type:'post',
                    data:data,
                    eventName:this.eventNames.homeworkReleaseComplete
                })
            },
            _doAjax:function(params){
                var self = this;
                console.log(params);
                $.ajax({
                    url:params['url'],
                    data:{
                        data:JSON.stringify(params['data'])
                    },
                    type:params['type'],
                    success:function(json){
                        if (json.state == false){
                            self.trigger(params['eventName'], {
                                state:false,
                                msg:'fail',
                                data:null
                            })
                        }else{
                            self.trigger(params['eventName'], {
                                state:true,
                                msg:'success',
                                data:json.data
                            })
                        }
                    },
                    error:function(error){

                    }
                })
            }
        });
        return m;
    });
