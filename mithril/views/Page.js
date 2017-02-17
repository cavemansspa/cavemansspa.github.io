CavemansSPA.navigation = {
    history: [],
    direction: 'next',
    pageInClass: function () {
        return (this.direction === 'next' ? 'slideInRight' : 'slideInLeft')
    },
    pageOutClass: function () {
        return (this.direction === 'next' ? 'slideOutLeft' : 'slideOutRight')
    },
    lastPage: null,
    //removeClasses: function (vnode, className) {
    //    return function (e) {
    //        console.log('CavemansSPA.view.Page::removeClasses()', vnode);
    //        vnode.dom.classList.remove('cavemansspa-page-new');
    //        vnode.dom.classList.remove('animated');
    //        vnode.dom.classList.remove(className);
    //        e.target.removeEventListener(e.type, arguments.callee);
    //    }
    //},
    doTransition: function (vnode, args) {
        var lastPageHistory = _.nth(CavemansSPA.navigation.history, -2);

        if (lastPageHistory === args.key) {
            CavemansSPA.navigation.history.pop();
            CavemansSPA.navigation.direction = 'prev';
        } else {
            CavemansSPA.navigation.direction = 'next';
            CavemansSPA.navigation.history.push(args.key);
        }

        //vnode.dom.addEventListener('animationend webkitAnimationEnd', CavemansSPA.navigation.removeClasses(vnode, CavemansSPA.navigation.pageInClass()));

//         console.log('direction: ', CavemansSPA.navigation.direction,
//             ', pageInClass:', CavemansSPA.navigation.pageInClass(),
//             ', pageOutClass: ', CavemansSPA.navigation.pageOutClass()
//         );

        var animationEndHandler = (e) => {
            console.log('Inbound ANIMATIONEND', e.type, e, vnode.dom, e.target === vnode.dom)

            e.target.classList.remove('cavemansspa-page-new', 'animated', CavemansSPA.navigation.pageInClass());
            e.target.removeEventListener(e.type, animationEndHandler);
            $('.cavemansspa-app-body').removeClass('cavemansspa-transition-parent')
        }

        ['animationend', 'mozAnimationEnd', 'webkitAnimationEnd'].forEach((it) => {
            vnode.dom.addEventListener(it, animationEndHandler);

        })


        var theLastPage = CavemansSPA.navigation.lastPage;
        ['animationend', 'mozAnimationEnd', 'webkitAnimationEnd'].forEach((it) => {
            theLastPage.vnode.dom.addEventListener(it, function (e) {
                console.log('Outbound ANIMATIONEND', it, e, vnode.dom, e.target === vnode.dom, theLastPage)
                theLastPage.whenDone();
            })
        });

        var pageInClass = CavemansSPA.navigation.pageInClass();
        var pageOutClass = CavemansSPA.navigation.pageOutClass();
        var appBodyEl = document.querySelector('.cavemansspa-app-body')

        // These setTimeouts and cavemansspa-transition-parent are to get iOS Safari to paint.
        setTimeout(() => {
            theLastPage.vnode.dom.classList.add('cavemansspa-page-last', 'animated', pageOutClass)
            vnode.dom.classList.add('cavemansspa-page-new')
            vnode.dom.classList.add('animated')
            vnode.dom.classList.add(pageInClass)
            $(vnode.dom).addClass('cavemansspa-page-new', 'animated', pageInClass);
        }, 1);
        setTimeout(function () {
            appBodyEl.classList.add('cavemansspa-transition-parent')
        }, 50)
        setTimeout(function () {
            appBodyEl.classList.remove('cavemansspa-transition-parent')
        }, 100)
    }
};

CavemansSPA.view.Page = function (component, args) {
    console.log('CavemansSPA.view.Page', component, args);
    return {
        oninit: function (vnode) {
            console.log('CavemansSPA.view.Page::oninit', args, vnode);
        },
        oncreate: function (vnode) {
            console.log('CavemansSPA.view.Page::oncreate()', vnode);

            if (!CavemansSPA.navigation.lastPage) {
                console.log('first page -- no slides');
                CavemansSPA.navigation.history.push(args.pageArgs.key);
                return;
            }

            CavemansSPA.navigation.doTransition(vnode, args.pageArgs);
        },

        onupdate: function (vnode) {
            console.log('CavemansSPA.view.Page::onupdate()', vnode);
        },


        onremove: function (vnode) {
            console.log('CavemansSPA.view.Page::onremove()', vnode);
        },

        onbeforeremove: function (vnode) {
            console.log('CavemansSPA.view.Page::onbeforeremove()', vnode);

            CavemansSPA.navigation.lastPage = {
                vnode: vnode,
                key: args.pageArgs.key
            };
            var done = new Promise(function (resolve) {
                console.log('CavemansSPA.view.Page::onbeforeremove() -- promise', resolve);
                CavemansSPA.navigation.lastPage.whenDone = resolve;
            });
            return done;
        },

        view: function (vnode) {
            console.log('CavemansSPA.view.Page::view()', vnode, args);

            var pageArgs = _.assign({}, args.pageArgs),
                componentArgs = _.assign({}, args.componentArgs)

            return m('div.cavemansspa-page', pageArgs, [
                'test',
                m(component, args.componentArgs)
            ]);
        }
    }
};
