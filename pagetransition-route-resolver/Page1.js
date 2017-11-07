CavemansSPA.Page1 = {
    view: function(vnode) {
        return [
            //m(Menu),
            m("h1", "Page 1"),
            m("", m("a[href=/]", {oncreate: m.route.link}, "/home")),
            m("", m("a[href=/page2/1]", {oncreate: m.route.link}, "/page2/1")),
        ]
    }
}

CavemansSPA.Page2 = {
    oninit: function (vnode) {
        Object.assign(vnode.state, {id: m.route.param('id')})
    },

    view: function(vnode) {
        return [
            //m(Menu),
            m("h1", "Page 2"),
            m("", m("a[href=/]", {onclick: function (e) {
                e.preventDefault()
                history.back()
            }}, "/back")),
            vnode.state.id && m("", "Param is " + vnode.state.id)
        ]
    }
}
