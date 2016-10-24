define('app/agenciescenter/view/CourseManageView',
    [
        'underscore',
        'backbone',
        'jquery',

        'text!/app/agenciescenter/template/CourseManageView.ejs',

        'app/agenciescenter/collection/coursemanage/CourseCollection',
        'app/agenciescenter/model/coursemanage/CourseModel',

        'app/agenciescenter/view/coursemanage/CourseListView',
        'app/agenciescenter/view/coursemanage/CreateCourseView',

        'app/agenciescenter/view/coursemanage/CourseDetailView',

        'app/agenciescenter/view/coursemanage/SelectStudentsView',
        'i18n!/nls/achome.js',

        'sweetalert'


    ],
    function(_, Backbone, $,
             tmpl,
             CourseCollection, CourseModel,
             CourseListView, CreateCourseView, CourseDetailView, SelectStudentsView,CourseManage){
        var v = Backbone.View.extend({
            el:'.course-manage-container',
            events:{
                'click li.course-manage-nav-tab':'courseManageNavTabChangeHandler',
                'click #course-manage-generate-course':'createNewCourse_handler'
            },
            initialize:function(option){
                this.eventBus = option.eventBus || {};
                this.loginUserId = option.loginUserId || '';

                this.els = {
                    'actCourses':'#course-manage-act-tab',
                    'pubCourses':'#course-manage-pub-tab',
                    'selloutCourses':'#course-manage-sellout-tab',
                    'newCourses':'#course-manage-new-tab',
                    'allCourses':'#course-manage-all-tab',
                    'chart':'course-manage-chart',
                    'chartLegend':'#course-manage-chart-legend',
                    'createCourse':'course-manage-generate'
                };

                this.eventNames = {
                    'detail':'course-manage-detail-btn-did-click',
                    'pub':'course-manage-pub-btn-did-click',
                    'sellout':'course-manage-sellout-btn-did-click',
                    'prepare':'course-manage-prepare-btn-did-click',
                    'begin':'course-manage-begin-btn-did-click',
                    'end':'course-manage-end-btn-did-click',
                    'push':'course-manage-push-btn-did-click',
                    'emitCourseMsg':'global-msg',
                    'generateCourseComplete':'manage-course-generate-complete',
                    commitComplete:'manage-course--commit-complete',
                    pubComplete:'manage-course--pub-complete',
                    prepareComplete:'manage-course--prepare-complete',
                    beginComplete:'manage-course--begin-complete',
                    endComplete:'manage-course--end-complete',
                    selloutComplete:'manage-course--sellout-complete',
                    selectStudentConfirm:'course-manage-select-students-confirm'
                };

                this.urls = {
                    myAct:'/users/myActCourses',
                    myPub:'/users/myPubCourses',
                    mySellout:'/users/mySelloutCourses',
                    myNew:'/users/myNewCourses',
                    myAll:'/users/myAllCourses'
                }

                this.models = {

                };

                this.template = _.template(tmpl);

                this.views = {

                };

                this.models.actCourseCollection = new CourseCollection({
                    url:this.urls.myAct
                });
                this.models.pubCourseCollection = new CourseCollection({
                    url:this.urls.myPub
                });
                this.models.selloutCourseCollection = new CourseCollection({
                    url:this.urls.mySellout
                });
                this.models.newCoursesCollection = new CourseCollection({
                    url:this.urls.myNew
                });
                this.models.allCoursesCollection = new CourseCollection({
                    url:this.urls.myAll
                });
                //this.models.actCourseCollection.on('reset', this.actCourses_dataChange, this);

            },
            render:function(){
                var chartData = {
                    data:[
                        {label: CourseManage.Undisclosed, value: 20 },
                        { label: CourseManage.Offtheshelf, value: 20 },
                        { label: CourseManage.Published, value: 30 },
                        { label: CourseManage.processing, value: 12 }

                    ],
                    colors:[
                        '#87d6c6', '#54cdb4','#1ab394','#1ab6ff'
                    ]
                };
                $(this.el).html(this.template({chartData:chartData}));
                this.morrisChart(chartData);
                return this;
            },
            hide:function(){
                this._hide();
            },
            show:function(){
                this._show();
            },
            morrisChart:function(chartData){
                Morris.Donut({
                    element: this.els.chart,
                    data: chartData.data,
                    resize: true,
                    colors:chartData.colors
                });
            },
            createNewCourse_handler:function(){
                if (this.views.createCourseView) this.views.createCourseView.remove();

                this.views.createCourseView = new CreateCourseView({
                    userid:'a'
                });
                this.views.createCourseView.on(this.eventNames.generateCourseComplete, this._generateNewCourse, this);
                $(this.el).append(this.views.createCourseView.render().el);
                this.views.createCourseView.setValidate();

            },
            showActCourses:function(){//进行中
                if (!this.views.actCourseTabView){
                    this.views.actCourseTabView = new CourseListView({
                        eventBus:this.eventBus,
                        el:this.els.actCourses,
                        collection:this.models.actCourseCollection,
                        selectlv:2
                    });
                    this.views.actCourseTabView.on(this.eventNames.detail, this._detailCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.end, this._endCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.sellout, this._selloutCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.pub, this._pubCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.begin, this._beginCourse, this);

                    var self = this;
                    this.models.actCourseCollection.fetch({
                        data:{
                            select:2
                        }
                    }).complete(function(){
                        $(self.els.actCourses).append(self.views.actCourseTabView.render().el);
                        self.views.actCourseTabView.activeListener();
                    });
                }


            },
            showPubCourses:function(){//已发布
                if (!this.views.pubCourseTabView){
                    this.views.pubCourseTabView = new CourseListView({
                        eventBus:this.eventBus,
                        el:this.els.pubCourses,
                        collection:this.models.pubCourseCollection,
                        selectlv:1
                    });

                    this.views.pubCourseTabView.on(this.eventNames.prepare, this._prepareCourse, this);
                    this.views.pubCourseTabView.on(this.eventNames.sellout, this._selloutCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.detail, this._detailCourse, this);

                    var self = this;
                    this.models.pubCourseCollection.fetch({
                        data:{
                            select:1
                        }
                    }).complete(function(){
                        $(self.els.pubCourses).append(self.views.pubCourseTabView.render().el);
                        self.views.pubCourseTabView.activeListener();
                    });
                }


            },
            showSelloutCourses:function(){//已下架
                if (!this.views.sellOutCourseTabView){
                    this.views.sellOutCourseTabView = new CourseListView({
                        eventBus:this.eventBus,
                        el:this.els.selloutCourses,
                        collection:this.models.selloutCourseCollection,
                        selectlv:3
                    });

                    this.views.sellOutCourseTabView.on(this.eventNames.pub, this._pubCourse, this);
                    this.views.sellOutCourseTabView.on(this.eventNames.detail, this._detailCourse, this);

                    var self = this;
                    this.models.selloutCourseCollection.fetch({
                        data:{
                            select:3
                        }
                    }).complete(function(){
                        $(self.els.selloutCourses).append(self.views.sellOutCourseTabView.render().el);
                        self.views.sellOutCourseTabView.activeListener();
                    });
                }


            },
            showNewCourses:function(){//未发布
                if (!this.views.newCourseTabView){
                    this.views.newCourseTabView = new CourseListView({
                        eventBus:this.eventBus,
                        el:this.els.newCourses,
                        collection:this.models.newCoursesCollection,
                        selectlv:0
                    });
                    this.views.newCourseTabView.on(this.eventNames.pub, this._pubCourse, this);
                    this.views.newCourseTabView.on(this.eventNames.detail, this._detailCourse, this);
                    this.views.newCourseTabView.on(this.eventNames.push, this._pushCourse, this);

                    var self = this;
                    this.models.newCoursesCollection.fetch({
                        data:{
                            select:0
                        }
                    }).complete(function(){
                        $(self.els.newCourses).append(self.views.newCourseTabView.render().el);
                        self.views.newCourseTabView.activeListener();
                    });
                }


            },
            showAllCourses:function(){
                if (!this.views.allCourseTabView){
                    this.views.allCourseTabView = new CourseListView({
                        eventBus:this.eventBus,
                        el:this.els.allCourses,
                        collection:this.models.allCoursesCollection,
                        selectlv:-1
                    });

                    this.views.newCourseTabView.on(this.eventNames.detail, this._detailCourse, this);

                    var self = this;
                    this.models.allCoursesCollection.fetch().complete(function(){
                        $(self.els.allCourses).append(self.views.allCourseTabView.render().el);
                        self.views.allCourseTabView.activeListener();
                    });
                }


            },
            courseManageNavTabChangeHandler:function(evt){
                var dataBind = $(evt.currentTarget).attr('data-bind');
                switch (dataBind) {
                    case 'act':
                        this.showActCourses();
                        break;
                    case 'pub':
                        this.showPubCourses();
                        break;
                    case 'sellout':
                        this.showSelloutCourses();
                        break;
                    case 'new':
                        this.showNewCourses();
                        break;
                    case 'all':
                        this.showAllCourses();
                        break;
                    default:

                }
            },
            actCourses_dataChange:function(){
                $(this.els.actCourses).append(this.views.actCourseTabView.render().el);
            },
            _hide:function(){
                $(this.el).css({
                    'display':'none'
                });
            },
            _show:function(){
                $(this.el).css({
                    'display':'block'
                });
            },
            _detailCourse:function(data){
                console.log(data.item.toJSON());
                var detail = new CourseDetailView({
                    model:data.item
                });
                this.$el.append(detail.render().el);
            },
            _pubCourse:function(data){
                this.pubSelState = data.select;
                switch (data.select){
                    case 0:
                        if (data.item.get('statelv').type == 3){
                            this.pubModel = new CourseModel();
                            this.pubModel.set(data.item.toJSON());
                            this.pubModel.on(this.eventNames.pubComplete, this._pubCourseComplete, this);
                            this.pubModel.pubCourse();

                        }else{

                        }
                        break;
                    case 2:
                        if (data.item.get('statelv').type == 2){
                            this.pubModel = new CourseModel();
                            this.pubModel.set(data.item.toJSON());
                            this.pubModel.on(this.eventNames.pubComplete, this._pubCourseComplete, this);
                            this.pubModel.pubCourse();
                        }
                        break;
                    case 3:
                        this.pubModel = new CourseModel();
                        this.pubModel.set(data.item.toJSON());
                        this.pubModel.on(this.eventNames.pubComplete, this._pubCourseComplete, this);
                        this.pubModel.pubCourse();

                        break;
                }
            },
            _selloutCourse:function(data){
                this.selloutSelState = data.select;
                switch (data.select){
                    case 1:
                        if (data.item.get('statelv').type == 0){
                            this.selloutModel = new CourseModel();
                            this.selloutModel.set(data.item.toJSON());
                            this.selloutModel.on(this.eventNames.selloutComplete, this._selloutCourseComplete, this);
                            this.selloutModel.selloutCourse();
                        }else if (data.item.get('statelv').type == 1){

                        }

                        break;
                    case 2:
                        if (data.item.get('statelv').type == 2){
                            this.selloutModel = new CourseModel();
                            this.selloutModel.set(data.item.toJSON());
                            this.selloutModel.on(this.eventNames.selloutComplete, this._selloutCourseComplete, this);
                            this.selloutModel.selloutCourse();
                        }else{

                        }
                        break;
                }
            },
            _prepareCourse:function(data){
                this.prepareSelect = data;
                this.showSelectStudentPanel();
                return;
            },
            _beginCourse:function(data){
                console.log(data);
                switch (data.select){
                    case 2:
                        if (data.item.get('statelv').type == 0){
                            this.beginModel = new CourseModel();
                            this.beginModel.set(data.item.toJSON());
                            this.beginModel.on(this.eventNames.beginComplete, this._beginCourseComplete, this);
                            this.beginModel.beginCourse();

                        }else{

                        }
                        break;
                }
            },
            _endCourse:function(data){
                switch (data.select){
                    case 2:
                        if (data.item.get('statelv').type == 1){
                            this.endModel = new CourseModel();
                            this.endModel.set(data.item.toJSON());
                            this.endModel.on(this.eventNames.endComplete, this._endCourseComplete, this);
                            this.endModel.endCourse();
                        }

                        break;
                }
            },
            _generateNewCourse:function(json){
                if (!json.state) return;
                var model = new CourseModel();
                model.set(json.data);
                this.models.newCoursesCollection.add(model, {
                    at:0
                });

                var msg = '创建了新的课程 ['+model.get('name')+']';
                this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                    msg:{
                        info:msg,
                        time:this._formatDate(new Date())
                    }
                });
            },
            _pushCourse:function(data){
                switch (data.select){
                    case 0:
                        if (data.item.get('statelv').type == 0){
                            this.pushModel = new CourseModel();
                            this.pushModel.set(data.item.toJSON());
                            this.pushModel.on(this.eventNames.commitComplete, this._pushCourseComplete, this);
                            this.pushModel.commitCourse();
                        }else{

                        }
                        break;
                }
            },
            _pushCourseComplete:function(json){
                if (json.state == false){
                    swal({
                        title:'操作失败!'
                    });
                }else if (json.state == true){
                    this.views.newCourseTabView.currentItem = null;

                    var msg = '课程 ['+json.data.name+'] 更改为 '+'[等待审核] 状态';

                    this.models.newCoursesCollection.get(json.data._id).set(json.data);

                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg:{
                            info:msg,
                            time:this._formatDate(new Date())
                        }
                    });

                    swal({
                        title:msg
                    });

                }
            },
            _pubCourseComplete:function(json){
                if (json.state){
                    switch(this.pubSelState){
                        case 0:
                            this.models.newCoursesCollection.remove(json.data._id);
                            this.views.newCourseTabView.currentItem = null;
                            break;
                        case 2:
                            this.models.actCourseCollection.remove(json.data._id);
                            this.views.actCourseTabView.currentItem = null;
                            break;
                        case 3:
                            this.models.selloutCourseCollection.remove(json.data._id);
                            this.views.sellOutCourseTabView.currentItem = null;
                            break;
                    }


                    var model = new CourseModel(json.data);

                    this.models.pubCourseCollection.add(model, {at:0});


                    var msg = '课程 ['+json.data.name+'] 更改为 '+'[发布] 状态';
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg:{
                            info:msg,
                            time:this._formatDate(new Date())
                        }
                    });
                    swal({
                        title:msg
                    })
                }else{
                    swal({
                        title:'操作失败!'
                    })
                }
            },
            _prepareCourseComplete:function(json){
                if (json.state){
                    this.models.pubCourseCollection.remove(json.data._id);
                    this.models.actCourseCollection.add(new CourseModel(json.data), {
                        at:0
                    });
                    this.views.pubCourseTabView.currentItem = null;

                    var msg = '课程 ['+json.data.name+'] 更改为 '+'[准备开课] 状态';
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg:{
                            info:msg,
                            time:this._formatDate(new Date())
                        }
                    });

                    if (this.selStuView){
                        this.selStuView.remove();
                    }

                    swal({
                        title:msg
                    });
                }else{
                    swal({
                        title:'操作失败!'
                    });
                }

            },
            _beginCourseComplete:function(json){
                if (json.state){

                    this.models.actCourseCollection.get(json.data._id).set(json.data);

                    this.views.actCourseTabView.currentItem = null;

                    var msg = '课程 ['+json.data.name+'] 更改为 '+'[进行中] 状态';
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg:{
                            info:msg,
                            time:this._formatDate(new Date())
                        }
                    });

                    swal({
                        title:msg
                    })
                }else{
                    swal({
                        title:'操作失败!'
                    });
                }
            },
            _endCourseComplete:function(json){
                if (json.state){
                    this.models.actCourseCollection.get(json.data._id).set(json.data);

                    this.views.actCourseTabView.currentItem = null;

                    var msg = '课程 ['+json.data.name+'] 更改为 '+'[结束] 状态';
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg:{
                            info:msg,
                            time:this._formatDate(new Date())
                        }
                    });

                    swal({
                        title:msg
                    });
                }else{
                    swal({
                        title:'操作失败!'
                    });
                }
            },
            _selloutCourseComplete:function(json){
                if (json.state){
                    switch(this.selloutSelState){
                        case 1:
                            this.models.pubCourseCollection.remove(json.data._id);
                            break;
                        case 2:
                            this.models.actCourseCollection.remove(json.data._id);
                            break;
                    }

                    this.models.selloutCourseCollection.add(new CourseModel(json.data), {
                        at:0
                    });
                    this.views.actCourseTabView.currentItem = null;

                    var msg = '课程 ['+json.data.name+'] 更改为 '+'[下架] 状态';
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg:{
                            info:msg,
                            time:this._formatDate(new Date())
                        }
                    });

                    swal({
                        title:msg
                    })
                }else{
                    swal({
                        title:'操作失败!'
                    })
                }
            },
            _formatDate:function(myDate){
                var fmt = '';        //获取当前年份(2位)
                fmt = fmt+myDate.getFullYear();    //获取完整的年份(4位,1970-????)
                fmt = fmt+'-'+(myDate.getMonth()+1);       //获取当前月份(0-11,0代表1月)
                fmt = fmt+'-'+myDate.getDate();        //获取当前日(1-31)
                fmt = fmt+' '+myDate.getHours();       //获取当前小时数(0-23)
                fmt = fmt+':'+myDate.getMinutes();     //获取当前分钟数(0-59)

                return fmt;
            },
            showSelectStudentPanel:function(){
                var selStuView = new SelectStudentsView();
                this.selStuView = selStuView;
                $(this.el).append(selStuView.render().el);
                selStuView.on(this.eventNames.selectStudentConfirm, this._selectStudentConfirm, this);
                selStuView.fetchSignedStudents(this.prepareSelect.item.get('_id'));
            },
            _selectStudentConfirm:function(json){
                switch (this.prepareSelect.select){
                    case 1:
                        if (this.prepareSelect.item.get('statelv').type == 0){
                            this.prepareModel = new CourseModel();
                            this.prepareModel.set(this.prepareSelect.item.toJSON());
                            this.prepareModel.on(this.eventNames.prepareComplete, this._prepareCourseComplete, this);
                            this.prepareModel.prepareCourse(json.data);

                        }else{

                        }
                        break;
                }
            }
        });
        return v;
    })
