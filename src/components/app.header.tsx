"use client";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import LoginForm from "@/components/auth/login";
import { useEffect, useState } from "react";
import SignupForm from "./auth/signup";
import { getToken, getUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import "../styles/header.scss";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AppHeader = () => {
  const [showModalLogin, setShowModalLogin] = useState<boolean>(false);
  const [showModalSignup, setShowModalSignup] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    router.push(`/?q=${encodeURIComponent(searchText)}`);
  };

  const updateAuth = () => {
    setToken(getToken());
    setUser(getUser());
  };

  useEffect(() => {
    updateAuth();
    window.addEventListener("authChange", updateAuth);

    return () => {
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  const isLoggedIn = () => {
    return Boolean(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <>
      <div className="header-container">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Link href="/" className="navbar-brand">
              TDucShop
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Form className="d-flex mx-auto" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Tìm kiếm"
                  className="me-2"
                  aria-label="Search"
                  value={searchText || ""}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button variant="outline-danger" type="submit">
                  <CiSearch style={{ marginBottom: "3px" }} />
                </Button>
              </Form>
              <Nav className="ms-auto">
                <Link href="/" className="nav-link">
                  Tra cứu đơn hàng
                </Link>
                <Link href="/cart" className="nav-link">
                  Giỏ hàng
                </Link>
                {isLoggedIn() ? (
                  <NavDropdown title={user?.name} id="basic-nav-dropdown">
                    <Link href="/" className="dropdown-item">
                      Tài khoản
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin" className="dropdown-item">
                        Trang quản trị
                      </Link>
                    )}
                    <NavDropdown.Divider />
                    <span
                      className="dropdown-item btn"
                      onClick={() => handleLogout()}
                    >
                      Đăng xuất
                    </span>
                  </NavDropdown>
                ) : (
                  <div className="not-logged-in">
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowModalLogin(true)}
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      variant="outline-dark"
                      onClick={() => setShowModalSignup(true)}
                    >
                      Đăng ký
                    </Button>
                  </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <LoginForm
        showModalLogin={showModalLogin}
        handleClose={() => setShowModalLogin(false)}
      />
      <SignupForm
        showModalSignup={showModalSignup}
        handleClose={() => setShowModalSignup(false)}
      />
    </>
  );
};

export default AppHeader;
