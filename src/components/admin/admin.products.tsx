"use client";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import "@/styles/admin.product.scss";

interface ProductForm {
  id?: number;
  category_id: string;
  name: string;
  price: string;
  price_old: string;
  screen_size: string;
  screen_tech: string;
  chipset: string;
  nfc: string;
  RAM: string;
  ROM: string;
  battery: string;
  sim_slots: string;
  os: string;
  water_resistant: string;
  stock: string;
  image_url?: string;
}

interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  price_old: number;
  screen_size: string;
  screen_tech: string;
  chipset: string;
  nfc: boolean;
  RAM: string;
  ROM: string;
  battery: string;
  sim_slots: string;
  os: string;
  water_resistant: string;
  stock: number;
  image_url: string;
}

const categoryMap: Record<number, string> = {
  1: "iPhone",
  2: "Samsung",
  3: "Xiaomi",
  4: "OPPO",
  5: "Realme",
  6: "Vivo",
  7: "SONY",
};

const AdminProducts = ({ token }: { token: string }) => {
  const initForm = {
    category_id: "",
    name: "",
    price: "",
    price_old: "",
    screen_size: "",
    screen_tech: "",
    chipset: "",
    nfc: "",
    RAM: "",
    ROM: "",
    battery: "",
    sim_slots: "",
    os: "",
    water_resistant: "",
    stock: "",
    image_url: "",
  };

  const [formData, setFormData] = useState<ProductForm>(initForm);
  const [formDataEdit, setFormDataEdit] = useState<ProductForm>(initForm);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [listProduct, setListProduct] = useState<Product[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setFormData({ ...formData, image_url: file.name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    (Object.entries(formData) as [string, string][]).forEach(([k, v]) =>
      data.append(k, v)
    );
    if (file) data.append("image", file);

    const res = await fetch(`http://localhost:8080/admin/product-manage/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    const result = await res.json();
    if (res.ok) {
      toast.success(result.message);
      setFormData(initForm);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      toast.error(result.message);
    }
  };

  const fetchListProduct = async () => {
    const res = await fetch(
      `http://localhost:8080/admin/product-manage?page=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const jsonRes = await res.json();
    if (res.ok) {
      setListProduct(jsonRes.data);
      setTotalPage(jsonRes.totalPages);
    } else {
      toast.error("Lỗi khi lấy danh sách sản phẩm");
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchListProduct();
  }, [token, currentPage]);

  const mapProductToForm = (item: Product): ProductForm => ({
    id: item.id,
    category_id: item.category_id.toString(),
    name: item.name,
    price: item.price.toString(),
    price_old: item.price_old.toString(),
    screen_size: item.screen_size.replace('"', ""),
    screen_tech: item.screen_tech,
    chipset: item.chipset,
    nfc: item.nfc ? "1" : "0",
    RAM: item.RAM.replace("GB", ""),
    ROM: item.ROM.replace("GB", ""),
    battery: item.battery.replace("mAh", ""),
    sim_slots: item.sim_slots[0],
    os: item.os,
    water_resistant: item.water_resistant,
    stock: item.stock.toString(),
    image_url: item.image_url,
  });

  const handleEdit = (item: Product) => {
    setFormDataEdit(mapProductToForm(item));
    setShowModal(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedFormDataEdit = {
      ...formDataEdit,
      image_url: formDataEdit.image_url
        ? formDataEdit.image_url.replace(/^C:\\fakepath\\/, "")
        : "",
    };

    const res = await fetch(
      `http://localhost:8080/admin/product-manage/${formDataEdit.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedFormDataEdit),
      }
    );
    const result = await res.json();
    if (res.ok) {
      toast.success(result.message);
      setShowModal(false);
      fetchListProduct();
    } else {
      toast.error(result.message);
    }
  };

  const [idItemOnDelete, setIdItemOnDelete] = useState<number>(0);
  const [nameItemOnDelete, setNameItemOnDelete] = useState<string>("");

  const handleDelete = async () => {
    const res = await fetch(
      `http://localhost:8080/admin/product-manage/${idItemOnDelete}`,
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
      fetchListProduct();
    } else {
      toast.error(jsonRes.message);
    }
  };

  return (
    <>
      <div className="admin-products-container container mt-4">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Thêm sản phẩm mới</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Thương hiệu</Form.Label>
                      <Form.Select
                        value={formData.category_id}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            category_id: event.target.value,
                          })
                        }
                      >
                        <option>-- Chọn hãng --</option>
                        <option value="1">iPhone</option>
                        <option value="2">Samsung</option>
                        <option value="3">Xiaomi</option>
                        <option value="4">OPPO</option>
                        <option value="5">Realme</option>
                        <option value="6">Vivo</option>
                        <option value="7">SONY</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tên sản phẩm</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            name: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Giá</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            price: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Giá cũ</Form.Label>
                      <Form.Control
                        type="number"
                        name="price_old"
                        value={formData.price_old}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            price_old: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Kích thước màn hình</Form.Label>
                      <Form.Control
                        type="text"
                        name="screen_size"
                        value={formData.screen_size}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            screen_size: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Công nghệ màn hình</Form.Label>
                      <Form.Control
                        type="text"
                        name="screen_tech"
                        value={formData.screen_tech}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            screen_tech: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Chipset</Form.Label>
                      <Form.Control
                        type="text"
                        name="chipset"
                        value={formData.chipset}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            chipset: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>NFC</Form.Label>
                      <Form.Select
                        value={formData.nfc}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            nfc: event.target.value,
                          })
                        }
                      >
                        <option value="1" defaultChecked>
                          Có
                        </option>
                        <option value="0">Không</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>RAM (GB)</Form.Label>
                      <Form.Control
                        type="number"
                        name="RAM"
                        value={formData.RAM}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            RAM: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>ROM (GB)</Form.Label>
                      <Form.Control
                        type="number"
                        name="ROM"
                        value={formData.ROM}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            ROM: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dung lượng pin (mAh)</Form.Label>
                      <Form.Control
                        type="number"
                        name="battery"
                        value={formData.battery}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            battery: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số SIM</Form.Label>
                      <Form.Control
                        type="number"
                        name="sim_slots"
                        value={formData.sim_slots}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            sim_slots: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hệ điều hành</Form.Label>
                      <Form.Control
                        type="text"
                        name="os"
                        value={formData.os}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            os: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Chỉ số kháng nước</Form.Label>
                      <Form.Control
                        type="text"
                        name="water_resistant"
                        value={formData.water_resistant}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            water_resistant: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số lượng</Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            stock: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Ảnh sản phẩm</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </Form.Group>

                <Button type="submit">Thêm sản phẩm</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className="table-product container mt-4">
        <div className="title mb-2">
          <span>Chỉnh sửa sản phẩm</span>
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
              <th>ID</th>
              <th>Thương hiệu</th>
              <th>Tên sản phẩm</th>
              <th>Dung lượng bộ nhớ</th>
              <th>Số lượng trong kho</th>
              <th>Công cụ</th>
            </tr>
          </thead>
          <tbody className="list-product">
            {listProduct &&
              listProduct.length > 0 &&
              listProduct.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{categoryMap[item.category_id]}</td>
                    <td>{item.name}</td>
                    <td>{item.ROM}</td>
                    <td>{item.stock}</td>
                    <td className="action">
                      <div className="btn-edit">
                        <Button
                          variant="primary"
                          onClick={() => handleEdit(item)}
                        >
                          Sửa
                        </Button>
                      </div>
                      <div className="btn-delete">
                        <Button
                          variant="danger"
                          onClick={() => {
                            setDeleteConfirm(true);
                            setIdItemOnDelete(item.id);
                            setNameItemOnDelete(item.name);
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
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEdit}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Thương hiệu</Form.Label>
                  <Form.Select
                    size="sm"
                    value={formDataEdit.category_id}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        category_id: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Chọn hãng --</option>
                    <option value="1">iPhone</option>
                    <option value="2">Samsung</option>
                    <option value="3">Xiaomi</option>
                    <option value="4">OPPO</option>
                    <option value="5">Realme</option>
                    <option value="6">Vivo</option>
                    <option value="7">SONY</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.name}
                    onChange={(e) =>
                      setFormDataEdit({ ...formDataEdit, name: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.price}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        price: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Giá cũ</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.price_old}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        price_old: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Kích thước màn hình</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.screen_size}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        screen_size: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Công nghệ màn hình</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.screen_tech}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        screen_tech: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Chipset</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.chipset}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        chipset: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>NFC</Form.Label>
                  <Form.Select
                    size="sm"
                    value={formDataEdit.nfc}
                    onChange={(e) =>
                      setFormDataEdit({ ...formDataEdit, nfc: e.target.value })
                    }
                  >
                    <option value="1">Có</option>
                    <option value="0">Không</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>RAM (GB)</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.RAM}
                    onChange={(e) =>
                      setFormDataEdit({ ...formDataEdit, RAM: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>ROM (GB)</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.ROM}
                    onChange={(e) =>
                      setFormDataEdit({ ...formDataEdit, ROM: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Dung lượng pin (mAh)</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.battery}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        battery: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Số SIM</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.sim_slots}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        sim_slots: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Hệ điều hành</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.os}
                    onChange={(e) =>
                      setFormDataEdit({ ...formDataEdit, os: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Chỉ số kháng nước</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.water_resistant}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        water_resistant: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={formDataEdit.stock}
                    onChange={(e) =>
                      setFormDataEdit({
                        ...formDataEdit,
                        stock: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>Ảnh sản phẩm</Form.Label>
                <Form.Control
                  size="sm"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) =>
                    setFormDataEdit({
                      ...formDataEdit,
                      image_url: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSubmitEdit}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteConfirm} onHide={() => setDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn xóa sản phẩm này:
          <div>
            Id: <b>{idItemOnDelete}</b>
          </div>
          <div>
            Sản phẩm: <b>{nameItemOnDelete}</b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminProducts;
