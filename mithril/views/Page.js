CavemansSPA.view.Page = function(component, args) {
    console.log('CavemansSPA.view.Page', component, args);
    return {

        oncreate: function(vnode) {
            console.log('CavemansSPA.view.Page::oncreate()', vnode);

            if (!CavemansSPA.navigation.lastPage) {
                console.log('first page -- no slides');
                CavemansSPA.navigation.history.push(args.pageArgs.key);
                return;
            }

            CavemansSPA.navigation.doTransition(vnode, args.pageArgs);
        },

        onbeforeremove: function(vnode) {
            console.log('CavemansSPA.view.Page::onbeforeremove()', vnode, done);

            CavemansSPA.navigation.lastPage = {
                //whenDone: done,
                vnode: vnode,
                key: args.pageArgs.key
            };
            var done = new Promise(function(resolve) {
                console.log('done promise', resolve);
                CavemansSPA.navigation.lastPage.whenDone = resolve;
            })
            return done;
        },

        view: function(vnode) {
            console.log('CavemansSPA.view.Page::view()', vnode, args);
            return m('div.cavemansspa-page', args.pageArgs, [
                'test',
                m(component, args.componentArgs)
            ]);
        }
    }
}