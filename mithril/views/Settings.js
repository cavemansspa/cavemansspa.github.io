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