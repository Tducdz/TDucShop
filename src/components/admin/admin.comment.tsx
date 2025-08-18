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

interface CommentAdmin {
  id: number;
  comment: string;
  create_at: string;
  censor: number;
  product_name: string;
  user_name: string;
}

const CommentCensor: Record<number, string> = {
  1: "Đã duyệt",
  0: "Chờ duyệt",
};

const AdminComment = ({ token }: { token: string }) => {
  const [listComment, setListComment] = useState<CommentAdmin[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [commentOnDelete, setCommentOnDelete] = useState<CommentAdmin>();
  const [showModalDelete, setShowModalDelete] = useState(false);

  const fetchListComment = async () => {
    const res = await fetch(
      `http://localhost:8080/admin/comments?page=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      const jsonRes = await res.json();
      setTotalPage(jsonRes.totalPages);
      setListComment(jsonRes.comments);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchListComment();
  }, [token, currentPage]);

  const handleCensor = async (id: number) => {
    const res = await fetch(`http://localhost:8080/admin/comments/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const jsonRes = await res.json();

    if (res.ok) {
      toast.success(jsonRes.message);
      fetchListComment();
    } else {
      toast.error(jsonRes.message);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8080/admin/comments/${commentOnDelete?.id}`,
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
      fetchListComment();
      setShowModalDelete(false);
    } else {
      toast.error(jsonRes.message);
    }
  };

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

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
          {currentPage < totalPage && (
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
            <th>Ngày đăng</th>
            <th>Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th>Công cụ</th>
          </tr>
        </thead>
        <tbody>
          {listComment &&
            listComment.length > 0 &&
            listComment.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{formatDateTime(item.create_at)}</td>
                  <td>{item.user_name}</td>
                  <td>{item.product_name}</td>
                  <td>{item.comment}</td>
                  <td>{CommentCensor[item.censor]}</td>
                  <td>
                    <div className="action">
                      {item.censor === 0 ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            handleCensor(item.id);
                          }}
                        >
                          Duyệt
                        </Button>
                      ) : (
                        <Button disabled variant="">
                          Đã duyệt
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        onClick={() => {
                          setCommentOnDelete(item);
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
      <Modal show={showModalDelete} onHide={() => setShowModalDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa đánh giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn chắc chắn muốn xóa đánh giá này chứ?
          <div>
            Sản phẩm: <b>{commentOnDelete?.product_name}</b>
          </div>
          <div>
            Nội dung: <b>{commentOnDelete?.comment}</b>
          </div>
        </Modal.Body>
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

export default AdminComment;
