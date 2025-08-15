"use client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

type SignupFormProps = {
  showModalSignup: boolean;
  handleClose: () => void;
};

const SignupForm = ({ showModalSignup, handleClose }: SignupFormProps) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rePassword || rePassword !== password) {
      toast.error("Mật khẩu không khớp");
      return;
    }
    const res = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      setUsername("");
      setEmail("");
      setPassword("");
      handleClose();
    } else {
      toast.error(data.message);
    }
  };

  const handleCloseBtn = () => {
    handleClose();
    setUsername("");
    setEmail("");
    setPassword("");
    setRePassword("");
  };

  return (
    <>
      <Modal
        show={showModalSignup}
        onHide={handleCloseBtn}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="login-title">Đăng ký</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(event) => handleSignup(event)}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Tên người dùng</Form.Label>
              <Form.Control
                value={username}
                type="text"
                placeholder="Nhập Username"
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </Form.Group>

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
            <Form.Group className="mb-3" controlId="formBasicRePassword">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                required
                value={rePassword}
                type="password"
                placeholder="Nhập lại mật khẩu"
                onChange={(event) => setRePassword(event.target.value)}
              />
            </Form.Group>
            <div className="action-form">
              <Button variant="dark" type="submit">
                Đăng ký
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

export default SignupForm;
