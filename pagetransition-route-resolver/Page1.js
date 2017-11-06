CavemansSPA.Page1 = {
    view: function() {
        return [
            //m(Menu),
            m("h1", "Page 1"),
            m("a[href=/]", {oncreate: m.route.link}, "/home")
        ]
    }
}
