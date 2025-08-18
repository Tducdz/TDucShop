"use client";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

interface ProductForm {
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
}

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
  };

  const [formData, setFormData] = useState<ProductForm>(initForm);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
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
                      <Form.Label>Category ID</Form.Label>
                      <Form.Control
                        type="number"
                        name="category_id"
                        value={formData.category_id}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            category_id: event.target.value,
                          })
                        }
                      />
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
                      <Form.Label>Screen size</Form.Label>
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
                      <Form.Label>Screen tech</Form.Label>
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
                      <Form.Control
                        type="number"
                        name="nfc"
                        value={formData.nfc}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            nfc: event.target.value,
                          })
                        }
                      />
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
                      <Form.Label>Battery (mAh)</Form.Label>
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
                      <Form.Label>Sim slots</Form.Label>
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
                      <Form.Label>OS</Form.Label>
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
                      <Form.Label>Water resistant</Form.Label>
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
                      <Form.Label>Stock</Form.Label>
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default AdminProducts;
