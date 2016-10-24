/**
 * Created by apple on 16/4/4.
 */
define('app/usercenter/view/StudentScoreView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/StudentScoreView.ejs',
        'pdfmake',
        'vfs_fonts',

        'i18n!/nls/uchome.js'
    ],
    function (_, Backbone, $,
              tmpl,
              localName) {
        var v = Backbone.View.extend({
            el: '.mystudent-score',
            events: {
                'click #student-score-pdf':'studentscorepdf',
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.els = {

                };
                this.models = {};
                this.views = {};
                this.models = {

                };
                this.template = _.template(tmpl);
            },
            render: function () {
                $(this.el).html(this.template({}));

                this._refreshBindElem();

                this.pdfGenerator();
                return this;

            },
            studentscorepdf:function(){
                var docDefinition = {
                    footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
                    header: function(currentPage, pageCount) {
                        // you can apply any logic and return any valid pdfmake element

                        return { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' };
                    },
                    //header: 'student score list ',
                    //
                    //footer: {
                    //    columns: [
                    //        'Left part',
                    //        { text: 'Right part', alignment: 'right' }
                    //    ]
                    //},
                    info: {
                        title: 'my score list',
                        author: 'sun',
                        subject: 'subject of document',
                        keywords: 'keywords for document',
                    },
                    content: [
                        {
                            table: {
                                // headers are automatically repeated if the table spans over multiple pages
                                // you can declare how many rows should be treated as headers
                                headerRows: 1,
                                widths: [ '*', 'auto', 100, '*' ],

                                body: [
                                    [ 'First', 'Second', 'Third', 'The last one' ],
                                    [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                                    [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
                                ]
                            }
                        }
                    ],

                    styles: {
                        header: {
                            fontSize: 22,
                            bold: true
                        },
                        anotherStyle: {
                            italics: true,
                            alignment: 'right'
                        }
                    }
                };
                // open the PDF in a new window
                pdfMake.createPdf(docDefinition).open();
                pdfMake.createPdf(docDefinition).download();
            },
            pdfGenerator:function(){


            },
            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            _refreshBindElem: function () {
                this.elems = {
                    'dom': $('.page-content-home')
                }
            },
            _hide: function () {
                $(this.el).css({
                    'display': 'none'
                })
            },
            _show: function () {
                $(this.el).css({
                    'display': 'block'
                });
            }

        });
        return v;
    })