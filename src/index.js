import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import CompanyPage from './company_page.js';
import MainPage from './main_page.js';
import Loading from './loading.js';

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            companies: null,
            incomes: null,
            inputValue: "",
            shownCompanies: null
        }
    }

    getDataFromApi(){
        const companiesPromises = this.getAllCompanies("https://recruitment.hal.skygate.io/companies");
        return (
            companiesPromises.then(comp => {
                const companiesIncomes = this.getCompaniesIncomes("https://recruitment.hal.skygate.io/incomes/", comp);
                this.setState({companies: comp});
                return companiesIncomes;
            }).then(companiesIncomes => { 
                this.setState({incomes: companiesIncomes});
            })
        );
    }

    getAllCompanies(url){
        return fetch(url).then(res => res.json());
    }

    getCompaniesIncomes(url, companies){
        return Promise.all(companies.map(company => {
                                            return fetch(url+company["id"])
                                                   .then(res => res.json())
                                         }));
    }

    updateInputValue(e){
        this.setState({inputValue: e.target.value});
    }

    updateShownCompaniesList(newCompanyList){
        this.setState({shownCompanies: newCompanyList});
    }

    componentDidMount(){
        this.getDataFromApi();
    }

   render() {
        return (
            <div className="main-div">
                <Switch>
                    <Route exact path='/' render={({match}) => (
                        !this.state.incomes ? (<Loading/>) :
                            (
                            <MainPage  
                                companies={this.state.companies}
                                incomes={this.state.incomes}
                                updateInputValue={e => this.updateInputValue(e)}
                                inputValue={this.state.inputValue}
                                updateShownCompaniesList={newCompaniesList => this.updateShownCompaniesList(newCompaniesList)}
                                shownCompanies={this.state.shownCompanies}
                            />
                            )
                    )}/>
                    <Route exact path='/:id' render={({match}) => (
                        !this.state.incomes ? (<Loading/>) :
                            (
                            <CompanyPage
                                companyMainData={this.state.companies.find(o => Number(o['id']) === Number(match.params.id))}
                                companyIncomes={this.state.incomes.find(o => Number(o['id']) === Number(match.params.id))}
                                id={match.params.id}
                            />
                            )
                     )}/>
                </Switch>
            </div>
        );
   }
}

ReactDOM.render(<Router><App /></Router>, document.getElementById("root"));
