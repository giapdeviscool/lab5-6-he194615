import { Badge, Button, Col, Container, Row } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Form } from "react-bootstrap"
export const FilterName = ({ handleFilter }) => {
    // const [searchParams, setSearchParams] = useSearchParams();
    return (
        <Container className="">
            <Row>
                <p>Welcomeback Lecturer</p>
            </Row>
            <Row className="mt-2 mb-2">
                <h1>My Courses</h1>
            </Row>
            <Row>
                <Col md={8}>
                    <Form>
                        <Form.Control placeholder="Search Course" onChange={(e) => {
                            handleFilter({ input: e.target.value })
                        }} />
                    </Form>
                </Col>
                <Col md={2}>
                    <Form.Select onChange={(e) => {
                        // setSearchParams({
                        //     semester: e.target.value
                        // })
                    }}>
                        <option value="">Summer 2026</option>
                        <option value="ACTIVE">Spring 2026</option>
                        <option value="INACTIVE">Fall 2026</option>
                    </Form.Select>
                </Col>
                {/* <Col md={2}>
                    <Button onClick={handleFilter({ input: '' })}>Reset</Button>
                </Col> */}
            </Row>

        </Container>
    )
}
