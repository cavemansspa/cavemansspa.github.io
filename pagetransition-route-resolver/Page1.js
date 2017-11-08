CavemansSPA.Page1 = {
    oninit: function (vnode) {
        console.log('CavemansSPA.Page1::oninit', vnode)

        m.request({
            method: "GET",
            url: "https://rem-xcanjvogzd.now.sh/api/users/",
            crossDomain: true,
            withCredentials: true
        }).then(function (result) {
            Object.assign(vnode.state, {users: result.data})
        })
    },

    view: function (vnode) {
        let users = vnode.state.users || []
        return [
            //m(Menu),
            m("h1", "Page 1"),
            m("", m("a[href=/]", {oncreate: m.route.link}, "/home")),
            m("", m("a[href=/page2/1]", {oncreate: m.route.link}, "/page2/1")),
            users.length ? users.map(function (user) {
                let selector = 'a[href=/page2/' + user.id + ']'
                return m("", m(selector, {oncreate: m.route.link}, "View " + user.id), " -- " + JSON.stringify(user))
            }) : m("", "Loading users...")
        ]
    }
}

CavemansSPA.Page2 = {
    oninit: function (vnode) {
        console.log('CavemansSPA.Page2::oninit', vnode)
        Object.assign(vnode.state, {id: m.route.param('id')})

        m.request({
            method: "GET",
            url: "https://rem-xcanjvogzd.now.sh/api/users/" + vnode.state.id,
            crossDomain: true,
            withCredentials: true
        }).then(function (result) {
            Object.assign(vnode.state, {user: result})
        })
    },

    view: function (vnode) {
        let user = vnode.state.user
        return [
            //m(Menu),
            m("h1", "Page 2"),
            m("", m("a[href=/]", {
                onclick: function (e) {
                    e.preventDefault()
                    e.redraw = false
                    history.back()
                }
            }, "/back")),
            user ? m('pre', JSON.stringify(user)) :  m("", "Loading " + vnode.state.id)
        ]
    }
}
