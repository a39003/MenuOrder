import {
  ButtonDish,
  Conter,
  DishSearch,
  LoadFile,
  Tablecontainer,
  Toolbar,
} from "./style";
import React, { useEffect, useState } from "react";
import Modald from "../../costormer/Components/Modal/Modal";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, message, Select, Space, Table } from "antd";
import Foor from "../../costormer/Components/Foor/Foor";
import InpuComponent from "../../costormer/Components/InputComponent/InputComponent";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const Dish = ({ dish }) => {
  const navigate = useNavigate();

  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenMoadl, setIsOpenModal] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changingStatusId, setChangingStatusId] = useState(null);

  const [dishes, setDishes] = useState([]);
  const [status, setStatus] = useState(true);

  const [searchResults, setSearchResults] = useState([]);

  const [stateDish, setSateDish] = useState({
    dishName: "",
    dishPrice: "",
    dishStatus: "",
    menuId: 0,
    ...dish,
    thumbnail: null,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [menus, setMenus] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/menus`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        if (!res.ok) throw new Error(data?.message || "Không thể tải menu");
        return data;
      })
      .then((data) => {
        setMenus(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setMenus([]);
        message.error(err.message || "Không thể tải danh sách menu");
      });
  }, []);

  const handleSearch = (value) => {
    const searchValue = value?.toLowerCase();
    const filteredDishes = dishes?.filter((dish) =>
      dish.dishName?.toLowerCase()?.includes(searchValue),
    );
    setSearchResults(filteredDishes);
  };

  const onFinish = async (e) => {
    if (saving) return;
    setSaving(true);
    // e.preventDefault();
    console.log(stateDish);
    const formData = new FormData();
    formData.append("dishName", stateDish.dishName);
    formData.append("dishPrice", stateDish.dishPrice);
    formData.append("dishStatus", stateDish.dishStatus);
    formData.append("menuId", stateDish.menuId || rowSelected?.menuId || "");
    imageFiles.forEach((file) => formData.append("images", file));

    console.log(formData);
    try {
      const response = await fetch(
        `${API_URL}/admin/dishes${rowSelected.dishId ? "/" + rowSelected.dishId : ""}`,
        {
          method: `${rowSelected.dishId ? "PUT" : "POST"}`,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },

          body: formData,
        },
      );
      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};
      if (!response.ok) {
        throw new Error(data?.message || "Không thể lưu món ăn");
      }
      if (data.dishId) {
        message.success("Thành công");
        setStatus(true);
        setSateDish({
          dishName: "",
          dishPrice: "",
          dishStatus: "",
          menuId: 0,
          thumbnail: null,
        });
        form.resetFields();
        setImageFiles([]);
        setImagePreviews([]);
        setIsModalOpen(false);
        setIsOpenModal(false);
      }
    } catch (error) {
      message.error("Không thể lưu món ăn");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDish = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const response = await fetch(
        `${API_URL}/admin/dishes/${rowSelected?.dishId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      message.success("Xóa món ăn thành công");
      setStatus(true);
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setDeleting(false);
    }
    setIsModalOpenDelete(false);
  };

  useEffect(() => {
    if (status) {
      fetch(`${API_URL}/dishes`)
        .then(async (res) => {
          const text = await res.text();
          const data = text ? JSON.parse(text) : [];
          if (!res.ok) throw new Error(data?.message || "Không thể tải món ăn");
          return data;
        })
        .then((data) => {
          setDishes(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          setDishes([]);
          message.error(error.message || "Không thể tải danh sách món ăn");
        });
      setStatus(false);
    }
  }, [status]);
  console.log(dishes);

  const handleDetails = (record) => {
    console.log(record);
    setIsOpenModal(true);
    setSateDish(record);
    setImageFiles([]);
    setImagePreviews(
      record?.images?.length
        ? record.images
        : record?.thumbnail
          ? [record.thumbnail]
          : [],
    );
    // setRowSelected(record)
    console.log("rowSelected", rowSelected);
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const renderAction = (record) => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
          onClick={() => {
            setIsModalOpenDelete(true);
            setStatus(record.id);
            console.log(record);
          }}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "20px", cursor: "pointer" }}
          onClick={() => {
            setStatus(record.id);
            handleDetails(record);
          }}
        />
      </div>
    );
  };

  const handleOnchangeAvatar = (e) => {
    const remaining = Math.max(0, 6 - imagePreviews.length);
    const files = Array.from(e.target.files || []).slice(0, remaining);
    if (!files.length) return;
    setSateDish({
      ...stateDish,
      thumbnail: files[0],
    });
    setImageFiles((current) => [...current, ...files].slice(0, 6));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((current) => [...current, ...previews].slice(0, 6));
  };

  const handleOnchange = (e) => {
    setSateDish({
      ...stateDish,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeSelect = (value) => {
    setSateDish({
      ...stateDish,
      menuId: value,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSateDish({
      dishName: "",
      dishPrice: "",
      thumbnail: null,
      dishStatus: "",
      menuId: 0,
    });
    form.resetFields();
    console.log("....");
    setImageFiles([]);
    setImagePreviews([]);
  };

  const [form] = Form.useForm();

  const handleStatusChange = async (record, value) => {
    if (changingStatusId) return;
    setChangingStatusId(record.dishId);
    const formData = new FormData();
    formData.append("dishName", record.dishName);
    formData.append("dishPrice", record.dishPrice);
    formData.append("dishStatus", value);
    formData.append("menuId", record.menuId);
    if (record.thumbnail && record?.dishId == null) {
      formData.append("thumbnail", record.thumbnail);
    }

    console.log(formData);
    try {
      const response = await fetch(
        `${API_URL}/admin/dishes${record.dishId ? "/" + record.dishId : ""}`,
        {
          method: `${record.dishId ? "PUT" : "POST"}`,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },

          body: formData,
        },
      );
      const data = await response.json();
      if (data.dishId) {
        message.success("Thành công");
        setStatus(true);
        setSateDish({
          dishName: "",
          dishPrice: "",
          dishStatus: "",
          menuId: 0,
          thumbnail: null,
        });
        form.resetFields();
        setIsOpenModal(false);
      }
    } catch (error) {
      message.error("Không thể cập nhật trạng thái món");
    } finally {
      setChangingStatusId(null);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => (
        <img
          src={thumbnail}
          alt="Hình món ăn"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên món",
      dataIndex: "dishName",
      key: "dishName",
    },
    {
      title: "Danh mục",
      key: "menuTitle",
      render: (_, record) => {
        const menu = menus.find(
          (item) => Number(item.menuId) === Number(record.menuId),
        );
        return (
          <span
            style={{
              display: "inline-flex",
              padding: "6px 10px",
              borderRadius: "999px",
              background: "#fff0e5",
              color: "#b65325",
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            {record.menuTitle ||
              record.menuName ||
              menu?.menuTitle ||
              "Chưa phân loại"}
          </span>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "dishPrice",
      key: "dishPrice",
      render: (dishPrice) => `${dishPrice.toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "dishStatus",
      key: "key",
      render: (dishStatus, record) => (
        <Select
          value={dishStatus == 1 ? "còn món" : "đã hết"}
          onChange={(value) => handleStatusChange(record, value)}
          loading={changingStatusId === record.dishId}
          disabled={changingStatusId === record.dishId}
          options={[
            { label: "Còn món", value: 1 },
            { label: "Đã hết", value: 0 },
          ]}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (text, record) => renderAction(record),
    },
  ];

  return (
    <div>
      <Conter
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f3e2d3",
        }}
      >
        <h1>DANH SÁCH MÓN ĂN</h1>
        <Toolbar>
          <ButtonDish
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/menu")}
            style={{ background: "#2a1912" }}
          >
            Quay lại quản lý menu
          </ButtonDish>
          <DishSearch
            placeholder="Tìm kiếm món ăn..."
            onSearch={handleSearch}
            enterButton={
              <Button
                type="primary"
                style={{ backgroundColor: "#d35400", borderColor: "#d35400" }}
              >
                <SearchOutlined />
              </Button>
            }
          />
          <ButtonDish onClick={() => setIsModalOpen(true)}>Thêm mới</ButtonDish>
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
            dataSource={searchResults.length > 0 ? searchResults : dishes}
            columns={columns}
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content", y: 400 }}
            bordered
          />
        </Tablecontainer>
        <Modald
          title="Thêm món ăn"
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
            initialValues={{
              dishName: stateDish?.name,
              dishPrice: stateDish?.price,
              menuId: stateDish?.menuId,
              dishStatus: stateDish?.dishStatus,
            }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Tên món"
              name="dishName"
              rules={[{ required: true, message: "Vui lòng nhập tên món ăn!" }]}
            >
              <InpuComponent
                value={stateDish?.name}
                onChange={handleOnchange}
                name="dishName"
                placeholder="Nhập"
              />
            </Form.Item>

            <Form.Item
              label="Giá bán"
              name="dishPrice"
              rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
            >
              <InpuComponent
                value={stateDish?.name}
                onChange={handleOnchange}
                name="dishPrice"
                placeholder="Nhập"
              />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="menuId"
              rules={[{ required: true, message: "Vui lòng nhập danh mục!" }]}
            >
              <Select
                value={stateDish?.name}
                onChange={handleOnchangeSelect}
                name="menuId"
                options={menus.map((menu) => ({
                  label: menu.menuTitle,
                  value: menu.menuId,
                  name: menu.menuId,
                }))}
              />
              <span></span>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="dishStatus"
              rules={[{ required: true, message: "Vui lòng nhập danh mục!" }]}
            >
              <Select
                value={stateDish?.dishStatus == 1 ? "còn món" : "đã hết"}
                onChange={(value) =>
                  setSateDish({ ...stateDish, dishStatus: value })
                }
                options={[
                  { label: "Còn món", value: 1 },
                  { label: "Đã hết", value: 0 },
                ]}
                style={{ width: 100 }}
              />
            </Form.Item>

            <Form.Item label="Hình ảnh (tối đa 6)">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Button variant="outlined" component="label">
                  <label style={{ display: "block" }}>
                    Chọn nhiều ảnh
                    <input
                      style={{ display: "none" }}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleOnchangeAvatar}
                    />
                  </label>
                </Button>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={preview}
                      src={preview}
                      alt={`Ảnh món ${index + 1}`}
                      style={{
                        width: 76,
                        height: 76,
                        objectFit: "cover",
                        borderRadius: 10,
                        marginTop: 8,
                        border:
                          index === 0 ? "2px solid #d96b2b" : "1px solid #ddd",
                      }}
                    />
                  ))}
                </div>
              </div>
            </Form.Item>

            <Form.Item
              wrapperCol={{ offset: 8, span: 16 }}
              style={{ textAlign: "right" }}
            >
              <Button style={{ margin: "3px" }} onClick={handleCancel}>
                ĐÓNG
              </Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modald>

        <Modald
          title="Chỉnh sửa món ăn"
          isOpen={isOpenMoadl}
          onCancel={() => setIsOpenModal(false)}
          setStatus={setStatus}
          dishes={dishes}
          footer={null}
        >
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{
              dishName: rowSelected.dishName,
              dishPrice: rowSelected.dishPrice,
              menuId: rowSelected?.menuId, // Giá trị mặc định cho trường "menuId",
              dishStatus: rowSelected?.dishStatus,
              thumbnail: "FALSE",
            }}
            onFinish={onFinish}
            autoComplete="on"
            key={dishes.dishId}
          >
            <Form.Item
              label="Tên món"
              name="dishName"
              rules={[{ required: true, message: "Vui lòng nhập tên món ăn!" }]}
            >
              <InpuComponent
                value={stateDish?.dishName}
                onChange={handleOnchange}
                name="dishName"
              />
              <span></span>
            </Form.Item>

            <Form.Item
              label="Giá bán"
              name="dishPrice"
              rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
            >
              <InpuComponent
                value={stateDish?.dishPrice}
                onChange={handleOnchange}
                name="dishPrice"
              />
              <span></span>
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="menuId"
              rules={[{ required: true, message: "Vui lòng nhập danh mục!" }]}
            >
              <Select
                onChange={handleOnchangeSelect}
                options={menus.map((menu) => ({
                  label: menu.menuTitle, // Hiển thị tên danh mục
                  value: menu.menuId, // Giá trị để gửi lên server
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="dishStatus"
              rules={[{ required: true, message: "Vui lòng nhập danh mục!" }]}
            >
              <Select
                value={stateDish?.dishStatus == 1 ? "còn món" : "đã hết"}
                onChange={(value) =>
                  setSateDish({ ...stateDish, dishStatus: value })
                }
                options={[
                  { label: "Còn món", value: 1 },
                  { label: "Đã hết", value: 0 },
                ]}
                style={{ width: 100 }}
              />
              <span></span>
            </Form.Item>

            <Form.Item label="Hình ảnh (tối đa 6)">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Button variant="outlined" component="label">
                  <label style={{ display: "block" }}>
                    Thêm ảnh vào món
                    <input
                      style={{ display: "none" }}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleOnchangeAvatar}
                    />
                  </label>
                </Button>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={`${preview}-${index}`}
                      src={preview}
                      alt={`Ảnh món ${index + 1}`}
                      style={{
                        width: 76,
                        height: 76,
                        objectFit: "cover",
                        borderRadius: 10,
                        marginTop: 8,
                        border:
                          index === 0 ? "2px solid #d96b2b" : "1px solid #ddd",
                      }}
                    />
                  ))}
                </div>
              </div>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={saving}>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modald>

        <Modald
          title="Xóa món ăn"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteDish}
          confirmLoading={deleting}
          okText="Có"
          cancelText="Hủy"
        >
          Bạn có chắc muốn xóa món{" "}
          <strong>{rowSelected?.dishName || "này"}</strong> không?
        </Modald>
      </Conter>
      <Foor />
    </div>
  );
};

export default Dish;
