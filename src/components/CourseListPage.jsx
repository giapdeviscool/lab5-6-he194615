import { Badge, Button, Col, Container, Row } from "react-bootstrap"
import { Card } from "react-bootstrap"
export const CourseListPage = ({ courses, filter }) => {

    const filterCourse = courses.filter(course => {
        if (filter.input === '') return course;
        return course.code.toLowerCase().includes(filter.input.toLowerCase()) || course.nameEn.toLowerCase().includes(filter.input.toLowerCase()) || course.nameVi.toLowerCase().includes(filter.input.toLowerCase());
    })

    return (
        <Container>
            <Row>
                <p>showing {filterCourse.length} of {courses.length} subjects</p>
                {filterCourse.map(course => {
                    return (
                        <Col md={3}>
                            <Card className="p-4">
                                <Card.Title>
                                    <Row className="d-flex">
                                        <Col md={6}>
                                            {course.code.toUpperCase().slice(0, 2)}
                                        </Col>
                                        <Col md={6} className="">
                                            {course.category}
                                        </Col>
                                    </Row>
                                </Card.Title>
                                <hr></hr>
                                <Card.Title>{course.code}</Card.Title>
                                <Card.Text>{course.nameEn}</Card.Text>
                                <Card.Text>{course.nameVi}</Card.Text>
                                <Row className="d-flex">
                                    <Col md={6} className="d-flex justify-content-center align-items-center">
                                        <Button className="text-nowrap" size="sm" onClick={() => { }}>Get Started</Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    )
                })}
            </Row>

        </Container>
    )
}
