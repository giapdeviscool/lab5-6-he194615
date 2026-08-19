import { Badge, Button, Col, Container, Nav, Row } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Form } from "react-bootstrap"
export const NavBar = ({ handleFilter }) => {

    return (
        <Container className="border rounded-4 p-4">
            <Nav className="d-flex gap-4">
                <Nav.Item>
                    Courses
                </Nav.Item>
                <Nav.Item>
                    Projects
                </Nav.Item>
                <Nav.Item>
                    Review
                </Nav.Item>
                <Nav.Item>
                    Title Confirmation
                </Nav.Item>
                <Nav.Item>
                    Reference
                </Nav.Item>
            </Nav>
        </Container>
    )
}
