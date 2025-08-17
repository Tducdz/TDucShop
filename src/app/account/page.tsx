"use client";
import { getToken, getUser } from "@/utils/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "@/styles/user.account.scss";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

const UserAccount = () => {
  const [name, setName] = useState<string>("");
  const [phone_number, setPhone_number] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [user, setUser] = useState<User | null>(getUser());
  const [token, setToken] = useState<string | null>(getToken());

  const router = useRouter();

  const [userDetail, setUserDetail] = useState<UserDetail>({
    id: 0,
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

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

  useEffect(() => {
    if (!user || !token) {
      router.push("/");
      return;
    }

    const fetchUserDetail = async () => {
      const res = await fetch(`http://localhost:8080/user/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const jsonRes = await res.json();
        setUserDetail(jsonRes);
        setName(jsonRes.name);
        setPhone_number(jsonRes.phone_number ?? "");
        setAddress(jsonRes.address ?? "");
      } else {
        console.error("Fetch userdetail failed");
      }
    };

    fetchUserDetail();
  }, [user, token, router]);

  const handleSaveInfor = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/user/${user?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        phone_number,
        address,
      }),
    });

    if (res.ok) {
      toast.success("Thay đổi thông tin tài khoản thành công");
      setUserDetail((prev) => ({ ...prev, name, phone_number, address }));
    } else {
      toast.error("Có lỗi xảy ra");
    }
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      return "Mật khẩu không được chỉ chứa khoảng trắng";
    }
    return null;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validatePassword(newPassword);
    if (error) {
      toast.error(error);
      return;
    }

    if (newPassword !== rePassword) {
      toast.error("Xác nhận mật khẩu không khớp");
      return;
    }

    const res = await fetch(`http://localhost:8080/user/${user?.id}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    if (res.ok) {
      const resJson = await res.json();
      toast.success(resJson.message);
      setNewPassword("");
      setOldPassword("");
      setRePassword("");
    } else {
      const resJson = await res.json();
      toast.error(resJson.message);
    }
  };

  return (
    <div className="user-account-container container">
      <div className="title">Tài khoản của bạn</div>
      <div className="action mt-3 mb-2">
        <Accordion defaultActiveKey={["0", "1"]} alwaysOpen>
          <div className="row">
            <div className="col-md-6">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Thông tin cá nhân</Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={handleSaveInfor}>
                    <Form.Group className="mb-2" controlId="formBasicName">
                      <Form.Label>Tên tài khoản</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicPhone">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Hãy thêm số điện thoại"
                        value={phone_number}
                        onChange={(event) =>
                          setPhone_number(event.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicAddress">
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Hãy thêm địa chỉ"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicGmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="text"
                        disabled
                        value={userDetail.email}
                      />
                    </Form.Group>

                    <Button
                      variant="outline-primary"
                      type="submit"
                      className="mt-2"
                    >
                      Lưu thay đổi
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </div>
            <div className="col-md-6">
              <Accordion.Item eventKey="1">
                <Accordion.Header>Đổi mật khẩu</Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={handleChangePassword}>
                    <Form.Group
                      className="mb-2"
                      controlId="formBasicOldPassword"
                    >
                      <Form.Label>Mật khẩu cũ</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu cũ"
                        value={oldPassword}
                        onChange={(event) => setOldPassword(event.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-2"
                      controlId="formBasicNewPassword"
                    >
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-2"
                      controlId="formBasicRePassword"
                    >
                      <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Xác nhận mạt khẩu"
                        value={rePassword}
                        onChange={(event) => setRePassword(event.target.value)}
                        required
                      />
                    </Form.Group>

                    <Button
                      variant="outline-primary"
                      type="submit"
                      className="mt-2"
                    >
                      Đổi mật khẩu
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default UserAccount;
