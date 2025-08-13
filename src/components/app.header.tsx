"use client";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import "../styles/header.scss";

const AppHeader = () => {
  return (
    <div className="header-container">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Link href="/" className="navbar-brand">
            TDucShop
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Form className="d-flex mx-auto">
              <Form.Control
                type="search"
                placeholder="Tìm kiếm"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-danger">
                <CiSearch style={{ marginBottom: "3px" }} />
              </Button>
            </Form>
            <Nav className="ms-auto">
              <Link href="/" className="nav-link">
                Tra cứu đơn hàng
              </Link>
              <Link href="/" className="nav-link">
                Giỏ hàng
              </Link>
              <div className="not-logged-in">
                <Button variant="outline-dark">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button variant="outline-secondary">
                  <Link href="/signup">Đăng Ký </Link>
                </Button>
              </div>
              {/* <NavDropdown title="Tên người dùng" id="basic-nav-dropdown">
                <Link href="/" className="dropdown-item">
                  Tài khoản
                </Link>
                <NavDropdown.Divider />
                <Link href="/" className="dropdown-item">
                  Đăng xuất
                </Link>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default AppHeader;
