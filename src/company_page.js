import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import MyChart from './my_chart.js';
import InputDate from './input_date.js';


class CompanyPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            startDate: null,
            endDate: null
        }
    }

    getMaxYearMonthDate(incomes){
        return incomes
               .map((income) => new Date(new Date(income.date).getFullYear(), new Date(income.date).getMonth()))
               .reduce((firstDate, secondDate) => firstDate < secondDate ? secondDate : firstDate);
    }

    getDateBorderedIncome(incomes, start_date, end_date){
        if ((start_date != null) && (end_date != null)){
            if (start_date > end_date){
                return [];
            }
            return incomes.filter(o => new Date(o.date) > start_date && new Date(o.date) < end_date);
        } else if (start_date != null){
            return incomes.filter(o => new Date(o.date) > start_date);
        } else if (end_date != null) { 
            return incomes.filter(o => new Date(o.date) < end_date);
        }
        return incomes;
    }

    getTotalCompanyIncome(incomes){
        return incomes.length === 0 ? 0 : incomes.map(income => Number(income.value))
                                                 .reduce((firstIncome, secondIncome) => firstIncome + secondIncome)
                                                 .toFixed(2);
    }

    getAvarageCompanyIncome(incomes){
        return incomes.length === 0 ? 0 : (this.getTotalCompanyIncome(incomes)/incomes.length).toFixed(2);
    }

    updateStartDate(e){
        this.setState({startDate: new Date(e.target.value)});
    }

    updateEndDate(e){
        this.setState({endDate: new Date(e.target.value)});
    }

    render() {
        return (<Container>
            <Row>
                <Col
                    lg={6} sm={12}
                    style={{display:"flex",
                            flexDirection:"column",
                            justifyContent:"center",
                            padding:"10px 10px 10px 10px",
                            fontSize:"18px",
                            fontFamily:'Lato, sans-serif'}}
                >
                    <span>
                        <strong>ID</strong>:{' '}
                        {this.props.companyMainData.id}
                    </span>
                    <span>
                        <strong>NAME</strong>:{' '} 
                        {this.props.companyMainData.name}
                    </span>
                    <span>
                        <strong>CITY</strong>:{' '}
                        {this.props.companyMainData.city}
                    </span>
                    <span>
                        <strong>TOTAL INCOME</strong>:{' '}
                        {this.getTotalCompanyIncome(this.getDateBorderedIncome(this.props.companyIncomes.incomes, 
                                                                               this.state.startDate, this.state.endDate))}
                    </span>
                    <span>
                        <strong>LAST MONTH INCOME</strong>:{' '}
                        {this.getTotalCompanyIncome(this.getDateBorderedIncome(this.props.companyIncomes.incomes, 
                                                                               this.getMaxYearMonthDate(this.props.companyIncomes.incomes),
                                                                               null))}
                    </span>
                    <span>
                        <strong>AVARAGE INCOME</strong>:{' '}
                        {this.getAvarageCompanyIncome(this.getDateBorderedIncome(this.props.companyIncomes.incomes,
                                                                                 this.state.startDate, this.state.endDate))}
                    </span>
                    <InputDate 
                        onChangeStartDate={e => this.updateStartDate(e)}
                        onChangeEndDate={e => this.updateEndDate(e)}
                    />
                </Col>
                <Col lg={6} sm={12} style={{ diplay: "flex", flexWrap: "wrap", width:"350px"}}>
                    <MyChart companyIncomeList={this.getDateBorderedIncome(this.props.companyIncomes.incomes, 
                                                                           this.getMaxYearMonthDate(this.props.companyIncomes.incomes),
                                                                           null)}/>

                </Col>
            </Row>
            </Container>);
    }
}

export default CompanyPage;
