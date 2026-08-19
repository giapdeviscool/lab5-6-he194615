import { Container, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Container fluid className="border rounded p-3 mb-3 bg-light">
            <Nav variant="pills" activeKey={location.pathname.startsWith('/courses') || location.pathname.startsWith('/detail') ? '/courses' : ''}>
                <Nav.Item>
                    <Nav.Link onClick={() => navigate('/courses')} eventKey="/courses">
                        Courses
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link disabled eventKey="/projects">
                        Projects
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link disabled eventKey="/review">
                        Review
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link disabled eventKey="/title-confirmation">
                        Title Confirmation
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link disabled eventKey="/reference">
                        Reference
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Container>
    );
};
