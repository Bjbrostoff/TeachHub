/**
 * Created by Administrator on 2016/1/6.
 */
define('app/usercenter/view/stuhome/DetailInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/stuhome/DetailInfo.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,local){
        var v = Backbone.View.extend({
            initialize:function(option){
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.fieldArr1 = ['name', 'info','introduction','catalog','price'];
                this.fieldArr2=local.Home.fieldArr2;
                //this.fieldArr2=['课程名称','课程详情','课程简介','课程大纲','课程价格','授课方式','授课模式','面向群体年龄','上课地点','上课时间'];

            },
            render:function(data){
                $(this.el).html(this.template({
                    data:data,
                    fieldNext:this.fieldArr1,
                    fieldPre:this.fieldArr2,
                    local:local.Home.courseDetail
                }));
                return this;
            }
        });
        return v;
    })