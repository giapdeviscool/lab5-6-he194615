import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { useState } from "react";

export const FilterName = ({ handleFilter }) => {
    const [inputVal, setInputVal] = useState("");

    const handleChange = (e) => {
        const val = e.target.value;
        setInputVal(val);
        if (handleFilter) handleFilter({ input: val });
    };

    const handleReset = () => {
        setInputVal("");
        if (handleFilter) handleFilter({ input: "" });
    };

    return (
        <Container className="">
            <Row>
                <p>Welcomeback Lecturer</p>
            </Row>
            <Row className="mt-2 mb-2">
                <h1>My Courses</h1>
            </Row>
            <Row>
                <Col md={7}>
                    <Form>
                        <Form.Control
                            placeholder="Search Course"
                            value={inputVal}
                            onChange={handleChange}
                        />
                    </Form>
                </Col>
                <Col md={3}>
                    <Form.Select onChange={(e) => {}}>
                        <option value="">Summer 2026</option>
                        <option value="ACTIVE">Spring 2026</option>
                        <option value="INACTIVE">Fall 2026</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Button variant="secondary" onClick={handleReset}>Reset</Button>
                </Col>
            </Row>
        </Container>
    );
};
