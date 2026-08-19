import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api";

export const CourseListPage = () => {
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchCourses = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/courses");
            setCourses(response.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Failed to load courses. Please make sure mock API is running on port 9999.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get unique semesters for dropdown options
    const semesters = Array.from(new Set(courses.map((c) => c.semester).filter(Boolean)));

    // Filter courses based on search query and selected semester
    const filteredCourses = courses.filter((course) => {
        const matchesSemester = selectedSemester ? course.semester === selectedSemester : true;
        
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
            !q ||
            (course.code && course.code.toLowerCase().includes(q)) ||
            (course.nameEn && course.nameEn.toLowerCase().includes(q)) ||
            (course.nameVi && course.nameVi.toLowerCase().includes(q));

        return matchesSemester && matchesSearch;
    });

    return (
        <Container fluid className="px-4">
            <Row className="mb-2">
                <Col>
                    <p className="text-muted mb-1">Welcome back, Lecturer</p>
                    <h2 className="fw-bold mb-3">My Courses</h2>
                </Col>
            </Row>

            <Row className="mb-4 align-items-center g-2">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search course by code or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                        <option value="">All Semesters</option>
                        {semesters.map((sem) => (
                            <option key={sem} value={sem}>
                                {sem}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={3} className="d-flex align-items-center gap-2">
                    <Button variant="primary" onClick={fetchCourses} disabled={loading}>
                        {loading ? "Refreshing..." : "Refresh"}
                    </Button>
                </Col>
            </Row>

            {error && (
                <Row className="mb-3">
                    <Col>
                        <div className="alert alert-danger">{error}</div>
                    </Col>
                </Row>
            )}

            <Row className="mb-3">
                <Col>
                    <p className="text-muted fw-bold">
                        {filteredCourses.length} courses
                    </p>
                </Col>
            </Row>

            <Row className="g-3">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <Col key={course.id} xs={12} sm={6} md={4} lg={3}>
                            <Card 
                                className="h-100 shadow-sm border"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/detail/${course.id}`)}
                            >
                                <Card.Body className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Badge bg="secondary" className="px-2 py-1">
                                            {course.badge || course.code}
                                        </Badge>
                                        <Badge bg={course.category === "TECH" ? "info" : "dark"}>
                                            {course.category}
                                        </Badge>
                                    </div>
                                    <Card.Title className="fs-5 fw-bold text-primary mb-1">
                                        {course.code}
                                    </Card.Title>
                                    <Card.Text className="fw-semibold mb-1 text-dark">
                                        {course.nameEn}
                                    </Card.Text>
                                    <Card.Text className="text-muted small mb-3 flex-grow-1">
                                        {course.nameVi}
                                    </Card.Text>
                                    <div>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/detail/${course.id}`);
                                            }}
                                        >
                                            Get started
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p className="text-muted">No courses found matching your criteria.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};
