import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

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

export default InputDate;
