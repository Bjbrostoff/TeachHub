/**
 * 机构选择
 * Created by cs on 2016/3/9.
 */
define('app/usercenter/view/coursemanage/AgencyChooseView',
    [
        'underscore',
        'backbone',
        'jquery',

        'text!/app/usercenter/template/coursemanage/AgencyChooseView.ejs',
        'app/usercenter/collection/coursemanage/AgencyCollection',
        'app/usercenter/view/coursemanage/AgencyListView',
        'app/usercenter/view/coursemanage/AgencyPaginationView',
        'app/usercenter/view/coursemanage/GenerateMsgModalView',
        'i18n!/nls/uchome.js',
        'sweetalert'
    ],
    function (_, Backbone, $, tmpl, AgencyCollection, AgencyListView, AgencyPaginationView,GenerateMsgModalView,
              localName) {
        var v = Backbone.View.extend({
            events: {
                'click .course-manage-agency-choose-close':'closeView_handler',
                'click .course-manage-agency-choose-cancel':'closeView_handler',
                'click .course-manage-agency-choose-confirm':'agencyConfirm_handler'
            },
            els: {
                pagination: '#agency-pagination',
                list: '#agency-list',
                'openDialog':'#course-manage-open-dialog'
            },
            eventNames:{
                chooseAgencyComplete: 'course-manager-choose-agency-complete',
                chooseAgencyPagination:'course-manager-agency-choose-pagination'
            },

            initialize: function (options) {
                this.eventBus = options.eventBus;
                this.courseid = options.courseid;
                this.teacherid = options.teacherid;
                this.limit = 10;
                this.page = 0;
                this.template = _.template(tmpl);
                this.collection = new AgencyCollection();
                this.views = {};
                this.eventBus.on(this.eventNames.chooseAgencyPagination, this.pagination, this);
            },
            render: function () {
                this.$el.html(this.template({
                    local:localName
                }));
                this.showAgencyListView(0);
                return this;
            },
            closeView_handler:function(){
                this.remove();
            },
            agencyConfirm_handler:function(){
                var selectAgency = $("[name='agencyRadios']").filter(":checked");
                if (selectAgency.length > 0) {
                    this.eventBus.trigger(this.eventNames.chooseAgencyComplete, {
                        courseid:this.courseid,
                        teacherid:this.teacherid,
                        agencyid:selectAgency.attr("data-agency-id")
                    });
                } else {
                   // swal({
                    var title= localName.CourseManage.chooseOneAgency;
                    if (!this.views.generateMsgModalView) {
                        this.views.generateMsgModalView = new GenerateMsgModalView({
                        });
                    }
                    $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));
                    //})
                }
            },
            pagination: function (pageNum) {
                this.showAgencyListView(pageNum);
            },
            showAgencyListView: function (pageNum) {
                this.page = parseInt(pageNum);
                var self = this;
                this.collection.fetch({
                    data: $.param({
                        courseid: this.courseid,
                        teacherid: this.teacherid,
                        limit: this.limit,
                        page: pageNum
                    })
                }).complete(function () {
                    var data = self.collection.toJSON();
                    var agencyListView = new AgencyListView({
                        agencies: data[0]
                    });
                    $(self.els.list).html(agencyListView.render().el);

                    self.total = data[0].total;
                    var agencyPaginationView = new AgencyPaginationView({
                        totalPage: self.total % self.limit > 0 ? self.total / self.limit + 1 : self.total / self.limit,
                        page: self.page,
                        eventBus: self.eventBus
                    });
                    $(self.els.pagination).html(agencyPaginationView.render().el);
                });
            }

        });
        return v;
    })