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

    doTransition: function (vnode, args) {
        var lastPageHistory = _.nth(CavemansSPA.navigation.history, -2);

        if (lastPageHistory === args.key) {
            CavemansSPA.navigation.history.pop();
            CavemansSPA.navigation.direction = 'prev';
        } else {
            CavemansSPA.navigation.direction = 'next';
            CavemansSPA.navigation.history.push(args.key);
        }

        var pageInClass = CavemansSPA.navigation.pageInClass(),
            pageOutClass = CavemansSPA.navigation.pageOutClass(),
            appBodyEl = document.querySelector('.cavemansspa-app-body');

        //console.log('direction: ', CavemansSPA.navigation.direction,
        //    ', pageInClass:', CavemansSPA.navigation.pageInClass(),
        //    ', pageOutClass: ', CavemansSPA.navigation.pageOutClass()
        //);

        var animationEndHandler = (e) => {
            console.log('Inbound ANIMATIONEND', e.type, e, vnode.dom, e.target === vnode.dom)
            e.target.classList.remove('cavemansspa-page-new', 'animated', CavemansSPA.navigation.pageInClass());
            appBodyEl.classList.remove('cavemansspa-transition-parent')
            e.target.removeEventListener(e.type, animationEndHandler);
        }

        vnode.dom.addEventListener('animationend', animationEndHandler);


        var theLastPage = CavemansSPA.navigation.lastPage;
        theLastPage.vnode.dom.addEventListener('animationend', function (e) {
            console.log('Outbound ANIMATIONEND', 'animationend', e, vnode.dom, e.target === vnode.dom, theLastPage)
            theLastPage.whenDone();
        })

        // These setTimeouts and cavemansspa-transition-parent hacks are to get iOS Safari to paint.
        setTimeout(() => {
            theLastPage.vnode.dom.classList.add('cavemansspa-page-last', 'animated', pageOutClass)
            vnode.dom.classList.add('cavemansspa-page-new', 'animated', pageInClass);
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
            return new Promise(function (resolve) {
                console.log('CavemansSPA.view.Page::onbeforeremove() -- promise', resolve);
                CavemansSPA.navigation.lastPage.whenDone = resolve;
            });
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
