function StatefulRouteResolver(config) {

    const routeHistory = [],
        onRender = config.onrender;

    const routeResolvers = config.routes.reduce(function (obj, it) {

        var resolver = {
            components: undefined,
            direction: undefined,
            path: it.path,
            baseComponent: it.baseComponent,

            onmatch: function (args, requestedPath) {
                var outboundPath = m.route.get(),
                    historyLength = routeHistory.length,
                    lastRoute = historyLength > 0 ? routeHistory[historyLength - 1] : undefined,
                    lastRouteKey = lastRoute ? lastRoute.routeKey : undefined,
                    outboundComponent = lastRouteKey ? routeResolvers[lastRouteKey].baseComponent : undefined,
                    outboundResolver = lastRouteKey ? routeResolvers[lastRouteKey] : undefined,
                    inboundComponent = it.baseComponent;

                console.log('omatch', args, {requestedPath: requestedPath, outboundPath: outboundPath})

                // If we are starting, return inboundComponent
                if (!outboundComponent) { // || outboundComponent === inboundComponent) {
                    routeHistory.push({routeKey: it.path, requestedPath: requestedPath})
                    resolver.components = [{key: it.path, component: inboundComponent}]
                    return
                }

                if (historyLength > 1 && requestedPath === routeHistory[historyLength - 1 - 1].requestedPath) {
                    console.log('direction is back', 1)
                    resolver.direction = 1
                    routeHistory.pop()
                } else {
                    console.log('direction is forward', -1)
                    outboundResolver.scrollTop = outboundResolver.scrollableEl ? outboundResolver.scrollableEl.scrollTop : 0
                    resolver.direction = -1
                    routeHistory.push({routeKey: it.path, requestedPath: requestedPath})
                }


                // If we are moving forward, the next screen is off viewport to the right,
                // and slides in from the right moving to the left.
                //
                // If we are moving backwards, the next screen is off viewport to the left,
                // and slides in from the left moving to the right.
                resolver.components = (resolver.direction === -1
                    ? [{key: lastRouteKey, component: outboundComponent}, {key: it.path, component: inboundComponent}]
                    : [{key: it.path, component: inboundComponent}, {key: lastRouteKey, component: outboundComponent}])
                    .filter(function (it) {
                        return it.component
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

