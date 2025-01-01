import { Col, Container, Row, Table } from "react-bootstrap";

function AttandanceListTable() {
    return (
        <Container>
            <Row>
                <Col>
                    <Table bordered hover>
                        <thead className="table-dark">
                            <tr>
                                <th>{"사번"}</th>
                                <th>{"이름"}</th>
                                <th>{"날짜"}</th>
                                <th>{"출근시간"}</th>
                                <th>{"퇴근시간"}</th>
                                <th>{"근태상태"}</th>
                                <th>{"비고"}</th>
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
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default AttandanceListTable;
