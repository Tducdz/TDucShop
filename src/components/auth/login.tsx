"use client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

type LoginFormProps = {
  showModalLogin: boolean;
  handleClose: () => void;
};

const LoginForm = ({ showModalLogin, handleClose }: LoginFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));
      toast.success(data.message);
      setEmail("");
      setPassword("");
      handleClose();
    } else {
      toast.error("Sai email hoặc mật khẩu");
    }
  };

  const handleCloseBtn = () => {
    handleClose();
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <Modal
        show={showModalLogin}
        onHide={handleCloseBtn}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="login-title">Đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(event) => handleLogin(event)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                type="email"
                placeholder="Nhập Email"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                required
                value={password}
                type="password"
                placeholder="Nhập mật khẩu"
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>
            <div className="action-form">
              <Button variant="dark" type="submit">
                Đăng nhập
              </Button>
              <Button variant="outline-dark" onClick={handleCloseBtn}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginForm;
