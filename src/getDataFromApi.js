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
