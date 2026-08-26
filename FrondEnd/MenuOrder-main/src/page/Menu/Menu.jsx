import { ButtonGruoup, Conter, Tablecontainer, Toolbar } from "./style";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Modald from "../../costormer/Components/Modal/Modal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, message, Table } from "antd";
import Foor from "../../costormer/Components/Foor/Foor";
import InpuComponent from "../../costormer/Components/InputComponent/InputComponent";
import { API_URL } from "../../config";

const Menu = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenMoadl, setIsOpenModal] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [menu, setMenus] = useState([]);
  const [status, setStatus] = useState(true);

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");

  const handleSubmitForm = async (e) => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(
        `${API_URL}/admin/menus${selectedMenu ? "/" + selectedMenu.menuId : ""}`,
        {
          method: `${selectedMenu ? "PUT" : "POST"}`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            menuTitle: menuName,
            menuDescription: menuDescription || "",
          }),
        },
      );
      const data = await res.json();
      if (data.menuId) {
        message.success("Thành công");
        setMenuName("");
        setMenuDescription("");
        form.resetFields();
        setStatus(true);
        setIsModalOpen(false);
      } else {
        setStatus(false);
        setMenuName("");
        setMenuDescription("");
        message.error(data.message);
      }
      setIsOpenModal(false);
    } catch {
      message.error("Không thể lưu danh mục");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenu = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${API_URL}/admin/menus/${selectedMenu?.menuId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.ok) {
        message.success("Xóa menu thành công");
        setStatus(true);
        setIsModalOpenDelete(false);
      } else {
        const errorData = await res.json();
        message.error(errorData?.message || "Xóa menu thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa bàn");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (status) {
      fetch(`${API_URL}/menus`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          const text = await res.text();
          const data = text ? JSON.parse(text) : [];
          if (!res.ok) {
            throw new Error(data?.message || "Không thể tải danh sách menu");
          }
          return data;
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setMenus(data);
          } else {
            setMenus([]);
            message.error("Dữ liệu trả về không hợp lệ");
          }
        })
        .catch((error) => {
          setMenus([]);
          message.error("Không thể tải danh sách menu");
          console.error(error);
        });
      setStatus(false);
    }
  }, [status]);
  console.log(menu);

  const handleDetails = (record) => {
    console.log(record);
    setSelectedMenu(record); // Lưu thông tin chi tiết của bàn
    setMenuName(record?.menuTitle); // Đặt tên bàn vào input
    setMenuDescription(record?.menuDescription);
    setIsOpenModal(true); // Mở modal
    form.setFieldsValue({
      menuTitle: record?.menuTitle,
      menuDescription: record?.menuDescription,
    });
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const navigate = useNavigate();

  const renderAction = (record) => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
          onClick={() => {
            setIsModalOpenDelete(true);
            setSelectedMenu(record);
            console.log(record);
          }}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "20px", cursor: "pointer" }}
          onClick={() => {
            setSelectedMenu(record);
            handleDetails(record);
          }}
        />
      </div>
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setMenuName({
      menuTitle: "",
    });
    setMenuDescription({
      menuDescription: "",
    });
    form.resetFields();
    console.log("....");
    form.resetFields();
  };

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "menuTitle",
      key: "menuTitle",
    },
    {
      title: "Mô tả",
      dataIndex: "menuDescription",
      key: "menuDescription",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (text, record) => renderAction(record),
    },
  ];

  const [dataSource, setDataSource] = useState([
    { key: "1", codemenu: "C01", name: "Món chính", note: "" },
    { key: "2", codemenu: "C02", name: "Đồ uống", note: "" },
    { key: "3", codemenu: "C03", name: "Món tráng miệng", note: "" },
  ]);

  return (
    <div>
      <Conter
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f3e2d3",
        }}
      >
        <h1>QUẢN LÝ MENU</h1>
        <Toolbar>
          <ButtonGruoup onClick={() => setIsModalOpen(true)}>
            Thêm mới
          </ButtonGruoup>
          <ButtonGruoup onClick={() => navigate("/admin/dish")}>
            Danh sách món ăn
          </ButtonGruoup>
        </Toolbar>
        <Tablecontainer>
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setRowSelected(record);
                },
              };
            }}
            dataSource={menu}
            columns={columns}
            pagination={{ pageSize: 6 }}
            bordered
            rowKey="key"
            scroll={{ x: "max-content" }}
          />
        </Tablecontainer>
        <Modald
          title="Thêm danh mục"
          open={isModalOpen}
          setStatus={setStatus}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmitForm}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Tên danh mục"
              name="menuTitle"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục!" },
              ]}
            >
              <InpuComponent
                value={menu?.menuTitle}
                onChange={(e) => setMenuName(e.target.value)}
                name="menuTitle"
                placeholder="Nhập"
              />
            </Form.Item>

            <Form.Item label="Mô tả" name="menuDescription">
              <InpuComponent
                value={menu?.menuDescription}
                onChange={(e) => setMenuDescription(e.target.value)}
                name="menuDescription"
                placeholder="Nhập"
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{ offset: 8, span: 16 }}
              style={{ textAlign: "right" }}
            >
              <Button style={{ margin: "3px" }} onClick={handleCancel}>
                ĐÓNG
              </Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                LƯU
              </Button>
            </Form.Item>
          </Form>
        </Modald>

        <Modald
          title="Chỉnh sửa danh mục"
          isOpen={isOpenMoadl}
          onCancel={() => {
            setIsOpenModal(false);
            handleCancel();
          }}
          status={setStatus}
          menu={menu}
          footer={null}
        >
          <Form
            key={menu.menuId}
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={() => {
              handleSubmitForm();
              setTimeout(() => {
                setIsModalOpen(false);
              }, 500);
            }}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên danh mục"
              name="menuTitle"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục!" },
              ]}
            >
              <InpuComponent onChange={(e) => setMenuName(e.target.value)} />
            </Form.Item>

            <Form.Item label="Mô tả" name="menuDescription">
              <InpuComponent
                onChange={(e) => setMenuDescription(e.target.value)}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={saving}>
                LƯU
              </Button>
            </Form.Item>
          </Form>
        </Modald>

        <Modald
          title="Xóa danh mục"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteMenu}
          confirmLoading={deleting}
          okText="Có"
          cancelText="Hủy"
        >
          Bạn có chắc muốn xóa danh mục{" "}
          <strong>{selectedMenu?.menuTitle || "này"}</strong> không?
        </Modald>
      </Conter>
      <Foor />
    </div>
  );
};

export default Menu;
