import React, { useEffect, useState } from "react";
import { Avatar, Button, Form, Input, Modal, Select, Space, Switch, Table, Tag, message } from "antd";
import { EditOutlined, LogoutOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { MainContent, ProfileContainer } from "./style";
import { apiFetch, getCurrentUser, logout } from "../../services/auth";

const roles = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "NHAN_VIEN", label: "Nhân viên phục vụ" },
  { value: "THU_NGAN", label: "Thu ngân" },
  { value: "BEP", label: "Nhân viên bếp" },
];

const Account = () => {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const loadUsers = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const response = await apiFetch("/admin/users");
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Không tải được tài khoản");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showForm = (user = null) => {
    setEditing(user);
    form.setFieldsValue(user ? { ...user, password: "" } : {
      username: "", fullName: "", password: "", role: "NHAN_VIEN", enabled: true,
    });
    setOpen(true);
  };

  const save = async (values) => {
    setSaving(true);
    try {
      const response = await apiFetch(`/admin/users${editing ? `/${editing.userId}` : ""}`, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(data?.message || "Không thể lưu tài khoản");
      message.success(editing ? "Đã cập nhật tài khoản" : "Đã tạo tài khoản");
      setOpen(false);
      await loadUsers();
    } catch (error) {
      message.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const columns = [
    { title: "Họ tên", dataIndex: "fullName", render: (value) => value || "Chưa cập nhật" },
    { title: "Tên đăng nhập", dataIndex: "username" },
    { title: "Vai trò", dataIndex: "role", render: (value) => <Tag color="orange">{roles.find((r) => r.value === value)?.label || value}</Tag> },
    { title: "Trạng thái", dataIndex: "enabled", render: (value) => <Tag color={value ? "green" : "red"}>{value ? "Đang hoạt động" : "Đã khóa"}</Tag> },
    { title: "Thao tác", render: (_, record) => <Button icon={<EditOutlined />} onClick={() => showForm(record)}>Sửa</Button> },
  ];

  return (
    <MainContent>
      <ProfileContainer>
        <Avatar size={76} icon={<UserOutlined />} />
        <h2>{currentUser?.fullName || currentUser?.username || "Tài khoản"}</h2>
        <p className="role">{roles.find((r) => r.value === currentUser?.role)?.label || currentUser?.role}</p>
        <div className="profile-row"><span>Tên đăng nhập</span><strong>{currentUser?.username}</strong></div>
        <button className="logout" onClick={handleLogout}><LogoutOutlined /> &nbsp;Đăng xuất</button>
      </ProfileContainer>

      {isAdmin && <section style={{ width: "min(1100px, 100%)" }}>
        <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
          <div><h2 style={{ margin: 0 }}>Quản lý nhân viên</h2><p style={{ color: "#927668" }}>Admin tạo tài khoản và cấp quyền sử dụng hệ thống.</p></div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showForm()}>Tạo tài khoản</Button>
        </Space>
        <Table rowKey="userId" loading={loading} dataSource={users} columns={columns} scroll={{ x: 760 }} />
      </section>}

      <Modal title={editing ? "Chỉnh sửa tài khoản" : "Tạo tài khoản nhân viên"} open={open}
        onCancel={() => setOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={save}>
          <Form.Item label="Họ và tên" name="fullName"><Input /></Form.Item>
          <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label={editing ? "Mật khẩu mới (để trống nếu giữ nguyên)" : "Mật khẩu"} name="password"
            rules={editing ? [] : [{ required: true, min: 6 }]}><Input.Password /></Form.Item>
          <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}><Select options={roles} /></Form.Item>
          <Form.Item label="Cho phép đăng nhập" name="enabled" valuePropName="checked"><Switch /></Form.Item>
          <Button type="primary" htmlType="submit" loading={saving} block>Lưu tài khoản</Button>
        </Form>
      </Modal>
    </MainContent>
  );
};

export default Account;
