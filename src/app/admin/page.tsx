"use client";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import "@/styles/admin.home.scss";
import DashBoard from "@/components/admin/admin.dashboard";

const AdminPage = () => {
  return (
    <>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row className="admin-content">
          <Col className="sidebar">
            <Nav variant="pills" className="flex-column sidebar-nav">
              <Nav.Item>
                <Nav.Link eventKey="first">Tổng quan</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Quản lý sản phẩm</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Quản lý tài khoản</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fourth">Quản lý đơn hàng</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fifth">Quản lý bình luận</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col className="content">
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <DashBoard />
              </Tab.Pane>
              <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
              <Tab.Pane eventKey="third">Second tab content</Tab.Pane>
              <Tab.Pane eventKey="fourth">Second tab content</Tab.Pane>
              <Tab.Pane eventKey="fifth">Second tab content</Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};

export default AdminPage;
