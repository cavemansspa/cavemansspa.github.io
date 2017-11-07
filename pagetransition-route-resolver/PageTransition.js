CavemansSPA.PageTransition = {

    static: {
        onrender: function (resolver) {

            console.log('onrender', resolver)

            let styleLI = {
                style: {
                    display: 'inline-block',
                    width: '100%',
                    'vertical-align': 'top',
                    padding: 0,
                    margin: 0,
                    height: '100vh',
                    overflow: 'hidden'
                }
            }

            return m(CavemansSPA.PageTransition, {
                resolver: resolver
            }, resolver.components.map(function (it) {
                return m('li', styleLI, m(it, {resolver: resolver}))
            }))
        }
    },

    view: function (vnode) {
        console.log('PageTransition::view', vnode, vnode.children)
        var attrsUL = applyAttrs(vnode)

        return m("ul", attrsUL, vnode.children)

        function applyAttrs(vnode) {
            let styleUL = {
                    style: {
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        height: '100vh',
                        //overflow: 'hidden',
                        whiteSpace: 'nowrap'
                    }
                }

            var attrs = Object.assign({class: 'page-transition'}, styleUL),
                resolver = vnode.attrs.resolver

            if (resolver.components.length > 1) {
                attrs.style = Object.assign({}, attrs.style, {
                    transform: 'translate3d(-100%, 0, 0)'//transition: 'transform 1s',
                })
                if (resolver.direction === -1) {
                    attrs.style = Object.assign(attrs.style, {
                        transition: 'transform 1s'
                    })
                } else if (resolver.direction === 1) {
                    requestAnimationFrame(function () {
                        console.log('requestAnimationFrame', resolver)
                        resolver.direction = 0
                        m.redraw()
                    })
                } else if (resolver.direction === 0) {
                    attrs.style = Object.assign({}, attrs.style, {
                        transform: 'translate3d(0, 0, 0)',
                        transition: 'transform 1s',
                    })
                }

                attrs.ontransitionend = function () {
                    console.log('transition end', resolver, attrs)
                    if (resolver.direction === -1) {
                        resolver.components = [resolver.components[1]]
                    } else {
                        resolver.components = [resolver.components[0]]
                    }
                }
            }

            return attrs
        }
    }
}