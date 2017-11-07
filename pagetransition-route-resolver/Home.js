CavemansSPA.Home = {

    oninit: function (vnode) {
        vnode.state.resolver = vnode.attrs.resolver
        console.log('CavemansSPA.Home::oninit', {vnode: vnode})
    },
    onbeforeremove: function (vnode) {
        console.log('CavemansSPA.Home::onbeforeremove', {vnode: vnode, scrollTop: vnode.dom.scrollTop})
        console.log(vnode.state.scrollableEl.scrollTop)
        vnode.state.resolver.scrollTop = vnode.state.scrollableEl.scrollTop
    },

    view: function (vnode) {
        var items = []
        for (var i = 0; i < 100; i++) {
            items.push(m('', 'item ' + i))
        }
        return [
            //m(Menu),
            m("h1", "Home"),
            m("a[href=/page1]", {oncreate: m.route.link}, "/page1"),
            m('.scrollable-element', applyAttrs(vnode), items)
        ]

        function applyAttrs(_vnode) {
            let parentState = _vnode.state
            return Object.assign({}, {
                oncreate: function (vnode) {
                    console.log('CavemansSPA.scrollable-element::oncreate', {
                            vnode: vnode, scrollTop: vnode.dom.scrollTop
                        }
                    )
                    parentState.scrollableEl = vnode.dom
                    vnode.dom.scrollTop = parentState.resolver.scrollTop || 0
                },
                style: {height: '100%', overflow: 'auto'}
            })
        }
    }
}
