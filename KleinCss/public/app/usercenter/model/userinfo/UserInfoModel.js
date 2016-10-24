define('app/usercenter/model/userinfo/UserInfoModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            initialize:function(){
                this.urls = {
                    updateCode:'/users/updateUserPassword'
                };
                this.eventNames = {
                    updateCodeComplete:'baseinfo-saveCode-complete'
                }

            },
            saveCodeChanges:function(data){
                this._doAjax({
                    url:this.urls.updateCode,
                    type:'post',
                    data:data,
                    eventName:this.eventNames.updateCodeComplete
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
