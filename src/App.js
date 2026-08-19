import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Stack } from "react-bootstrap";
import { NavBar } from "./components/NavBar";
import { CourseListPage } from "./components/CourseListPage";
import { CourseDetailPage } from "./components/CourseDetailPage";

function App() {
    return (
        <Container fluid className="p-3">
            <Stack gap={3}>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Navigate to="/courses" replace />} />
                    <Route path="/courses" element={<CourseListPage />} />
                    <Route path="/detail/:id" element={<CourseDetailPage />} />
                    <Route path="*" element={<Navigate to="/courses" replace />} />
                </Routes>
            </Stack>
        </Container>
    );
}

export default App;