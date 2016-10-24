/**
 * Created by cs on 2016/1/30.
 */
define('app/usercenter/model/myfavorites/TeacherModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            //like guo:app/searcht/model/TeacherModel
            defaults:{
                userinfo:{
                },
                custominfo:{
                    starlevel:"一星级",
                    degree:"学位",
                    servexerti:[]
                },
                optioninfo:{
                    mothertongue:{
                        value:'英语',
                        pub:'1'
                    },
                    language:{
                        value:'英语',
                        pub:'1'
                    },
                    skilledcourse:{
                        value:'日常英语',
                        pub:'1'
                    },
                    info:{
                        value:"来吧同学.来吧同学来吧同学来吧同学来吧同学",
                        pub:'1'
                    }
                }
            }
        });
        return m;
    })
