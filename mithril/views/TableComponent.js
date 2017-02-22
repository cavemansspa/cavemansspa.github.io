CavemansSPA.view.TableComponent = {

    vnodeHeader: function (columnNames) {
        return m('thead',
            columnNames.map((columnName) => {
                    return m('th', columnName)
                }
            )
        )
    },

    vnodeRow: function (componentScope, meta$) {

        var dataArray = componentScope.data,
            selectedRow = componentScope.selected || {row:{id:null}}

        return m('tbody',
            dataArray.map((row) => {
                
                var trAttrs = {
                        onclick: (e) => {
                            meta$.next({action: 'SELECTED', row: row})
                        }
                    }
                if (row.id === selectedRow.row.id) {
                    _.assign(trAttrs, {style: {backgroundColor: 'rgba(152, 251, 152, 0.15)'}})
                }
                
                var tdVnodes = _.map(['id', 'firstName', 'lastName'], (columnName) => {
                    return m('td', row[columnName])
                })
                return m('tr', trAttrs, tdVnodes)
            })
        )
    },

    oninit: function (vnode) {
        vnode.state.columnNames = ['Id', 'First Name', 'Last Name']

        var crud$ = vnode.attrs.pageScope.crud$,
            meta$ = vnode.attrs.pageScope.meta$

        _.assign(vnode.state, {componentScope: {data: []}})

        meta$.subscribe({
            next: (it) => {
                console.log('$meta next', it)
                if(it.action === 'SELECTED') {
                    _.assign(vnode.state.componentScope, {selected: it})
                }
            }
        })

        // Here we'll get notified when the page level data has been modified with a CRUD operation
        crud$.subscribe({
            next: (it) => {
                var sortBy = vnode.attrs.componentArgs.sortBy || [],
                    sortDir = vnode.attrs.componentArgs.sortDir || ['asc'],
                    filterBy = vnode.attrs.componentArgs.filterBy || null

                console.log('CavemansSPA.view.TableComponent::crud$.next', it)
                _.assign(vnode.state, {pageScope: {data: it.data}})
                _.assign(vnode.state, {componentScope: {data: it.data}})
                if (sortBy) vnode.state.componentScope.data = _.orderBy(it.data, sortBy, sortDir)
                if (filterBy) vnode.state.componentScope.data = _.filter(vnode.state.componentScope.data, filterBy)
            },
            complete: () => {
                console.log('CavemansSPA.view.TableComponent::crud$.complete')
            }
        })
    },

    view: function (vnode) {
        return m('table.ui very compact striped celled table', {class: vnode.attrs.componentArgs.color}, [
            this.vnodeHeader(vnode.state.columnNames),
            this.vnodeRow(vnode.state.componentScope, vnode.attrs.pageScope.meta$)
        ])
    }

}

