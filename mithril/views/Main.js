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

        navigation: {
            history: [],
            direction: 'next',
            pageInClass: function () {
                return (this.direction === 'next' ? 'slideInRight' : 'slideInLeft')
            },
            pageOutClass: function () {
                return (this.direction === 'next' ? 'slideOutLeft' : 'slideOutRight')
            },
            lastPage: null,
            removeClasses: function (vnode, className) {
                return function (e) {
                    console.log('CavemansSPA.view.Page::removeClasses()', vnode);
                    vnode.dom.classList.remove('cavemansspa-page-new', 'animated', className);
                    e.target.removeEventListener(e.type, arguments.callee);
                }
            },
            doTransition: function (vnode, args) {
                var lastPageHistory = _.nth(CavemansSPA.navigation.history, -2);
                //debugger;
                if (lastPageHistory === args.key) {
                    CavemansSPA.navigation.history.pop();
                    CavemansSPA.navigation.direction = 'prev';
                } else {
                    CavemansSPA.navigation.direction = 'next';
                    CavemansSPA.navigation.history.push(args.key);
                }
                vnode.dom.addEventListener('animationend', CavemansSPA.navigation.removeClasses(vnode, CavemansSPA.navigation.pageInClass()));

                console.log('direction: ', CavemansSPA.navigation.direction,
                    ', pageInClass:', CavemansSPA.navigation.pageInClass(),
                    ', pageOutClass: ', CavemansSPA.navigation.pageOutClass()
                );

                vnode.dom.classList.add('cavemansspa-page-new', 'animated', CavemansSPA.navigation.pageInClass());

                var theLastPage = CavemansSPA.navigation.lastPage;
                theLastPage.vnode.dom.classList.add('cavemansspa-page-last', 'animated', CavemansSPA.navigation.pageOutClass());
                theLastPage.vnode.dom.addEventListener('animationend', function (el) {
                    console.log('in onbeforeremove addEventListener', el);
                    console.log(theLastPage);
                    theLastPage.whenDone();
                });
            }
        },

        onReady: function () {
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

CavemansSPA.view.Settings = {
    oninit: function(vnode) {
        vnode.state.showNext = vnode.attrs.showNext === undefined ? true : vnode.attrs.showNext;
        console.log('oninit', vnode);
    },
    onremove: function(vnode) {
        console.log('Settings::onremove()', vnode);
    },
    view: function(vnode) {
        console.log('Settings::view()', vnode);
        var defaultChildren = [
            'settings',
            m('br'),
            m('a[href=]', {
                onclick: function() {
                    history.back();
                }
            }, 'prev')
        ]
        if (vnode.state.showNext) defaultChildren = _.concat(defaultChildren, [
            m('br'),
            m('a[href=/settings2]', {
                oncreate: m.route.link
            }, 'next')
        ])

        return m('div.settings', vnode.attrs, defaultChildren);
    }
};

