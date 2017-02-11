CavemansSPA.view.Login = {
    onremove: function(vnode) {
        console.log('Login::onremove()', vnode);
    },
    view: function(vnode) {
        console.log('Login::view()', vnode);
        return m('div.login', [
            'login',
            m('br'),
            m('a[href=/settings]', {
                oncreate: m.route.link
            }, 'next')
        ]);
    }
};
