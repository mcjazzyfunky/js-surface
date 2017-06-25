/* global jQuery, kendo */

import ComponentHelper from '../helpers/ComponentHelper.js';
import PaginationHelper from '../helpers/PaginationHelper.js';

import { defineComponent, createElement as dom } from 'js-surface';
import { Seq, Strings } from 'js-prelude';

export default ComboBox;

const name = 'ComboBox';

const properties = {
    dataSource: {
        type: Spec.array,
        defaultValue: []
    },
    
    editable: {
        type: Spec.boolean,
        defaultValue: true
    },
    
    enabled: {
        type: Spec.boolean,
        defaultValue: true
    },
    
    readOnly: {
        type: Spec.boolean,
        defaultValue: false
    },
    
    value: {
        type: Spec.string,
        defaultValue: null
    }
};

function initiate() {
    let
        element = null,
        isDropDownList = false,
        keyValueArray = null;
        
    
    return {
        needsUpdate({ props, nextProps }) {
            return (nextProps.editable != props.editable);
        },

        onNextProps({ props, nextProps }) {
            if (nextProps.editable != props.editable) {
                cleanUpElement(element);
            }

            const nextKeyValueArray = adjustKeyValueArray(props.items);
            
            if (!isSameKeyValueArray(keyValueArray, nextKeyValueArray)) {
                keyValueArray = nextKeyValueArray;
                setElementDataSource(element, nextKeyValueArray);   
            }
        },
        
        onWillMount({ nextProps }) {
            keyValueArray = adjustKeyValueArray(nextProps.items);                        
        },
        
        onDidMount({}) {
            
        },

        onDidUnmount({ props }) {
            cleanUpElement(element);
            element = null;
        },
        
        render({ props, prevProps }) {
           return htm('div', { ref: elem => element = elem}, 'COMBO-BOX ' + Math.random());
        } 
    };
}

const ComboBox = defineComponent({
    name,
    properties,
    initiate
});

function initElement(element, { editable, items }) {
    const config = {
        dataValueField: 0,
        dataTextField: 1,
        dataSource: items
    };
    
    if (editable) {
        jQuery(element).kendoComboBox(config);
    } else {
        jQuery(element).kendoDropDownList(config)
    }
}

function setElementDataSource(element, dataSource) {
    const api = getElementAPI(element);
    
    if (api) {
        api.setDataSource(dataSource);
    }
}

function getElementAPI(element) {
    let ret = element.data('kendoDropDownList');
    
    if (!ret) {
        ret = element.data('kendoComboBox') || null;
    }

    return ret
}

function cleanUpElement(element) {
    if (element && element.data) {
        let api = getElementAPI(element);
        
        if (api) {
            api.destroy();
        }
    }
};

function adjustKeyValueArray(items) {
    return (
        Seq.from(items)
            .map(item => {
                const ret = [null, null];

                if (Array.isArray(item)) {
                    ret[0] = Strings.asString(item[0]);                    
                    ret[1] = Strings.asString(item[1]);                    
                }
            })
            .toArray());
}

function isSameKeyValueArray(arr1, arr2) {
    let ret = arr1.length === arr2.length;
    
    if (ret) {
        const length = arr1.length;

        for (let i = 0; i < length; ++i) {
            const
                item1 = arr1[i],
                item2 = arr2[i];

            if (item1[0] !== item2[0] || item1[1] != item2[1]) {
                ret = false;

                break;
            }
        }
    }
    
    return ret;
}
