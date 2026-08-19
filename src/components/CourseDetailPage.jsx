import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Button, Badge, Card, ListGroup, Alert } from "react-bootstrap";
import api from "../api";

export const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [activeClassId, setActiveClassId] = useState(null);
    const [activeSlotNumber, setActiveSlotNumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [validationError, setValidationError] = useState("");

    const fetchCourseDetail = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get(`/courses/${id}`);
            const data = response.data;
            setCourse(data);

            if (data.classes && data.classes.length > 0) {
                const firstClass = data.classes[0];
                setActiveClassId(firstClass.classId || firstClass.name);
                if (firstClass.slots && firstClass.slots.length > 0) {
                    setActiveSlotNumber(firstClass.slots[0].slotNumber);
                } else {
                    setActiveSlotNumber(null);
                }
            }
        } catch (err) {
            console.error("Error fetching course detail:", err);
            setError("Failed to load course details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return (
            <Container fluid className="px-4 py-3">
                <p className="text-muted">Loading course detail...</p>
            </Container>
        );
    }

    if (error || !course) {
        return (
            <Container fluid className="px-4 py-3">
                <Alert variant="danger">{error || "Course not found."}</Alert>
                <Button variant="secondary" onClick={() => navigate("/courses")}>
                    Back to Courses
                </Button>
            </Container>
        );
    }

    // Active class object
    const activeClass = course.classes?.find(
        (c) => (c.classId || c.name) === activeClassId
    ) || course.classes?.[0];

    // Active slot object
    const activeSlot = activeClass?.slots?.find(
        (s) => s.slotNumber === activeSlotNumber
    ) || activeClass?.slots?.[0];

    // Helper: Handle switching class
    const handleSelectClass = (cls) => {
        const clsId = cls.classId || cls.name;
        setActiveClassId(clsId);
        setValidationError("");
        if (cls.slots && cls.slots.length > 0) {
            setActiveSlotNumber(cls.slots[0].slotNumber);
        } else {
            setActiveSlotNumber(null);
        }
    };

    // Helper: Check if slot date is in present or future
    const isSlotInPresentOrFuture = (dateStr) => {
        if (!dateStr) return false;
        const parts = dateStr.split("/");
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);

            const slotDate = new Date(year, month, day, 23, 59, 59);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return slotDate >= today;
        }
        return false;
    };

    // Helper: Toggle Class Status (OPEN / CLOSED or active / inactive)
    const handleToggleStatus = async () => {
        if (!activeClass) return;
        setValidationError("");

        const currentStatus = (activeClass.status || "active").toLowerCase();
        const isCurrentlyOpen = currentStatus === "active" || currentStatus === "open";

        // Validation rule: If class has any slots scheduled in present or future,
        // system MUST NOT allow changing status to Closed and must display error message
        if (isCurrentlyOpen) {
            const hasPresentOrFutureSlots = activeClass.slots?.some((slot) =>
                isSlotInPresentOrFuture(slot.date)
            );

            if (hasPresentOrFutureSlots) {
                setValidationError(
                    "Cannot close class: All slots must be completed in the past. Slots in present/future still exist."
                );
                return;
            }
        }

        // Toggle status
        const newStatus = isCurrentlyOpen ? "inactive" : "active";

        const updatedClasses = course.classes.map((c) => {
            if ((c.classId || c.name) === (activeClass.classId || activeClass.name)) {
                return { ...c, status: newStatus };
            }
            return c;
        });

        const updatedCourse = { ...course, classes: updatedClasses };

        try {
            await api.put(`/courses/${id}`, updatedCourse);
            setCourse(updatedCourse);
        } catch (err) {
            console.error("Error updating status:", err);
            setValidationError("Failed to update status on server.");
        }
    };

    // Helper: Delete questions from selected slot / active class
    const handleDeleteQuestions = async () => {
        if (!activeClass || !activeSlot) return;

        const confirmDelete = window.confirm(
            "Are you sure you want to delete questions/assignments for this slot?"
        );
        if (!confirmDelete) return;

        const updatedSlots = activeClass.slots.map((s) => {
            if (s.slotNumber === activeSlot.slotNumber) {
                const copy = { ...s };
                if (copy.questions) copy.questions = [];
                if (copy.assignments) copy.assignments = [];
                if (copy.content) copy.content = "No content available";
                return copy;
            }
            return s;
        });

        const updatedClasses = course.classes.map((c) => {
            if ((c.classId || c.name) === (activeClass.classId || activeClass.name)) {
                return { ...c, slots: updatedSlots };
            }
            return c;
        });

        const updatedCourse = { ...course, classes: updatedClasses };

        try {
            await api.put(`/courses/${id}`, updatedCourse);
            setCourse(updatedCourse);
        } catch (err) {
            console.error("Error deleting questions:", err);
            setValidationError("Failed to delete questions on server.");
        }
    };

    const isClassOpen =
        (activeClass?.status || "active").toLowerCase() === "active" ||
        (activeClass?.status || "active").toLowerCase() === "open";

    // Combine questions and assignments list for selected slot
    const slotQuestions = activeSlot
        ? activeSlot.questions || activeSlot.assignments || []
        : [];

    return (
        <Container fluid className="px-4">
            {/* Breadcrumb */}
            <Row className="mb-2">
                <Col>
                    <div className="text-muted small">
                        <Link to="/courses" className="text-decoration-none text-secondary">
                            My Courses
                        </Link>{" "}
                        &gt; {course.nameEn}
                    </div>
                </Col>
            </Row>

            {/* Course Title Header */}
            <Row className="mb-3 align-items-center">
                <Col md={8}>
                    <h3 className="fw-bold mb-1">
                        {course.nameEn}_{course.nameVi}
                    </h3>
                    <div className="d-flex align-items-center gap-2 text-muted">
                        <Badge bg="secondary">{course.code}</Badge>
                        <span>Class: <strong>{activeClass?.name || activeClass?.classId}</strong></span>
                        <Badge bg={isClassOpen ? "success" : "danger"}>
                            {isClassOpen ? "OPEN" : "CLOSED"}
                        </Badge>
                    </div>
                </Col>
                <Col md={4} className="d-flex justify-content-end gap-2 mt-2 mt-md-0">
                    <Button variant="secondary" size="sm" onClick={() => navigate("/courses")}>
                        Back
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleDeleteQuestions}>
                        Delete questions
                    </Button>
                    <Button
                        variant={isClassOpen ? "warning" : "success"}
                        size="sm"
                        onClick={handleToggleStatus}
                    >
                        {isClassOpen ? "Close Class" : "Open Class"}
                    </Button>
                </Col>
            </Row>

            {/* Validation Error Alert */}
            {validationError && (
                <Row className="mb-3">
                    <Col>
                        <Alert
                            variant="danger"
                            dismissible
                            onClose={() => setValidationError("")}
                        >
                            {validationError}
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Main Content Layout */}
            <Row className="g-3">
                {/* Left Sidebar: Classes & Slots */}
                <Col md={4} lg={3}>
                    {/* Classes Section */}
                    <Card className="mb-3 border">
                        <Card.Header className="fw-bold bg-light">Classes</Card.Header>
                        <ListGroup variant="flush">
                            {course.classes?.map((cls) => {
                                const clsId = cls.classId || cls.name;
                                const isSelected = clsId === (activeClass?.classId || activeClass?.name);
                                return (
                                    <ListGroup.Item
                                        key={clsId}
                                        action
                                        active={isSelected}
                                        onClick={() => handleSelectClass(cls)}
                                        className="d-flex justify-content-between align-items-center"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <span>• {cls.name || cls.classId}</span>
                                        <Badge
                                            bg={
                                                (cls.status || "active").toLowerCase() === "active" ||
                                                (cls.status || "active").toLowerCase() === "open"
                                                    ? "success"
                                                    : "secondary"
                                            }
                                            pill
                                        >
                                            {cls.status || "active"}
                                        </Badge>
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    </Card>

                    {/* Slots Section */}
                    <Card className="border">
                        <Card.Header className="fw-bold bg-light">Slots</Card.Header>
                        <ListGroup variant="flush" style={{ maxHeight: "350px", overflowY: "auto" }}>
                            {activeClass?.slots && activeClass.slots.length > 0 ? (
                                activeClass.slots.map((slot) => {
                                    const isSelected = slot.slotNumber === activeSlotNumber;
                                    return (
                                        <ListGroup.Item
                                            key={slot.slotNumber}
                                            action
                                            active={isSelected}
                                            onClick={() => setActiveSlotNumber(slot.slotNumber)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="fw-bold">
                                                Slot {slot.slotNumber}
                                            </div>
                                            <div className="small text-muted">
                                                {slot.date} {slot.time && `(${slot.time})`}
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })
                            ) : (
                                <ListGroup.Item className="text-muted small">
                                    No slots available for this class.
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>

                {/* Right Area: Class Sessions Content */}
                <Col md={8} lg={9}>
                    <Card className="border p-3">
                        <h4 className="fw-bold mb-3">Class sessions</h4>

                        {activeSlot ? (
                            <div>
                                <div className="p-3 bg-light border rounded mb-3">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <Badge bg="primary" className="fs-6 px-3 py-2">
                                            {activeSlot.slotNumber}
                                        </Badge>
                                        <h5 className="mb-0 fw-bold">{activeSlot.title}</h5>
                                    </div>
                                    <p className="text-muted mb-1">
                                        <strong>Date & Time:</strong> {activeSlot.date} {activeSlot.time}
                                    </p>
                                    
                                    {/* Slot status display */}
                                    <div className="mt-2 small text-secondary">
                                        {!isSlotInPresentOrFuture(activeSlot.date) ? (
                                            <span className="text-success fw-bold">
                                                ✓ Constructive slot check (Slot has expired)
                                            </span>
                                        ) : (
                                            <span className="text-info fw-bold">
                                                Upcoming / In-progress slot
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h5 className="fw-bold mb-2">Questions / Assignments</h5>
                                {slotQuestions.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {slotQuestions.map((q, idx) => (
                                            <ListGroup.Item key={idx} className="border-bottom py-2">
                                                {q}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : activeSlot.content ? (
                                    <p className="text-muted">{activeSlot.content}</p>
                                ) : (
                                    <p className="text-muted italic">
                                        No questions or assignments for this slot.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-muted">Please select a class and slot to view details.</p>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
