"use client";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { toast } from "react-toastify";
import "@/styles/admin.account.scss";

interface UserAdmin {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  address?: string;
  role: string;
  password: string;
}

const AdminAccount = ({ token }: { token: string }) => {
  const [listUser, setListUser] = useState<UserAdmin[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;
  const [hasNextPage, setHasNextPage] = useState(true);
  const [userOnEdit, setUserOnEdit] = useState<UserAdmin>({
    id: 0,
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [show, setShow] = useState(false);

  const fetchListUser = async () => {
    const res = await fetch(
      `http://localhost:8080/admin/users?page=${currentPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      const jsonRes = await res.json();
      setListUser(jsonRes);
      setHasNextPage(jsonRes.length === pageSize);
    } else {
      setHasNextPage(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchListUser();
  }, [token, currentPage]);

  const handleEdit = (item: UserAdmin) => {
    setUserOnEdit(item);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:8080/admin/users/${userOnEdit.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userOnEdit.name,
          email: userOnEdit.email,
          phone_number: userOnEdit.phone_number,
          address: userOnEdit.address,
          role: userOnEdit.role,
        }),
      }
    );

    const jsonRes = await res.json();

    if (res.ok) {
      toast.success(jsonRes.message);
      handleClose();
      fetchListUser();
    } else {
      toast.error(jsonRes.message);
    }
  };

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [userOnDelete, setUserOnDelete] = useState<UserAdmin>({
    id: 0,
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8080/admin/users/${userOnDelete.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const jsonRes = await res.json();

    if (res.ok) {
      toast.success(jsonRes.message);
      fetchListUser();
    } else {
      toast.error(jsonRes.message);
    }
  };

  return (
    <div className="admin-account-container container  mt-4">
      <div className="title">
        <span>Chỉnh sửa sản phẩm</span>
        <span className="page-control mb-2">
          {currentPage > 1 && (
            <TbPlayerTrackPrevFilled
              onClick={() => setCurrentPage((x) => x - 1)}
            />
          )}
          <span>{currentPage}</span>
          {hasNextPage && (
            <TbPlayerTrackNextFilled
              onClick={() => setCurrentPage((x) => x + 1)}
            />
          )}
        </span>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Tên tài khoản</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Công cụ</th>
          </tr>
        </thead>
        <tbody>
          {listUser &&
            listUser.length > 0 &&
            listUser.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.phone_number}</td>
                  <td>{item.role}</td>
                  <td>
                    <div className="action">
                      <Button
                        variant="primary"
                        onClick={() => handleEdit(item)}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setUserOnDelete(item);
                          setShowModalDelete(true);
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Tên tài khoản</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên tài khoản"
                    required
                    value={userOnEdit?.name}
                    onChange={(event) =>
                      setUserOnEdit({
                        ...userOnEdit,
                        name: event.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={userOnEdit?.email}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số điện thoại"
                    value={
                      userOnEdit?.phone_number ? userOnEdit.phone_number : ""
                    }
                    onChange={(event) =>
                      setUserOnEdit({
                        ...userOnEdit,
                        phone_number: event.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập địa chỉ"
                    value={userOnEdit?.address ? userOnEdit.address : ""}
                    onChange={(event) =>
                      setUserOnEdit({
                        ...userOnEdit,
                        address: event.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicRole">
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Select
                    aria-label="Vai trò"
                    value={userOnEdit?.role}
                    onChange={(event) =>
                      setUserOnEdit({
                        ...userOnEdit,
                        role: event.target.value,
                      })
                    }
                  >
                    <option value="user">Khách hàng</option>
                    <option value="admin">Quản trị viên</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    disabled
                    defaultValue={"khong co gi"}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showModalDelete} onHide={() => setShowModalDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn chắc chắn muốn xóa tài khoản này chứ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalDelete(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminAccount;
