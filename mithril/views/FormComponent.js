CavemansSPA.view.FormComponent = {

    oninit: function (vnode) {
        var crud$ = vnode.attrs.pageScope.crud$,
            meta$ = vnode.attrs.pageScope.meta$

        _.assign(vnode.state, {
            componentScope: {
                data: []
            }
        })

        crud$.subscribe({
            next: (it) => {
                console.log('$crud next form', it)
                $(vnode.dom).form('clear')
            }
        })

        meta$.subscribe({
            next: (it) => {
                console.log('$meta next form', it)
                if (it.action === 'SELECTED') {
                    // Just use semanti-ui form handling here.
                    $(vnode.dom).form('set values', it.row)
                    _.assign(vnode.state.componentScope, {selected: it})
                }
            }
        })
    },

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
                onSuccess: function (e) {
                    e.preventDefault();
                }
            }
        )
    },

    view: function(vnode) {
        return m('form.ui.tiny.form.segment', {
            style: {width: '100%'},


        }, [
            m('input[hidden][name=id] ui'),
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
                    if (!($(vnode.dom).form('is valid'))) return;

                    // Just use semantic-ui form values here.
                    var formData = $(vnode.dom).form('get values')
                    if (formData.id) {
                        CavemansSPA.view.Modal.warn('Sorry, update has not been implemented')
                        return
                    }

                    vnode.attrs.pageScope.createUser(formData)
                }
            }, 'Save'),
            _.get(vnode.state, 'componentScope.selected') && m('.ui button', {
                onclick: (e) => {
                    e.preventDefault()
                    $(vnode.dom).form('clear')
                    delete vnode.state.componentScope.selected
                }
            }, 'New'),
            _.get(vnode.state, 'componentScope.selected') && m('.ui red button', {
                onclick: (e) => {
                    e.preventDefault()

                    // Just user semantic-ui validation here.
                    if (!($(vnode.dom).form('is valid'))) return;

                    // Just use semantic-ui form values here.
                    var formData = $(vnode.dom).form('get values')

                    vnode.attrs.pageScope.deleteUser(formData)
                }
            }, 'Delete')

        ])
    }

}