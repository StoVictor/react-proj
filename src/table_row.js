import React from 'react';
import { Link } from 'react-router-dom';
class TableRow extends React.Component { render() {
        return(
            <tr>
                <td>{this.props.company.id}</td>
                <td>
                   <Link to={`/${this.props.company.id}`}>{this.props.company.name}</Link>
                </td>
                <td>{this.props.company.city}</td>
                <td>{this.props.company.total_income}</td>
            </tr>
        );
    }
}

export default TableRow;
