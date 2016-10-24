define('app/usercenter/view/myfavorites/CourseDetailInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myfavorites/CourseDetailInfoView.ejs',
        'i18n!/nls/uchome.js',

        'jquery.validate'
    ],
    function(_, Backbone, $, tmpl,MyFavorites){
        var v = Backbone.View.extend({
            events:{
                'click .btn-close':'closeView_handler'
            },
            initialize:function(options){
                if (options.hasOwnProperty('eventBus')){
                    this.eventBus = options.eventBus;
                }
                this.course = options.course;
                this.template = _.template(tmpl);

                this.elems = {
                    'close':'.btn-close'
                }
            },
            render:function(){
                $(this.el).html(this.template({
                    course:this.course,
                    locale:MyFavorites
                }));
                return this;
            },
            save:function(){

            },
            cancel:function(){

            },
            closeView_handler:function(){
                this.remove();
            }
        });
        return v;
    })
