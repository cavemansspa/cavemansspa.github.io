CavemansSPA.view.PageTestClosure = function PageTestClosure(vnode) {
    console.log('top of closure', vnode)

    //
    // Typically you wouldn't want to mutate this data array that's used throughout the U/I.
    // However, we're funnelling all changes through this page level interface and
    // propagating userData to registered components.
    //
    var subjectUserData = new Rx.Subject()
    var userData = []

    function createUser(user) {
        console.log('createUser', user)
        Rx.Observable.ajax({
            method: "POST",
            url: "https://rem-rest-api.herokuapp.com/api/users",
            crossDomain: true,
            withCredentials: true,
            body: JSON.stringify(user)
        }).subscribe({
                next: (it) => {
                    console.log('save$', it)
                    userData.data.push({
                        id: it.response.id,
                        firstName: it.response.firstName,
                        lastName: it.response.lastName
                    })
                },
                error: (error) => {
                    console.error('save$', error)
                    CavemansSPA.view.Modal.error('saveUser error', user)
                },
                complete: () => {
                    console.log('save$', 'complete', userData)
                    subjectUserData.next(userData)
                    m.redraw()
                }
            }
        )
    }

    var oninit$ = Rx.Observable.ajax({
        method: "GET",
        url: "https://rem-rest-api.herokuapp.com/api/users",
        crossDomain: true,
        withCredentials: true
    })

    return {
        oninit: (vnode) => {
            console.log('PageTest:oninit', vnode)
            oninit$.subscribe({
                next: (it) => {
                    console.log(it)
                    _.assign(userData, it.response)
                },
                error: (error) => {
                    console.error(error)
                },
                complete: () => {
                    console.log('complete', vnode)
                    subjectUserData.next(userData)
                    m.redraw()
                }
            })
        },
        oncreate: (vnode) => {
            console.log('PageTest:oncreate', vnode)
        },
        foo: {bar: 1},
        view: (vnode) => {
            console.log('PageTest:view', vnode)
            return m('.ui segment container', {
                    style: {height: '100%', overflow: 'auto'},
                    oninit: (vnode) => {
                        console.log('m:oninit', vnode)
                        subjectUserData.subscribe({
                            next: (it) => {
                                console.log(it, vnode)
                            }
                        })
                    },
                    oncreate: (vnode) => {
                        console.log('m:oncreate', vnode)
                    }
                }, [
                    'this is a test - ' + new Date(),

                    m('.ui stackable four column grid basic segment container', [
                        m('form.ui.tiny.form.segment', {
                            style: {width: '100%'},
                            oncreate: (vnode) => {
                                $(vnode.dom).form({
                                        fields: {
                                            firstName: {
                                                rules: [
                                                    {
                                                        type: 'empty',
                                                        prompt: 'Please enter a first name'
                                                    }
                                                ]
                                            },
                                            lastName: {
                                                rules: [
                                                    {
                                                        type: 'empty',
                                                        prompt: 'Please enter a last name'
                                                    }
                                                ]
                                            }
                                        },
                                        inline: true,
                                        on: 'blur',
                                        onSuccess: function (e) {
                                            e.preventDefault();
                                        }
                                    }
                                )
                            }
                        }, [
                            m('.ui.two.fields', [
                                m('.ui field', [
                                    m('label', 'First Name'),
                                    m('input[text][name=firstName][placeholder=First name] ui')
                                ]),
                                m('.ui field', [
                                    m('label', 'Last Name'),
                                    m('input[text][name=lastName][placeholder=Last name] ui')
                                ])

                            ]),
                            m('.ui primary submit button', {
                                onclick: (e) => {
                                    e.preventDefault()

                                    // Just user semantic-ui validation here.
                                    if(!($('form.form').form('is valid'))) return;

                                    // Just use semantic-ui form values here.
                                    var formData = $('form.form').form('get values')
                                    createUser(formData)
                                }
                            }, 'Save')
                        ])
                    ]),

                    m('.ui stackable four column grid container', [
                        m('.ui column',
                            m('', 'Orginal Data'),
                            m(CavemansSPA.view.TableComponent, {
                                pageScope: {crud$: subjectUserData},
                                componentArgs: {color: 'teal'}
                            })
                        ),
                        m('.ui column',
                            m('', 'Sorted by First Name, Last Name'),
                            m(CavemansSPA.view.TableComponent, {
                                pageScope: {crud$: subjectUserData},
                                componentArgs: {
                                    sortBy: [(it) => it.firstName.toUpperCase(), (it) => it.lastName.toUpperCase()],
                                    color: 'blue'
                                }
                            })
                        ),
                        m('.ui column',
                            m('', 'Sorted by Last Name'),
                            m(CavemansSPA.view.TableComponent, {
                                pageScope: {crud$: subjectUserData},
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
                                pageScope: {crud$: subjectUserData},
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
