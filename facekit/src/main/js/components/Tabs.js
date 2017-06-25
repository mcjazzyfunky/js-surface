import ComponentHelper from '../helpers/ComponentHelper.js';

import { Arrays, Seq } from 'js-prelude';
import { Spec } from 'js-spec';
import { defineFunctionalComponent, createElement as dom } from 'js-surface';

export default defineFunctionalComponent({
    displayName: 'FKTabs',

    properties: {
        activeTab: {
            type: Number,
            reset: 0
        },
        
        tabPosition: {
            type: String,
            assert: Spec.oneOf(['top']),
            preset: 'top'
        },
        
        tabStyle: {
            type: String,
            assert: Spec.oneOf(['default']),
            preset: 'default'
        },
        
        preventSize: {
            type: Boolean,
            preset: false
        }
    },
        
    render(props) {
        const
            activeTab = props.activeTab,
            tabPosition = Arrays.selectValue(['top', 'bottom', 'left', 'right'], props.tabPosition, 'top'),
            tabStyle = Arrays.selectValue(['default', 'pills'], props.tabStyle, 'default'),
            tabOrientation = Arrays.selectValue(['horizontal', 'vertical'], props.tabOrientation, 'horizontal'),
            preventSize = !!props.preventSize;

        const header =
            dom('div.fk-tabs-header',
                dom('ul',
                    {className: 'nav nav-' + (tabStyle === 'pills' ? 'pills' : 'tabs')},
                    ...Seq.from(props.children).map((child, idx) => renderTab(child, activeTab, idx))));

        const body =
            dom('div.fk-tabs-body',
                ...Seq.from(props.children).map((child, index) =>
                    dom('div',
                        {className: 'fk-tabs-page', style: {display: activeTab === index || activeTab === child.props.name ? 'block' : 'none'}, id: child.props.id},
                        child)));

        const parts = tabPosition === 'bottom'
                ? [body, header]
                : [header, body];

        const ret = (
            dom('div',
                {className: 'fk-tabs fk-tabs-' + tabPosition + ' fk-tabs-' + tabOrientation + (!preventSize ? '' : ' fk-tabs-prevent-size ')},
                ...parts)
        );
        
        return ret;
    }
});

// --- local functions ----------------------------------------------

function renderTab(tab, activeTab, idx) {
    const
        props = tab.props,
        active = activeTab === props.name || idx === parseInt(activeTab, 10),
        className = ComponentHelper.buildCssClass(active ? 'active' : null);

    return (
        dom('li',
            { className },
            dom('a',
                { 'data-toggle': 'tab', 'data-target': props.id ? '#' + props.id : null },
                props.caption))
    );
}
