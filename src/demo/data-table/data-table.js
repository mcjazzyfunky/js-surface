import {
    hyperscript as dom,
    defineClassComponent,
    render,
    Component
} from 'js-surface';

import { Config, Seq } from 'js-prelude';


class DataTableComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const config = this.buildConfig(this.props);
        return this.renderTable(config);
    }

    renderTable(config) {
        return (
            dom('table',
                this.renderHeader(config))
        );
    }

    renderHeader(config) {
        const
            columns = config.columns;

        return (
            dom('thead',
                this.renderHeaderRow(columns)

            )
        );
    }

    renderHeaderRow(columns) {
        return (
            dom('tr',
                Seq.from(columns)
                    .map(column =>
                        this.renderHeaderCell(column)))
        );
    }

    renderHeaderCell(column) {
        return (
            dom('th',
                { align: ''},
                column.title)
        );
    }

    buildConfig(props) {
        const
            nextColumnId = 1;
            config = Config.from(props),
            ret = {
                headline: config.getTrimmedString('headline', ''),
                columns: [
                ],
                columnsByID: {
                }
            };

        config.getSeqOfConfigs('columns')
            .forEach(column => {
                const
                    id = column.getString('id', null) || '__column' + nextColumnId++,

                     columnInfo = {
                        displayName:  column.getString('id', '__column' + nextColumnId++),
                        title: column.getString('title', ''),
                        align: column.getString('align', 'left'),
                        sortable: column.getBoolean('align', false)
                    };

                ret.columns.push(columnInfo);
            });

        return ret;
    }
}


const DataTable = defineClassComponent({
    displayName:  'DataTable',

    properties: {
        columns: {
            type: Array
        }
    },

    componentClass: DataTableComponent
});



const config = {
    columns: [
        { title: 'Column1'
        , align: 'center'
        },
        { title: 'Column2'
        , align: 'left'
        }
    ]

};

render(DataTable(config), 'main-content');
