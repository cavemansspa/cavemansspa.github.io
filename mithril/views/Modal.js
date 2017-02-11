CavemansSPA.view.Modal = (function () {

    var modalEl,
        messageContent = '',
        messageDetails = '',
        modalClass = '',
        isWarning = false;

    return {

        error: function (message, details) {
            messageContent = message || 'An unexpected error has occurred';
            messageDetails = details || '';
            isWarning = false;
            modalClass = 'i.red.warning.circle.icon';
            messageClass = '.ui.error.tiny.message';
            m.redraw();
            modalEl.modal('show');
        },

        warn: function (message, details) {
            messageContent = message || '';
            messageDetails = details || '';
            isWarning = true;
            modalClass = 'i.yellow.warning.circle.icon';
            messageClass = '.ui.warning.tiny.message';
            m.redraw();
            modalEl.modal('show');
        },

        hide: function () {
            modalEl.modal('hide');
        },

        oninit: function (vnode) {
            console.log('CavemansSPA.view.Modal::oninit');
        },

        oncreate: function (vnode) {
            modalEl = $(vnode.dom).modal({
                closable: false
            });
        },

        view: function (vnode) {
            console.log('CavemansSPA.view.Modal::view');
            var messageVnode = [
                    m('.ui.center.aligned.container', messageContent)
                ],
                detailsVnode;

            if (messageDetails instanceof Array) {
                detailsVnode = messageDetails.map(function (it) {
                    return m('p', it)
                });
            } else {
                detailsVnode = m('p', messageDetails);
            }

            if (messageDetails) messageVnode.push(m(messageClass, detailsVnode));

            return m('.ui.modal.cavemanspa-modal', [
                m('.ui.icon.top.attached.header', m(modalClass), isWarning ? '' : 'Server Error'),
                m('i.close.icon'),
                m('.content', [
                    m('.description', messageVnode)
                ])
            ])
        }
    };

})();