import { defineComponent, createElement as htm, Types } from 'js-surface';
import { Config, Seq } from 'js-prelude';

export default defineComponent({
    displayName: 'DataTable',
    
    properties: {
        columns: {
            type: Types.array
        }
    },
    
    initiate({ ctrl }) {
        
        return {
            render({ props }) {console.log('render')
                const config = Config.of(props);
                if (true) return htm('div', null, 'xxxxx');
                return renderTable(config);  
            }
        };
    }
});

function renderTable(config) {
    const
        tableHeader = renderTableHeader(config),
        tableBody = renderTableBody(config);
    
    return (
        htm('table',
            null,
            tableHeader,
            tableBody)); 
}

function renderTableHeader(config) {
    const
        columnsConfig = config.getSubConfig('columns'),
        
        headerColumns =
            Seq.from(columnsConfig)
                .map(columnConfig =>
                    renderTableHeaderCell(columnConfig));
    
    return (
        htm('thead/tr',
            null,
            headerColumns));
}

function renderTableHeaderCell(columnConfig) {
    const title = columnConfig.getString('title');
    
    return (
        htm('td',
            null,
            title));
}

function renderTableBody(config) {
    return (
        htm('tbody'));
}
