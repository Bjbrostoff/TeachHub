/**
 * Created by xiaoguo on 16/1/8.
 */
define('app/searcht/model/TeacherDetailModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{

                uuid: "id000001",
                name: "",
                sex:"male",
                age:"25",
                nationality: "nationality",
                city: "杭州",
                location:{
                    lng:120.25,
                    lat:30.15
                },
                portrait: "/Inspinia/img/a1.jpg",
                starlevel:"一星级",
                degree:"学位",
                servexerti:[],
                workhistory:[],
                workexp:"",
                "agencyid" : "1ff87522-be9d-4ae2-966b-eb192bc563f1",
                "agencyname" : "广州教育机构99",
                optioninfo:{
                    collegeDegree:{
                        value:'',
                        pub:'1'
                    },
                    currentAgency:{
                        value:'',
                        pub:'1'
                    },
                    almaMater:{
                        value:'',
                        pub:'1'
                    },
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
            },
            url:'/'
        });
        return m;
    })

