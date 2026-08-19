import { useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import api from "./api";
import { CourseListPage, ProjectList } from "./components/CourseListPage";
import { FilterName } from "./components/FilterName";
import { NavBar } from "./components/NavBar";
function App() {
    const [courses, setCourses] = useState([]);
    const [filter, setFilter] = useState({
        input: ''
    })

    const handleFilter = (op) => {
        setFilter(prev => ({
            ...prev, ...op
        }))
    }
    useEffect(() => {
        const fetchP = async () => {
            const data = await api.get('/courses');
            setCourses(data.data);
        };
        fetchP();
    }, [])
    return (
        <Container fluid>
            <Stack gap={3} className="p-4">
                <NavBar />
                <FilterName handleFilter={handleFilter} />
                <CourseListPage courses={courses} filter={filter} />
            </Stack>
        </Container>
    )
}

export default App;