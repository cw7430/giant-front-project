import { Col, Container, Row, Table } from "react-bootstrap";

function SalaryListTable() {
    return (
        <Container>
            <Row>
                <Col>
                    <Table bordered hover>
                        <thead className="table-dark">
                            <tr>
                                <th>{"번호"}</th>
                                <th>{"사번"}</th>
                                <th>{"이름"}</th>
                                <th>{"출근일수"}</th>
                                <th>{"기본급여"}</th>
                                <th>{"성과급"}</th>
                                <th>{"최종급여"}</th>
                                <th>{"급여지급일"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{""}</td>
                                <td>{""}</td>
                                <td>{""}</td>
                                <td>{""}</td>
                                <td>{""}</td>
                                <td>{""}</td>
                                <td>{""}</td>
                                <td>{""}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default SalaryListTable;