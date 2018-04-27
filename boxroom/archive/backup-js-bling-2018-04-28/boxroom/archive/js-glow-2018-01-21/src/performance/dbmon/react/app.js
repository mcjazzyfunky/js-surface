/** @jsx React.createElement */
import ENV from '../shared/env.js';

import React from 'react';
import ReactDOM from 'react-dom';

export default class DBMon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            databases: []
        };
    }
    
    loadSamples() {
        this.setState({ databases: ENV.generateData().toArray() });
        Monitoring.renderRate.ping();
        setTimeout(this.loadSamples, ENV.timeout);
    }
    
    componentDidMount() {
        this.loadSamples();
    }
    
    render() {
        return (
            <div>
                <table className="table table-striped latest-data">
                    <tbody>
                        {
                            this.state.databases.map(function(database) {
                                return (
                                    <tr key={database.dbname}>
                                        <td className="dbname">
                                            {database.dbname}
                                        </td>
                                        <td className="query-count">
                                            <span className={database.lastSample.countClassName}>
                                                {database.lastSample.nbQueries}
                                            </span>
                                        </td>
                                            {
                                                database.lastSample.topFiveQueries.map(function(query, index) {
                                                    return (
                                                        <td className={ "Query " + query.elapsedClassName}>
                                                            {query.formatElapsed}
                                                            <div className="popover left">
                                                                <div className="popover-content">{query.query}</div>
                                                                <div className="arrow"/>
                                                            </div>
                                                        </td>
                                                    );
                                                })
                                            }
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}
    
ReactDOM.render(<DBMon />, document.getElementById('dbmon'));