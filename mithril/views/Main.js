CavemansSPA = (function () {

    console.log('CavemansSPA');

    var domLoaded$ = Rx.Observable.fromEvent(document, 'DOMContentLoaded').take(1);

    // Set 3 second timer for splash screen.
    Rx.Observable.zip(domLoaded$, Rx.Observable.timer(3000)).subscribe(
        {
            next: function (it) {
                console.log(it, 'next')
            },
            error: function () {
                console.log('error')
            },
            complete: function () {
                console.log('CavemansSPA::complete');
                CavemansSPA.onReady()
            }
        }
    )

    return {
        view: {},
        model: {},
        store: {},

        onReady: function () {

            m.mount(document.querySelector('body div.ui.dimmer.modals.page'), CavemansSPA.view.Modal);

            m.route(document.querySelector('body .app-body'), '/login', {
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



