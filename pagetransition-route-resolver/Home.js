CavemansSPA.Home = {
    view: function() {
        return [
            //m(Menu),
            m("h1", "Home"),
            m("a[href=/page1]", {oncreate: m.route.link}, "/page1")
        ]
    }
}
