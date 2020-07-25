import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class Input extends React.Component {

    companyNameSearch(){
        if (this.props.companies != null){
            const newCompanyList = this.props.companies.filter(company => {
                                                                return (company.name.toLowerCase()
                                                                       .includes(this.props.inputValue.toLowerCase()))
                                                              });
            newCompanyList.sort(this.props.incomeSort);
            this.props.updateShownCompaniesList(newCompanyList);
        }
    }

    render() {
        return(
            <Form>
                <Form.Group>
                    <Form.Row>
                        <Col lg={3} style={{margin: "5px 0px 0px 0px"}}>
                            <Form.Control 
                                type="text"
                                onChange={this.props.onChange}
                                defaultValue={this.props.inputValue}
                                id="comp-name-field" 
                                placeholder="Enter company name"
                            />
                        </Col>
                        <Col lg={2} style={{margin: "5px 0px 0px 0px"}}>
                            <Button onClick={() => this.companyNameSearch()}>Search</Button>
                        </Col>
                      </Form.Row>
                </Form.Group>
            </Form>
        );
    } 
}

export default Input;
