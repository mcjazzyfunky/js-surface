import ComponentHelper from '../helpers/ComponentHelper.js';

import { defineComponent, createElement as htm, Types } from 'js-surface';
import { Arrays, Seq, Strings } from 'js-prelude';

const name = 'FKTabs';

const properties = {
    activeTab: {
        type: Types.number,
        defaultValue: 0
    },
    
    tabPosition: {
        type: Types.oneOf(['top']),
        defaultValue: 'top'
    },
    
    tabStyle: {
        type: Types.oneOf(['default']),
        defaultValue: 'default'
    },
    
    preventSize: {
        type: Types.bool,
        defaultValue: false
    }
};
    
function render({ props }) {
    const
       activeTab = props.activeTab,
       tabPosition = Arrays.selectValue(['top', 'bottom', 'left', 'right'], props.tabPosition, 'top'),
       tabStyle = Arrays.selectValue(['default', 'pills'], props.tabStyle, 'default'),
       tabOrientation = Arrays.selectValue(['horizontal', 'vertical'], props.tabOrientation, 'horizontal'),
       preventSize = !!props.preventSize;

    const header =
        htm('div',
            {className: 'fk-tabs-header'},
            htm('ul',
                {className: 'nav nav-' + (tabStyle === 'pills' ? 'pills' : 'tabs')},
                ...Seq.from(props.children).map((child, idx) => renderTab(child, activeTab, idx))));

    const body =
        htm('div',
            {className: 'fk-tabs-body'},
             ...Seq.from(props.children).map((child, index) =>
                htm('div',
                    {className: 'fk-tabs-page', style: {display: activeTab === index || activeTab === child.props.name ? 'block' : 'none'}, id: child.props.id},
                    child)));

    const parts = tabPosition === 'bottom'
            ? [body, header]
            : [header, body];

    const ret = (
        htm('div',
            {className: 'fk-tabs fk-tabs-' + tabPosition + ' fk-tabs-' + tabOrientation + (!preventSize ? '' : ' fk-tabs-prevent-size ')},
            ...parts)
    );
    
    return ret;
}

function renderTab(tab, activeTab, idx) {
    const
        props = tab.props,
        active = activeTab === props.name || idx === parseInt(activeTab, 10),
        className = ComponentHelper.buildCssClass(active ? 'active' : null);

    return (
        htm('li',
            {className: className},
            htm('a',
                { 'data-toggle': 'tab', 'data-target': props.id ? '#' + props.id : null },
                props.caption))
    );
}


export default defineComponent({
    name,
    properties,
    render,
    onDidMount: ({  }) => {
       // jQuery("ul.navtabs").tabs();
        /*
        const
            $elem = $(domElement);

        $elem
            .find('.fk-tabs-header:first > ul > li')
            .each((index, li) => {
                $(li).on('click', evt => {
                    evt.preventDefault();
                    $elem.find('.fk-tabs-body:first > .fk-tabs-page').hide();
                    $elem.find($('.fk-tabs-body:first > .fk-tabs-page').get(index)).show();
                });
            })
            .on('click', evt => {
                evt.preventDefault();
                $(evt.target).tab('show')
            });
        */
    }
});
