import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import Pagination from 'react-js-pagination';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'; 
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import {
    VictoryTheme,
    VictoryChart,
    VictoryAxis,
    VictoryLine,
    VictoryLabel,
    VictoryScatter
} from 'victory';

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            companies: null,
            incomes: null,
            shownCompanies: null,
            inputValue: "",
            activePage: 1,
            itemsPerPage: 10,
            totalItemsCount: 0,
            startDate: null,
            endDate: null
        }
    }

    getDataFromApi() {
        let companies = null;
        const companiesIncomes = [];
        fetch("https://recruitment.hal.skygate.io/companies")
        .then(res => res.json())
        .then(data => {
            companies = data;
            let promises = []
            companies.forEach(company => {
                promises.push(
                    new Promise((resolve, reject) => {
                        fetch("https://recruitment.hal.skygate.io/incomes/"+company["id"])
                        .then(res => res.json())
                        .then(data => {
                           companiesIncomes.push(data);
                           resolve(true);
                        });
                    })
               );
            });
            return promises;
        })
        .then(promises => {
            Promise.all(promises)
            .then(() => {
                const totalIncomes = [];
                 companiesIncomes.forEach(compIncomes => {
                     const result = this.countTotalCompanyIncome(compIncomes);
                     totalIncomes.push(result);
                });
                let compWithTotalIncome = this.mergeArrayObjects(companies,
                                                          totalIncomes);
                compWithTotalIncome.sort(this.incomeSort);

                this.setState({companies: compWithTotalIncome,
                            shownCompanies: compWithTotalIncome,
                            incomes: companiesIncomes,
                            totalItemsCount: compWithTotalIncome.length});
            });
        });
       
    }

    mergeArrayObjects(arr1, arr2){
        let arr3 = arr1.map((item, i) => Object.assign({}, item, arr2[i]));
        return arr3;
    }

    findCompanyData(arr, id){
        let search_id = Number(id);
        let len = arr.length;
        for (let i=0; i < len; i++){
            if (arr[i]['id'] === search_id){
                return arr[i];
            }
        }
        return null; 
    }

    companyNameSearch(e){
        let newCompanyList = []
        if (this.state.companies != null){
            this.state.companies.forEach(company => {
                if (company.name.toLowerCase().includes(this.state.inputValue.toLowerCase())){
                    newCompanyList.push(company);
                }
            });
        }

        newCompanyList.sort(this.incomeSort);
        this.setState({shownCompanies: newCompanyList,
                       totalItemsCount: newCompanyList.length,
                       activePage:1});
    }

    incomeSort(a, b){
        if(a.total_income > b.total_income) return -1;
        if(a.total_income < b.total_income) return 1;
        return 0
    }

    countTotalCompanyIncome(incomes_data){
        let result = {"id": incomes_data["id"], "total_income": 0};
        incomes_data.incomes.forEach(income => {
            result["total_income"] += Number(income.value);
        });
        result.total_income = result.total_income.toFixed(2);
        return result;
    }

    updateInputValue(e){
        this.setState({inputValue: e.target.value});
    }

    updateStartDate(e){
        this.setState({startDate: e.target.value});
    }

    updateEndDate(e){
        this.setState({endDate: e.target.value});
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }


   componentDidMount(){
        this.getDataFromApi()
   }

   render() {
        return (
            <div className="main-div">
                <Switch>
                    <Route exact path='/'>
                        <MainPage  
                            companyNameSearch={e => this.companyNameSearch(e)}
                            updateInputValue={e => this.updateInputValue(e)}
                            companies={this.state.shownCompanies}
                            activePage={this.state.activePage}
                            itemsPerPage={this.state.itemsPerPage}
                            totalItemsCount={this.state.totalItemsCount}
                            handlePageChange={t => this.handlePageChange(t)}
                        />
                    </Route>
                    <Route exact path='/:id' render={({match}) => (
                        !this.state.incomes ? (<Loading/>) :
                            (
                            <CompanyPage
                                companyMainData = {this.findCompanyData(this.state.companies, match.params.id)}
                                companyIncomes = {this.findCompanyData(this.state.incomes, match.params.id)}
                                onChangeStartDate={e => this.updateStartDate(e)}
                                onChangeEndDate={e => this.updateEndDate(e)}
                                id = {match.params.id}
                                startDate = {this.state.startDate}
                                endDate = {this.state.endDate}
                            />
                            )
                     )}/>
                </Switch>
            </div>
        );
   }
}

class CompanyPage extends React.Component {

    dateSort(a, b){
        let aD = (new Date(a.date)).getDate();
        let bD = (new Date(b.date)).getDate();
        if (aD < bD) return -1;
        if (aD > bD) return 1;
        return 0;
    }

    getLastMonthIncomeList(incomes){
       let maxDate = new Date(incomes[0].date); 
       incomes.forEach(income => {
           let incomeDate = new Date(income.date);
           if(maxDate < incomeDate){
               maxDate = incomeDate;
            }
        });
        let lastMonthIncomeList = [];
        incomes.forEach(income => {
            let incomeDate = new Date(income.date);
            if((maxDate.getMonth() === incomeDate.getMonth())
               && (maxDate.getFullYear() === incomeDate.getFullYear())){
                lastMonthIncomeList.push({date: income.date,
                                          value: Number(income.value)
                });
            }
        });
        lastMonthIncomeList.sort(this.dateSort);
        return lastMonthIncomeList;
    }

    getLastMonthIncome(lastMonthIncomeList){
        let lastMonthIncome = 0;
        lastMonthIncomeList.forEach(income => {
            lastMonthIncome += Number(income.value);
        });
        return lastMonthIncome;
    }

    getDateBorderedIncome(incomes){ 
        let result = [];
        let start_d = null; 
        let end_d = null; 
        let income_d = null;
        if (this.props.startDate && this.props.endDate){
            start_d = new Date(this.props.startDate);
            end_d = new Date(this.props.endDate); 
            if (start_d >= end_d){
                return result; 
            }
            incomes.forEach(income => {
                income_d = new Date(income.date);
                if ((income_d >= start_d) && (income_d <= end_d)){
                    result.push(income);
                }
            });
        } else if(this.props.startDate){ 
            start_d = new Date(this.props.startDate);
            incomes.forEach(income => {
                income_d = new Date(income.date);
                if (income_d >= start_d){
                    result.push(income);
                }
            });
        } else if(this.props.endDate){
            end_d = new Date(this.props.endDate);
            incomes.forEach(income => {
                income_d = new Date(income.date);
                if (income_d <= end_d){
                    result.push(income);
                }
            });
        } else {
            result = incomes;
        }
        return result;
    }

    getTotalCompanyIncome(incomes){
        if (incomes.length === 0){
            return 0;
        }
        let totalIncome = 0;
        incomes.forEach(income => {
            totalIncome += Number(income.value);
        });
        return totalIncome.toFixed(2);
    }

    getAvarageCompanyIncome(incomes){
        if (incomes.length === 0){
            return 0;
        }
        return (this.getTotalCompanyIncome(incomes)/incomes.length).toFixed(2);
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
                        {this.getTotalCompanyIncome(this.getDateBorderedIncome(this.props.companyIncomes.incomes))}
                    </span>
                    <span>
                        <strong>LAST MONTH INCOME</strong>:{' '}
                        {this.getLastMonthIncome(this.getLastMonthIncomeList(this.props.companyIncomes.incomes))}
                    </span>
                    <span>
                        <strong>AVARAGE INCOME</strong>:{' '}
                        {this.getAvarageCompanyIncome(this.getDateBorderedIncome(this.props.companyIncomes.incomes))}
                    </span>
                    <InputDate 
                        onChangeStartDate={this.props.onChangeStartDate}
                        onChangeEndDate={this.props.onChangeEndDate}
                    />
                </Col>
                <Col lg={6} sm={12} style={{ diplay: "flex", flexWrap: "wrap", width:"350px"}}>
                    <MyChart companyIncomeList={this.getLastMonthIncomeList(this.props.companyIncomes.incomes)}/>
                </Col>
            </Row>
            </Container>);
    }
}

class MyChart extends React.Component {

    getUniqueDaysIncomeList(lastMonthIncomeList){
        let obj = {};
        for (let i=0; i < lastMonthIncomeList.length; i++){
            let day = (new Date(lastMonthIncomeList[i]["date"])).getDate()
            if(!obj.hasOwnProperty(day)){
                obj[day] = 0;
            } 
            obj[day] += lastMonthIncomeList[i]["value"];
        }
        let arr = [];
        for (let key in obj) {
            let tempObj = {}
            tempObj["date"] = key;
            tempObj["value"] = obj[key];
            arr.push(tempObj);
        }
        return arr;
    }

    render() {
        let uniqueDaysIncomeList = this.getUniqueDaysIncomeList(this.props.companyIncomeList);
        let maxValue = Math.ceil(Math.max.apply(Math, uniqueDaysIncomeList.map(function(o) { return o.value; })))+2000;
        console.log("adsfdas", maxValue);
        return (
            <VictoryChart 
                padding={100}
                maxDomain={{ y: maxValue}}
                minDomain={{ y: 0 }}
                style={{ parent: { maxWidth:"100%" }}}
                theme={VictoryTheme.material}
            >
                <VictoryLabel
                    text="Last Month Income Graph" 
                    x={180} y={50} textAnchor="middle"
                /> 
                <VictoryLabel
                    text="Incomes" 
                    x={90} y={85} textAnchor="middle"
                /> 
                <VictoryLabel
                    text="Days" 
                    x={175} y={290} textAnchor="middle"
                />
                <VictoryAxis
                    tickFormat={(x) => x}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(y) => y}
                />
                <VictoryLine
                    data={uniqueDaysIncomeList} 
                    x="date"
                    y="value"
                /> 

                <VictoryScatter
                    style={{data: {fill: "#c43a31"} }}
                    size={4}
                    data={this.getUniqueDaysIncomeList(this.props.companyIncomeList)}
                    x="date"
                    y="value"
                />
            </VictoryChart>
        );
    }
}

class Loading extends React.Component {
    render(){
        return(
            <Row>
                <Col style={{padding:"20px", textAlign: "center"}}>
                    Loading...
                </Col>
            </Row>
        );
    }
}

class InputDate extends React.Component {
    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Row>
                        <Form.Label lg={-1} column="lg">
                            start date:
                        </Form.Label>
                        <Col>
                            <Form.Control
                                onChange={this.props.onChangeStartDate}
                                type="date"
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label lg={-1} column="lg" >end date: </Form.Label>
                        <Col>
                            <Form.Control
                                onChange={this.props.onChangeEndDate}
                                type="date"
                            />
                        </Col>
                    </Form.Row>
                </Form.Group>
            </Form>
        );
   }
}

class MainPage extends React.Component {
    render() {
        return(
            <Container>
                {!this.props.companies ? (<Loading/>) : 
                    (<Fragment>
                        <Row style={{padding: "5px 0px 0px 0px"}}>
                            <Col>
                                <Input 
                                    onClick={e => this.props.companyNameSearch(e)}
                                    onChange={e => this.props.updateInputValue(e)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MyTable 
                                   companies={this.props.companies}
                                   activePage={this.props.activePage}
                                   itemsPerPage={this.props.itemsPerPage}
                                /> 
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{display:"flex", justifyContent:"center"}}>
                                <Pagination 
                                    activePage={this.props.activePage}
                                    itemsCountPerPage={this.props.itemsPerPage}
                                    totalItemsCount={this.props.totalItemsCount}
                                    pageRangeDisplayed={5}
                                    onChange={this.props.handlePageChange.bind(this)}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </Col>
                        </Row>
                    </Fragment>)
                }
            </Container>
        );
    }
}

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

class Input extends React.Component {
    render() {
        return(
            <Form>
                <Form.Group>
                    <Form.Row>
                        <Col lg={3} style={{margin: "5px 0px 0px 0px"}}>
                            <Form.Control 
                                type="text"
                                onChange={this.props.onChange}
                                id="comp-name-field" 
                                placeholder="Enter company name"
                            />
                        </Col>
                        <Col lg={2} style={{margin: "5px 0px 0px 0px"}}>
                            <Button onClick={this.props.onClick}>Search</Button>
                        </Col>
                      </Form.Row>
                </Form.Group>
            </Form>
        );
    } 
}

ReactDOM.render(<Router><App /></Router>, document.getElementById("root"));
