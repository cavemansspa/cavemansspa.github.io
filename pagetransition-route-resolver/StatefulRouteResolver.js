
function StatefulRouteResolver(config) {

    const routeHistory = [], onRender = config.onrender;
    const routeResolvers = config.routes.reduce(function (obj, it) {

        var resolver = {
            components: undefined,
            direction: undefined,
            path: it.path,
            baseComponent: it.baseComponent,

            onmatch: function (args, requestedPath) {
                var outboundPath = m.route.get()
                    , outboundComponent = outboundPath ? routeResolvers[outboundPath].baseComponent : undefined
                    , inboundComponent = it.baseComponent;

                console.log('omatch', args, {requestedPath: requestedPath, outboundPath: outboundPath})

                // If they're the same component, return inboundComponent
                if (!outboundComponent || outboundComponent === inboundComponent) {
                    routeHistory.push(requestedPath)
                    resolver.components = [inboundComponent]
                    return
                }

                if (routeHistory.length > 1 && requestedPath === routeHistory[routeHistory.length - 1 - 1]) {
                        console.log('direction is back')
                        resolver.direction = 1
                        routeHistory.pop()
                    } else {
                        console.log('direction is forward')
                        resolver.direction = -1
                        routeHistory.push(requestedPath)
                    }
                

                // If we are moving forward, the next screen is off viewport to the right,
                // and slides in from the right moving to the left.
                //
                // If we are moving backwards, the next screen is off viewport to the left,
                // and slides in from the left moving to the right.
                resolver.components = (resolver.direction === -1
                    ? [outboundComponent, inboundComponent]
                    : [inboundComponent, outboundComponent]).filter(function (it) {
                    return it
                })

            },

            render: function (vnode) {
                console.log('render: ', {vnode: vnode, resolver: resolver})
                return onRender(resolver)
            }
        }

        obj[it.path] = resolver
        return obj

    }, {})

    return routeResolvers;
}

