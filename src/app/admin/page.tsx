"use client";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import DashBoard from "@/components/admin/admin.dashboard";
import AdminProducts from "@/components/admin/admin.products";
import { useEffect, useState } from "react";
import { getToken, getUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import "@/styles/admin.home.scss";

import AdminOrder from "@/components/admin/admin.order";
import AdminComment from "@/components/admin/admin.comment";
import AdminAccount from "@/components/admin/admin.account";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const router = useRouter();

  const updateAuth = () => {
    setToken(getToken());
    setUser(getUser());
    setAuthLoaded(true);
  };

  useEffect(() => {
    updateAuth();
    window.addEventListener("authChange", updateAuth);

    return () => {
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  useEffect(() => {
    if (authLoaded && (!user || !token)) {
      router.push("/");
    }
  }, [authLoaded, user, token, router]);

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
                <DashBoard token={token as string} />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <AdminProducts token={token as string} />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <AdminAccount token={token as string} />
              </Tab.Pane>
              <Tab.Pane eventKey="fourth">
                <AdminOrder token={token as string} />
              </Tab.Pane>
              <Tab.Pane eventKey="fifth">
                <AdminComment token={token as string} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};

export default AdminPage;
