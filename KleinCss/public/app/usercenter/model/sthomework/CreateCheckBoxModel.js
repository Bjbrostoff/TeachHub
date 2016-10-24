/**
 * Created by Administrator on 2016/1/29.
 */
define('app/usercenter/model/sthomework/CreateCheckBoxModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
          // url:'/homework/findstucommithw',
            initialize:function(){
                this.urls = {
                    markingHomework:'/homework/markingHomework'
                };
                this.eventNames = {
                    markingHomeworkComplete:'sthomework-markingHomework-complete'
                }

            },
            markingHomeworkSaveData:function(data){
                this._doAjax({
                    url:this.urls.markingHomework,
                    type:'post',
                    data:data,
                    eventName:this.eventNames.markingHomeworkComplete
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
                                msg:'fail'
                            })
                        }else{
                            self.trigger(params['eventName'], {
                                state:true,
                                msg:'success'
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
