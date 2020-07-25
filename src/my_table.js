import React from 'react';
import Table from 'react-bootstrap/Table'; 
import TableRow from './table_row.js';

class MyTable extends React.Component {
    render() {
        const companies = this.props.companies;
        const start = (this.props.activePage-1)*this.props.itemsPerPage;
        const end = start+this.props.itemsPerPage;
        const rows = companies.slice(start,end).map((company) => {
            return (
                <TableRow company={company} key={company.id}/>
            );
        });
        return (
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>Total income</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        );
    }
}

export default MyTable;
