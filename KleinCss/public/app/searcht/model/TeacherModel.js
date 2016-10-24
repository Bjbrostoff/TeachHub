define('app/searcht/model/TeacherModel',
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
                nationality: "nationality",
                city: "杭州",
                portrait: "/Inspinia/img/a1.jpg",
                starlevel:"一星级",
                degree:"学位",
                location:{
                    lng:120.25,
                    lat:30.15
                },
                servexerti:[],
                "agencyid" : "1ff87522-be9d-4ae2-966b-eb192bc563f1",
                "agencyname" : "广州教育机构99",
                "workexp":'',
                "currentagency":'',
                "mothertongue":'',
                "almaMater":'',
                "collegeDegree":'',
                "skilledcourse":'',
                "info":'',
                optioninfo:[
                    {
                        cate:'教学资历',
                        value:'',
                        pub:'1'
                    },
                    {
                        cate:'所属机构',
                        value:'',
                        pub:'1'
                    },
                    {
                        cate:'母语',
                        value:'',
                        pub:'1'
                    },
                    {
                        cate:'母校',
                        value:'',
                        pub:'1'
                    },
                    {
                        cate:'学位',
                        value:'',
                        pub:'1'
                    },
                    {
                        cate:'擅长课程',
                        value:'',
                        pub:'0'
                    },
                    {
                        cate:'个人宣言',
                        value:'',
                        pub:'0'
                    }

                ]
            },
            url:'/'
        });
        return m;
    })
