/**
 * Created by Administrator on 2016/1/30.
 */
define('app/usercenter/model/sthomework/CreateCheckedModel',
    [
        'underscore',
        'jquery',
        'backbone'

    ],
    function(_, $, Backbone){
        var m = Backbone.Model.extend({
            url:'/homework/findcheckedhw',
            initialize:function(){
                //this.urls = {
                //    sthomeworkfindcheckedhw:'/homework/findcheckedhw'
                //};
                //this.eventNames = {
                //    sthomeworkfindcheckedhwcomplete:'sthomework-findcheckedhw-complete'
                //}
            },
            findcheckedhweData:function(data){
                this._doAjax({
                    url:this.urls.sthomeworkfindcheckedhw,
                    type:'post',
                    data:data,
                    eventName:this.eventNames.sthomeworkfindcheckedhwcomplete
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
