/**
 * Created by xiaoguo on 16/1/8.
 */
define('app/agencies/model/AgenciesDetailModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{

                uuid: "id000001",
                name: "张三",
                city: "杭州",
                phone:"123456789",
                image: '/Inspinia/img/gallery/11s.jpg',
                starlevel:"一星级",
                location:{
                    lng:120.25,
                    lat:30.15
                },
                introduction:'',
                legalname:"",
                coursecount:0,
                teachercount:0,
                servexerti:[]
            },
            url:'/',
            initialize:function(){
                this.urls = {
                    'joinAgency':'/agencies/my/joinAgency'
                };
                this.eventNames = {
                    'jionAgencyComplete':'join-agency-complete'
                }
            },
            joinAgency:function(){
                var data = {
                    agencyid:this.attributes['uuid']
                }
                this._doAjax({
                    url:this.urls.joinAgency,
                    data:data,
                    type:'get',
                    eventName:this.eventNames.jionAgencyComplete
                })
            },
            _doAjax:function(params){
                var self = this;
                $.ajax({
                    url:params.url,
                    data:params.data,
                    type:params.type,
                    success:function(json){
                        console.log(json);
                        self.trigger(params.eventName, json);
                    },
                    error:function(){
                        self.trigger(params.eventName, {
                            state:false,
                            msg:'操作失败',
                            data:null
                        });
                    }
                })
            }
        });
        return m;
    })

