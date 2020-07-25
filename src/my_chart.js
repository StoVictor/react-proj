import React from 'react';
import {
    VictoryTheme,
    VictoryChart,
    VictoryAxis,
    VictoryLine,
    VictoryLabel,
    VictoryScatter
} from 'victory';

class MyChart extends React.Component {

    getUniqueDaysIncomeList(lastMonthIncomeList){
        const uniqueDaysIncomeDict = {};
        lastMonthIncomeList.forEach(income => {
            const day = new Date(income.date).getDate();
            const incomeValue = Number(income.value);
            uniqueDaysIncomeDict[day] = uniqueDaysIncomeDict.hasOwnProperty(day) ? uniqueDaysIncomeDict[day]+incomeValue : incomeValue;
        });

        const uniqueDaysIncomeList = [];
        for (let key in uniqueDaysIncomeDict) {
            uniqueDaysIncomeList.push({"date": key, "value": uniqueDaysIncomeDict[key]});
        }
        return uniqueDaysIncomeList;
    }

    render() {
        const uniqueDaysIncomeList = this.getUniqueDaysIncomeList(this.props.companyIncomeList);
        const additionalChartYOffset = 2000;
        const maxValue = Math.ceil(Math.max.apply(Math, uniqueDaysIncomeList.map(o => o.value)))+additionalChartYOffset;
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

export default MyChart;
