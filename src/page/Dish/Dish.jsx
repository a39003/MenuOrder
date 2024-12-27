import { ButtonDish, Conter, LoadFile, Tablecontainer } from "./style"
import React, { useEffect, useState } from "react";
import Modald from "../../costormer/Components/Modal/Modal";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Select, Space, Table } from "antd";
import Foor from "../../costormer/Components/Foor/Foor";
import InpuComponent from "../../costormer/Components/InputComponent/InputComponent";

const { Search } = Input;

const Dish = ({ dish }) => {

  const [rowSelected, setRowSelected] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenMoadl, setIsOpenModal] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)


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
  })

  const [thumbnailPreview, setThumbnailPreview] = useState(null);




  const [menus, setMenus] = useState([])
  useEffect(() => {
    fetch("http://localhost:8080/menus", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMenus(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  const handleSearch = (value) => {
    const searchValue = value?.toLowerCase();
    const filteredDishes = dishes?.filter((dish) =>
      dish.dishName?.toLowerCase()?.includes(searchValue)
    );
    setSearchResults(filteredDishes);
  };

  const onFinish = async (e) => {
    // e.preventDefault();
    console.log(stateDish)
    const formData = new FormData();
    formData.append("dishName", stateDish.dishName);
    formData.append("dishPrice", stateDish.dishPrice);
    formData.append("dishStatus", stateDish.dishStatus);
    formData.append("menuId", stateDish.menuId);
    if (stateDish.thumbnail && rowSelected?.dishId == null) {
      formData.append("thumbnail",stateDish.thumbnail);
    }
    else{
      if(thumbnailPreview){
        formData.append("thumbnail",stateDish.thumbnail);
      }
    }

    console.log(formData);
    try {
      const response = await fetch(
        `http://localhost:8080/admin/dishes${rowSelected.dishId ? "/" + rowSelected.dishId : ""}`,
        {
          method: `${rowSelected.dishId ? "PUT" : "POST"}`,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },

          body: formData,
        }
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
        form.resetFields()
        setThumbnailPreview(null);
        setIsModalOpen(false)
        setIsOpenModal(false)
      }
    } catch (error) {
      console.message.error("There was an error!");
    }
  
  };


  const handleDeleteDish = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/dishes/${rowSelected?.dishId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      message.success("Xóa món ăn thành công");
      setStatus(true);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setIsModalOpenDelete(false);
  };


  useEffect(() => {
    if (status) {
      fetch("http://localhost:8080/dishes")
        .then((res) => res.json())
        .then((data) => {
          setDishes(data);
        });
      setStatus(false);
    }
  }, [status]);
  console.log(dishes);






  const handleDetails = (record) => {
    console.log(record)
    setIsOpenModal(true)
    setSateDish(record)
    // setRowSelected(record)
    console.log('rowSelected', rowSelected)

  }


  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }





  const renderAction = (record) => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => {
          setIsModalOpenDelete(true);
          setStatus(record.id)
          console.log(record)
        }} />
        <EditOutlined
          style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }}
          onClick={() => {
            setStatus(record.id)
            handleDetails(record);
          }}
        />
      </div>
    )
  }


  const handleOnchangeAvatar = (e) => {
    const file = e.target.files[0];
    setSateDish({
      ...stateDish,
      thumbnail: file,
    });
    setThumbnailPreview(URL.createObjectURL(file));
  }






  const handleOnchange = (e) => {

    setSateDish({
      ...stateDish,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeSelect = (value) => {
    setSateDish({
      ...stateDish,
      menuId: value
    })
  }


  const handleCancel = () => {
    setIsModalOpen(false)
    setSateDish({
      dishName: '',
      dishPrice: '',
      thumbnail: null,
      dishStatus: '',
      menuId: 0,
    })
    form.resetFields()
    console.log("....");
    setThumbnailPreview(null);
  };

  const [form] = Form.useForm();



  const handleStatusChange = async (record, value) => {
  const formData = new FormData();
    formData.append("dishName", record.dishName);
    formData.append("dishPrice", record.dishPrice);
    formData.append("dishStatus",value);
    formData.append("menuId", record.menuId);
    if (record.thumbnail && record?.dishId == null) {
      formData.append("thumbnail", record.thumbnail);
    }

    console.log(formData);
    try {
      const response = await fetch(
        `http://localhost:8080/admin/dishes${record.dishId ? "/" + record.dishId : ""}`,
        {
          method: `${record.dishId ? "PUT" : "POST"}`,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },

          body: formData,
        }
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
        form.resetFields()
        setThumbnailPreview(null);
        setIsOpenModal(false)
      }
    } catch (error) {
      console.message.error("There was an error!");
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
          value={dishStatus == 1 ? "còn món" : "đã hết" }
          onChange={(value) => handleStatusChange(record, value)}
          options={[
            { label: "Còn món", value: 1 },
            { label: "Đã hết", value:0 },
          ]}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => renderAction(record)
    }
  ];


  return (
    <div>
      <Conter style={{ textAlign: 'center', padding: '20px', backgroundColor: "#f3e2d3" }}>
        <h1>DANH SÁCH MÓN ĂN</h1>
        <div style={{ margin: '10px' }}>
          <Search
          placeholder="Tìm kiếm món ăn..."
          onSearch={handleSearch}
            enterButton={
              <Button type="primary" style={{ backgroundColor: "#d35400", borderColor: "#d35400" }}>
                <SearchOutlined />
              </Button>
                }
          style={{ width: 300}}
        />
          <ButtonDish onClick={() => setIsModalOpen(true)}>Thêm mới</ButtonDish>
        </div>
        <Tablecontainer >
          <Table onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                setRowSelected(record)
              }
            };
          }}
              dataSource={searchResults.length > 0 ? searchResults : dishes}
            columns={columns}
            pagination={{ pageSize: 10 }}
            scroll={{ y: 400 }}
            bordered
          />
        </Tablecontainer>
        <Modald title="Thêm món ăn" open={isModalOpen} setStatus={setStatus} onCancel={handleCancel} footer={null}>
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ dishName: stateDish?.name,
                dishPrice: stateDish?.price,
                menuId: stateDish?.menuId, 
                dishStatus: stateDish?.dishStatus, }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Tên món"
              name="dishName"
              rules={[{ required: true, message: 'Vui lòng nhập tên món ăn!' }]}
            >
              <InpuComponent value={stateDish?.name} onChange={handleOnchange} name="dishName" placeholder="Nhập" />
            </Form.Item>

            <Form.Item
              label="Giá bán"
              name="dishPrice"
              rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
            >
              <InpuComponent value={stateDish?.name} onChange={handleOnchange} name="dishPrice" placeholder="Nhập" />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="menuId"
              rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
            >
              <Select
              value={stateDish?.name}
                onChange={handleOnchangeSelect}
                name="menuId"
                options={menus.map((menu) => ({
                  label: menu.menuTitle, 
                  value: menu.menuId,
                  name: menu.menuId  
                }))}
              />
              <span></span>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="dishStatus"
              rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
              
            >
          <Select
                
                value={stateDish?.dishStatus == 1 ? "còn món" : "đã hết" }
                onChange={(value) => setSateDish({ ...stateDish, dishStatus: value })}
                options={[
                  { label: "Còn món", value: 1 },
                  { label: "Đã hết", value:0 },
                ]}
                style={{ width: 100 }}
              />
            </Form.Item>

            <Form.Item
              label="Image"
              name="thumbnail"
              rules={[{ required: true, message: 'Thêm ảnh!' }]}
            >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <Button variant="outlined" component="label">
      <label style={{ display: 'block' }}>Thêm ảnh
      <input
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        onChange={handleOnchangeAvatar}
      />
      </label>
    </Button>

    {thumbnailPreview && (
      <img
        src={thumbnailPreview}
        alt="Thumbnail Preview"
        style={{
          width: '100px',
          height: 'auto',
          marginTop: '8px',
        }}
      />
    )}
  </div>

            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ textAlign: 'right' }}>
            <Button
              style={{ margin: '3px' }}
              onClick={handleCancel}
            >
              ĐÓNG
            </Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>

            </Form.Item>
          </Form>
        </Modald>

        <Modald title='Chỉnh sửa món ăn' isOpen={isOpenMoadl} onCancel={() => setIsOpenModal(false)}
          setStatus={setStatus}
          dishes={dishes} footer={null}>
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{
              dishName: rowSelected.dishName,
              dishPrice: rowSelected.dishPrice,
              menuId: rowSelected?.menuId, // Giá trị mặc định cho trường "menuId",
              dishStatus:rowSelected?.dishStatus,
              thumbnail:"FALSE"
            }}
            onFinish={onFinish}
            autoComplete="on"
            key={dishes.dishId}
          >
            <Form.Item
              label="Tên món"
              name="dishName"
              rules={[{ required: true, message: 'Vui lòng nhập tên món ăn!' }]}
            >
              <InpuComponent value={stateDish?.dishName} onChange={handleOnchange} name="dishName" />
              <span></span>
            </Form.Item>

            <Form.Item
              label="Giá bán"
              name="dishPrice"
              rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
            >
              <InpuComponent value={stateDish?.dishPrice} onChange={handleOnchange} name="dishPrice" />
              <span></span>

            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="menuId"
              rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
            >
              <Select
                onChange={handleOnchangeSelect}
                options={menus.map((menu) => ({
                  label: menu.menuTitle, // Hiển thị tên danh mục
                  value: menu.menuId,    // Giá trị để gửi lên server
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="dishStatus"
              rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
            >
                        <Select
                value={stateDish?.dishStatus == 1 ? "còn món" : "đã hết" }
                onChange={(value) => setSateDish({ ...stateDish, dishStatus: value })}
                options={[
                  { label: "Còn món", value: 1 },
                  { label: "Đã hết", value:0 },
                ]}
                style={{ width: 100 }}
              />
              <span></span>
            </Form.Item>

            <Form.Item
              label="Image"
              name="thumbnail"
              rules={[{ required: true, message: 'Thêm ảnh!' }]}
            >
     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Button variant="outlined" component="label">
                <label style={{ display: 'block' }}>Thêm ảnh
                <input
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  onChange={handleOnchangeAvatar}
                />
                </label>
              </Button>
              {stateDish?.thumbnail && (
                <img
                  component="img"
                  src={thumbnailPreview ?  thumbnailPreview: stateDish.thumbnail }
                  alt="Thumbnail Preview"
                  style={{
                    width: '100px',
                    height: 'auto',
                    marginTop: 2,
                  }}
                />
              )}
                </div>
                

            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modald>

        <Modald title="Xóa món ăn" open={isModalOpenDelete} onCancel={handleCancelDelete}
          onOk={() => {
            handleDeleteDish();
            setTimeout(() => {
              handleCancelDelete();
            }, 500);
          }} okText="Có" cancelText="Hủy">
              Bạn có chắc muốn xóa món{" "}
            <strong>{rowSelected?.dishName || "này"}</strong> không?
        </Modald>
      </Conter>
      <Foor />
    </div>
  )
}

export default Dish