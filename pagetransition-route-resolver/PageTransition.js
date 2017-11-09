CavemansSPA.PageTransition = {

    static: {
        onrender: function (resolver) {
            console.log('onrender', resolver)
            return m(CavemansSPA.PageTransition, {resolver: resolver})
        }
    },

    view: function (vnode) {
        console.log('PageTransition::view', vnode, vnode.children)
        var resolver = vnode.attrs.resolver,
            attrsUL = applyAttrs(vnode),
            styleLI = {
                style: {
                    display: 'inline-block',
                    width: '100%',
                    'vertical-align': 'top',
                    padding: 0,
                    margin: 0,
                    height: '100%',
                    overflow: 'hidden'
                }
            }

        return m("ul", attrsUL, resolver.components.map(function (it) {
            return m('li', Object.assign({}, styleLI, {key: it.key}), m(it.component, {resolver: resolver}))
        }))

        function applyAttrs(vnode) {
            let styleUL = {
                style: {
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    height: '100%',
                    //overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }
            }

            var attrs = Object.assign({class: 'page-transition'}, styleUL),
                resolver = vnode.attrs.resolver

            if (resolver.components.length > 1) {

                // We are advancing forward, the next screen is off viewport to the right,
                // and slides in from the right moving to the left.
                if (resolver.direction === -1) {
                    attrs.style = Object.assign({}, attrs.style, {
                        transform: 'translate3d(-100%, 0, 0)',
                        transition: 'transform .5s'
                    })

                // If we are going back, the next screen is off viewport to the left,
                // and slides in from the left moving to the right.
                } else if (resolver.direction === 1) {
                    attrs.style = Object.assign({}, attrs.style, {
                        transform: 'translate3d(-100%, 0, 0)'
                    })
                    requestAnimationFrame(function () {
                        console.log('requestAnimationFrame', resolver)
                        resolver.direction = 0
                        m.redraw()
                    })
                } else if (resolver.direction === 0) {
                    attrs.style = Object.assign({}, attrs.style, {
                        transform: 'translate3d(0, 0, 0)',
                        transition: 'transform .5s',
                    })
                }

                attrs.ontransitionend = function (e) {
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