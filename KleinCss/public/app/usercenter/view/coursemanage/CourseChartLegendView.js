/**
 * Created by cs on 2016/3/7.
 */
define('app/usercenter/view/coursemanage/CourseChartLegendView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/coursemanage/CourseChartLegendView.ejs'
    ],
    function(_, Backbone, $, tmpl){
        var v = Backbone.View.extend({
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.template = _.template(tmpl);
                this.datas = options.datas;
                this.colors = options.colors;
            }
            ,render:function(){
                $(this.el).html(this.template({
                    datas:this.datas,
                    colors:this.colors,
                }));
                return this;
            }
        });
        return v;
    })