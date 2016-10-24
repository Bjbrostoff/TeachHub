define('app/agenciescenter/model/AgenciesFormModel',
    [
        'underscore',
        'jquery',
        'backbone'

    ],
    function(_, $, Backbone){
        var m = Backbone.Model.extend({
            url:'/agencies/basicinfo',
            initialize:function(){
                this.urls = {
                    update:'/agencies/updateAgenciesInfo'
                };
                this.eventNames = {
                    updateComplete:'agenciesinfo-save-complete'
                }
            },
            saveChanges:function(data){
                this._doAjax({
                    url:this.urls.update,
                    type:'post',
                    data:data,
                    eventName:this.eventNames.updateComplete
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
