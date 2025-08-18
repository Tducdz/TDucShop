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

interface OrderAdmin {
  id: number;
  user_id: number;
  name: string;
  order_date: string;
  total_price: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_address: string;
}

const OrderStatusMap: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const AdminOrder = ({ token }: { token: string }) => {
  const [listOrder, setListOrder] = useState<OrderAdmin[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limitPerPage = 7;
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [orderOnEdit, setOrderOnEdit] = useState<OrderAdmin>({
    id: 0,
    user_id: 0,
    name: "",
    order_date: "",
    total_price: "",
    payment_method: "",
    payment_status: "",
    order_status: "",
    shipping_address: "",
  });

  const [show, setShow] = useState(false);

  const fetchListOrder = async () => {
    const res = await fetch(
      `http://localhost:8080/admin/orders?page=${currentPage}`,
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
      setTotalOrder(jsonRes.totalOrders);
      setListOrder(jsonRes.orders);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchListOrder();
  }, [token, currentPage]);

  console.log(listOrder);
  const handleEdit = (item: OrderAdmin) => {
    setOrderOnEdit(item);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:8080/admin/orders/${orderOnEdit.id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: orderOnEdit.shipping_address,
          status: orderOnEdit.order_status,
          payment_status: "paid",
        }),
      }
    );

    const jsonRes = await res.json();

    if (res.ok) {
      toast.success(jsonRes.message);
      handleClose();
      fetchListOrder();
    } else {
      toast.error(jsonRes.message);
    }
  };

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [orderOnDelete, setOrderOnDelete] = useState<OrderAdmin>({
    id: 0,
    user_id: 0,
    name: "",
    order_date: "",
    total_price: "",
    payment_method: "",
    payment_status: "",
    order_status: "",
    shipping_address: "",
  });

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8080/admin/orders/${orderOnDelete.id}`,
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
      fetchListOrder();
      setShowModalDelete(false);
    } else {
      toast.error(jsonRes.message);
    }
  };

  const totalPages = Math.ceil(totalOrder / limitPerPage);

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const formatPrice = (price: number | string) => {
    const priceInt = Number(price);
    return priceInt.toLocaleString("vi-VN") + "₫";
  };

  return (
    <div className="admin-account-container container  mt-4">
      <div className="title">
        <span>Danh sách đơn hàng</span>
        <span className="page-control mb-2">
          {currentPage > 1 && (
            <TbPlayerTrackPrevFilled
              onClick={() => setCurrentPage((x) => x - 1)}
            />
          )}
          <span>{currentPage}</span>
          {currentPage < totalPages && (
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
            <th>Ngày đặt</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Công cụ</th>
          </tr>
        </thead>
        <tbody>
          {listOrder &&
            listOrder.length > 0 &&
            listOrder.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{formatDateTime(item.order_date)}</td>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.total_price)}</td>
                  <td>{OrderStatusMap[item.order_status]}</td>
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
                          setOrderOnDelete(item);
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
                  <Form.Label>Khách hàng</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={orderOnEdit.name}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>Địa chỉ nhận hàng</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên tài khoản"
                    required
                    value={orderOnEdit.shipping_address}
                    onChange={(event) =>
                      setOrderOnEdit({
                        ...orderOnEdit,
                        shipping_address: event.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicMoney">
                  <Form.Label>Tổng số tiền</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số điện thoại"
                    value={formatPrice(orderOnEdit.total_price)}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicStatus">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    value={orderOnEdit.order_status}
                    onChange={(event) =>
                      setOrderOnEdit({
                        ...orderOnEdit,
                        order_status: event.target.value,
                      })
                    }
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </Form.Select>
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

export default AdminOrder;
