CavemansSPA.view.PageTestClosure = function PageTestClosure(vnode) {
    console.log('top of closure', vnode)


    var subjectUserData = new Rx.Subject()
    var subjectMetaData = new Rx.Subject()

    //
    // Typically you wouldn't want to mutate this data that's used throughout the U/I.
    // However, we're funnelling all changes through this page level interface and
    // propagating userData to registered components.
    //
    var userData = {}

    function createUser(user) {
        console.log('createUser', user)
        CavemansSPA.view.LoadingMask.show()
        Rx.Observable.ajax({
            method: "POST",
            url: "https://rem-adkifyhmvs.now.sh/api/users",
            crossDomain: true,
            withCredentials: true,
            headers: {'Content-Type': 'application/json'},
            body: user
        }).subscribe({
                next: (it) => {
                    console.log('save$', it)
                    userData.data.push({
                        id: Number(it.response.id),
                        firstName: it.response.firstName,
                        lastName: it.response.lastName
                    })
                    subjectMetaData.next({
                        action: 'CREATED',
                        type: 'user',
                        row: it.response
                    })
                },
                error: (error) => {
                    console.error('save$', error)
                    CavemansSPA.view.LoadingMask.hide()
                    CavemansSPA.view.Modal.error('saveUser error', user)
                },
                complete: () => {
                    CavemansSPA.view.LoadingMask.hide()
                    console.log('save$', 'complete', userData)
                    subjectUserData.next(userData)

                    m.redraw()
                }
            }
        )
    }

    function deleteUser(user) {
        user.id = Number(user.id)
        console.log('deleteUser()', user)
        CavemansSPA.view.LoadingMask.show()
        Rx.Observable.ajax({
            method: "DELETE",
            url: "https://rem-adkifyhmvs.now.sh/api/users/" + user.id,
            crossDomain: true,
            withCredentials: true,
            headers: {'Content-Type': 'application/json'},
        }).subscribe({
                next: (it) => {
                    console.log('deleteUser()', 'next', it)
                    _.remove(userData.data, (row) => row.id === user.id )
                    subjectMetaData.next({
                        action: 'DELETED',
                        type: 'user',
                        row: user
                    })
                },
                error: (error) => {
                    console.error('deleteUser()', 'error', error)
                    CavemansSPA.view.LoadingMask.hide()
                    CavemansSPA.view.Modal.error('deleteUser error', user)
                },
                complete: () => {
                    CavemansSPA.view.LoadingMask.hide()
                    console.log('deleteUser()', 'complete', userData)
                    subjectUserData.next(userData)

                    m.redraw()
                }
            }
        )
    }

    var oninit$ = Rx.Observable.ajax({
        method: "GET",
        url: "https://rem-adkifyhmvs.now.sh/api/users",
        crossDomain: true,
        withCredentials: true
    })

    return {
        oninit: (vnode) => {
            console.log('PageTest:oninit', vnode)
            CavemansSPA.view.LoadingMask.show()
            oninit$.subscribe({
                next: (it) => {
                    console.log(it)
                    _.assign(userData, it.response)
                },
                error: (error) => {
                    console.error(error)
                    CavemansSPA.view.LoadingMask.hide()
                    CavemansSPA.view.Modal.error('Error initializing user data')
                },
                complete: () => {
                    console.log('complete', vnode)
                    CavemansSPA.view.LoadingMask.hide()
                    subjectUserData.next(userData)
                    m.redraw()
                }
            })
        },
        oncreate: (vnode) => {
            console.log('PageTest:oncreate', vnode)
        },

        foo: {bar: 1},
        componentScope: {},

        view: (vnode) => {
            console.log('PageTest:view', vnode)
            var pageVnode = vnode;

            return m('.ui segment container', {
                    style: {height: '100%', overflow: 'auto'},
                }, [
                    'this is a test - ' + new Date(),

                    m('.ui stackable four column grid basic segment container', [
                        m(CavemansSPA.view.FormComponent, {
                            pageScope: {crud$: subjectUserData, meta$: subjectMetaData, createUser: createUser, deleteUser: deleteUser},
                            componentArgs: { }
                        }),
                    ]),

                    m('.ui stackable four column grid container', [
                        m('.ui column',
                            m('', 'Orginal Data'),
                            m(CavemansSPA.view.TableComponent, {
                                pageScope: {crud$: subjectUserData, meta$: subjectMetaData},
                                componentArgs: {color: 'teal'}
                            })
                        ),
                        m('.ui column',
                            m('', 'Sorted by First Name, Last Name'),
                            m(CavemansSPA.view.TableComponent, {
                                pageScope: {crud$: subjectUserData, meta$: subjectMetaData},
                                componentArgs: {
                                    sortBy: [(it) => it.firstName.toUpperCase(), (it) => it.lastName.toUpperCase()],
                                    color: 'blue'
                                }
                            })
                        ),
                        m('.ui column',
                            m('', 'Sorted by Last Name'),
                            m(CavemansSPA.view.TableComponent, {
                                pageScope: {crud$: subjectUserData, meta$: subjectMetaData},
                                componentArgs: {
                                    sortBy: [(it) => {
                                        return it.lastName.toUpperCase()
                                    }], color: 'green'
                                }
                            })
                        ),
                        m('.ui column',
                            m('', 'Sorted by Id Descending, Id > 5'),
                            m(CavemansSPA.view.TableComponent, {
                                pageScope: {crud$: subjectUserData, meta$: subjectMetaData},
                                componentArgs: {
                                    sortBy: ['id'],
                                    sortDir: ['desc'],
                                    filterBy: (it) => Number(it.id) > 5,
                                    color: 'yellow'
                                }
                            })
                        )

                    ])

                ]
            )
        }
    }
}
