CavemansSPA = (function () {

    console.log('Constructing CavemansSPA');

    return {
        view: {},
        model: {},
        store: {},

        onReady: function () {

            m.mount(document.querySelector('body div.ui.dimmer.modals.page'), CavemansSPA.view.Modal);

            m.route(document.querySelector('body .cavemansspa-app-body'), '/login', {
                '/login': CavemansSPA.view.Page(CavemansSPA.view.Login, {
                    pageArgs: {
                        class: 'cavemansspa-page-login',
                        key: 'login'
                    },
                    componentArgs: {
                        foo: 'bar',
                        key: 'login-component'
                    }
                }),
                '/settings': CavemansSPA.view.Page(CavemansSPA.view.Settings, {
                    pageArgs: {
                        class: 'cavemansspa-page-settings',
                        key: 'settings'
                    }
                }),
                '/settings2': CavemansSPA.view.Page(CavemansSPA.view.Settings, {
                    pageArgs: {
                        class: 'cavemansspa-page-settings',
                        style: {
                            backgroundColor: 'green'
                        },
                        key: 'settings2'
                    },
                    componentArgs: {
                        style: {
                            backgroundColor: 'antiquewhite'
                        },
                        showNext: false
                    }
                })
            });
        }
    }

})();



