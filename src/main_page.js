import React, {Fragment} from 'react';
import Pagination from 'react-js-pagination';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import MyTable from './my_table.js';
import Input from './input.js';
import Loading from './loading.js';

class MainPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            companiesWithTotalIncome: null,
            inputValue: "",
            activePage: 1,
            itemsPerPage: 10,
            totalItemsCount: 0,
        }
    }

    getCompaniseTotalIncome(companiesIncomes){
        return companiesIncomes.map(compIncomes => this.countTotalCompanyIncome(compIncomes));
    }

    mergeArrayObjects(arr1, arr2){
        const arr3 = arr1.map((item, i) => Object.assign({}, item, arr2[i]));
        return arr3;
    }

    incomeSort(a, b){
        if(a.total_income > b.total_income) return -1;
        if(a.total_income < b.total_income) return 1;
        return 0
    }

    countTotalCompanyIncome(incomes_data){
        const result = {"id": incomes_data["id"], "total_income": 0};
        result["total_income"] = incomes_data.incomes
                                .map((income) => Number(income.value))
                                .reduce((firstIncome, secondIncome) => firstIncome + secondIncome);
        result.total_income = result.total_income.toFixed(2);
        return result;
    }
 
    componentDidMount(){
        const companiesWithTotalIncome = this.mergeArrayObjects(this.props.companies,
                                                                this.getCompaniseTotalIncome(this.props.incomes));
        companiesWithTotalIncome.sort(this.incomeSort);
        this.setState({companiesWithTotalIncome:companiesWithTotalIncome,
                      totalItemsCount:companiesWithTotalIncome.length});
        if (!this.props.shownCompanies){
            this.props.updateShownCompaniesList(companiesWithTotalIncome);
        }
    }

    updateShownCompaniesList(newCompanyList){
        this.props.updateShownCompaniesList(newCompanyList);
        this.setState({totalItemsCount: newCompanyList.length, activePage:1});
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }

    render() {
        return(
            <Container>
                    <Fragment>
                        <Row style={{padding: "5px 0px 0px 0px"}}>
                            <Col>
                                <Input 
                                    onChange={e => this.props.updateInputValue(e)}
                                    updateShownCompaniesList={newCompanyList => this.updateShownCompaniesList(newCompanyList)}
                                    companies={this.state.companiesWithTotalIncome}
                                    incomeSort={this.incomeSort}
                                    inputValue={this.props.inputValue}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {!this.props.shownCompanies ? (<Loading/>) :
                                (<MyTable 
                                   companies={this.props.shownCompanies}
                                   activePage={this.state.activePage}
                                   itemsPerPage={this.state.itemsPerPage}
                                />)}
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{display:"flex", justifyContent:"center"}}>
                                <Pagination 
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={this.state.itemsPerPage}
                                    totalItemsCount={this.state.totalItemsCount}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange.bind(this)}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </Col>
                        </Row>
                    </Fragment>
            </Container>
        );
    }
}

export default MainPage;
