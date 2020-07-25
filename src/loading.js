import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

export default Loading;
