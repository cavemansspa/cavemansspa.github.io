CavemansSPA.Home = {

    oninit: function (vnode) {
        vnode.state.resolver = vnode.attrs.resolver
        console.log('CavemansSPA.Home::oninit', {vnode: vnode})
    },

    view: function (vnode) {
        var items = []
        for (var i = 0; i < 100; i++) {
            items.push(m('', 'item ' + i))
        }
        return m('', {
            style: {
                display: 'flex',
                'flex-direction': 'column',
                height: '100%'
            },
        }, [
            //m(Menu),
            m("h1", {style: {flex: '0 0 auto'}}, "Home"),
            m("a[href=/page1]", {style: {flex: '0 0 auto'}, oncreate: m.route.link}, "/page1"),
            m('.scrollable-element', applyAttrs(vnode), items),
            m("input[type=text]", {style: {flex: '0 0 auto'}}, "Home"),
        ])

        function applyAttrs(_vnode) {
            let parentState = _vnode.state
            return Object.assign({}, {

                oncreate: function (vnode) {
                    console.log('CavemansSPA.scrollable-element::oncreate', {
                        vnode: vnode,
                        'vnode.dom.scrollTop': vnode.dom.scrollTop,
                        'parentState.resolver.scrollTop': parentState.resolver.scrollTop
                        }
                    )

                    parentState.resolver.scrollableEl = vnode.dom
                    vnode.dom.scrollTop = parentState.resolver.scrollTop || 0
                },

                onscroll: function (e) {
                    e.redraw = false
                    console.log('CavemansSPA.scrollable-element::onscroll', {
                            e: e,
                            'e.target.scrollTop': e.target.scrollTop,
                            vnode: vnode,
                            'vnode.dom.scrollTop': vnode.dom.scrollTop,
                            'parentState.resolver.scrollTop': parentState.resolver.scrollTop
                        }
                    )
                },

                onupdate: function (vnode) {
                    console.log('CavemansSPA.scrollable-element::onupdate', {
                            vnode: vnode,
                            'vnode.dom.scrollTop': vnode.dom.scrollTop,
                            'parentState.resolver.scrollTop': parentState.resolver.scrollTop
                        }
                    )
                    vnode.dom.scrollTop = parentState.resolver.scrollTop || 0
                },

                style: {
                    flex: '1 1 auto', 
                    overflow: 'auto',
                }
            })
        }
    }
}
