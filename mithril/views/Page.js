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
};

CavemansSPA.view.Page = function (component, args) {
    console.log('CavemansSPA.view.Page', component, args);
    return {

        oncreate: function (vnode) {
            console.log('CavemansSPA.view.Page::oncreate()', vnode);

            if (!CavemansSPA.navigation.lastPage) {
                console.log('first page -- no slides');
                CavemansSPA.navigation.history.push(args.pageArgs.key);
                return;
            }

            CavemansSPA.navigation.doTransition(vnode, args.pageArgs);
        },

        onbeforeremove: function (vnode) {
            console.log('CavemansSPA.view.Page::onbeforeremove()', vnode, done);

            CavemansSPA.navigation.lastPage = {
                vnode: vnode,
                key: args.pageArgs.key
            };
            var done = new Promise(function (resolve) {
                console.log('done promise', resolve);
                CavemansSPA.navigation.lastPage.whenDone = resolve;
            });
            return done;
        },

        view: function (vnode) {
            console.log('CavemansSPA.view.Page::view()', vnode, args);
            return m('div.cavemansspa-page', args.pageArgs, [
                'test',
                m(component, args.componentArgs)
            ]);
        }
    }
};