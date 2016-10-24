define('app/usercenter/view/coursemanage/SelectStudentsView',
[
    'jquery',
    'underscore',
    'backbone',
    'text!/app/usercenter/template/coursemanage/SelectStudentsView.ejs',
    'app/usercenter/collection/coursemanage/StudentCollection',
    'i18n!/nls/uchome.js'
],
function($, _, Backbone, tmpl,
    StudentCollection,localName){
        var v = Backbone.View.extend({
            events:{
                'click .course-manage-select-student-close':'close',
                'click .course-manage-select-student-confirm':'confirm',
                'click .course-manage-select-student-cancel':'cancel'
            },
            initialize:function(){
                this.template = _.template(tmpl);
                this.collection = new StudentCollection();

                this.eventNames = {
                    confirm:'course-manage-select-students-confirm',
                    fetchSignedComplete:'course-manage-select-student-fetch-signed-complete'
                };

                this.elems = {
                    ckb:'.course-manage-select-student-ckb'
                };

                this.collection.on('change', this.collection_changeHandler, this);
                this.collection.on('add', this.collection_addHandler, this);
                this.collection.on(this.eventNames.fetchSignedComplete, this._fethSignedComplete, this);
            },
            render:function(){
                $(this.el).html(this.template({
                    data:this.collection.toJSON(),
                    local:localName
                }));

                return this;
            },
            fetchSignedStudents:function(crsid){
                this.collection.fetchSignedStudents(crsid);
            },
            collection_changeHandler:function(){
                this.render();
            },
            collection_addHandler:function(){
                this.render();
            },
            close:function(){
                this.remove();
            },
            confirm:function(){
                var select = [];
                var unselect = [];
                $(this.elems.ckb).each(function(){
                    if ($(this).is(':checked')){
                        var code = $(this).attr('dataid');
                        select.push({
                            code:code
                        });
                    }else{
                        var code = $(this).attr('dataid');
                        unselect.push({
                            code:code
                        });
                    }
                });
                if (select.length == 0){
                    swal({
                        title:localName.CourseManage.chooseStudent.current
                    });
                }else{
                    this.trigger(this.eventNames.confirm, {data:{
                        select:select,
                        unselect:unselect
                    }});
                }

            },
            cancel:function(){
                this.remove();
            },
            _fethSignedComplete:function(json){
                this.collection.set(json.data);
            }
        });
        return v;
})
