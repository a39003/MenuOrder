import { ButtonGruoup, Conter, Tablecontainer  } from "./style"
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Modald from "../../costormer/Components/Modal/Modal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Space, Table } from "antd";
import Foor from "../../costormer/Components/Foor/Foor";

import InpuComponent from "../../costormer/Components/InputComponent/InputComponent";


const Tabled = () => {

  const [rowSelected, setRowSelected] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenMoadl, setIsOpenModal] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)

  const [table, setTables] = useState([]);
  const [status, setStatus] = useState(true);

  const [selectedTable, setSelectedTable] = useState(null);
  const [tableName, setTableName] = useState("");
  const [tableDescription, setTableDescription] = useState("");


  const handleSubmitForm = async (e) => {
    const res = await fetch(
      `http://localhost:8080/admin/tables${selectedTable ? "/" + selectedTable.tableId : ""}`,
      {
        method: `${selectedTable ? "PUT" : "POST"}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tableName: tableName,
          tableDescription: tableDescription || "",
        }),
      }
    );
    const data = await res.json();
    if (data.tableId) {
      setStatus(true);
      setTableName("");
      setTableDescription("");
      form.resetFields()
      message.success("Thành công");
    } else {
      setStatus(false);
      setTableName("");
      setTableDescription("");
      message.error(data.message);
    }
    setIsOpenModal(false)
    setIsModalOpen(false)

  };

  const handleDeleteTable = async () => {
    if (!selectedTable?.tableId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/admin/tables/${selectedTable.tableId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        message.success("Xóa bàn thành công");
        setStatus(true);
        setIsModalOpenDelete(false);
      } else {
        const errorData = await res.json();
        message.error(errorData.message || "Xóa bàn thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa bàn");
      console.error(error);
    }
  };

  useEffect(() => {
    if (status) {
      fetch("http://localhost:8080/admin/tables", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setTables(data);
          } else {
            message.error("Dữ liệu trả về không hợp lệ");
          }
        })
        .catch((error) => {
          message.error("Không thể tải danh sách bàn");
          console.error(error);
        });
      setStatus(false);
    }
  }, [status]);
  console.log(table)


  const handleDetails = (record) => {
    console.log(record)
    setSelectedTable(record); 
    setTableName(record?.tableName); // Đặt tên bàn vào input
    setTableDescription(record?.tableDescription);
    setIsOpenModal(true); // Mở modal

  }


  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }


  const navigate = useNavigate()

  const renderAction = (record) => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => {
          setIsModalOpenDelete(true);
          setSelectedTable(record);
          console.log(record)
        }} />
        <EditOutlined
          style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }}
          onClick={() => {
            setSelectedTable(record);
            handleDetails(record);
          }}
        />
      </div>
    )
  }


  const handleCancel = () => {
    setIsModalOpen(false)
    setTableName({
      tableName: '',
    })
    setTableDescription({
     tableDescription:'', 
      })
    form.resetFields()
    console.log("....");
  };

  const [form] = Form.useForm();



  const columns = [
    {
      title: 'Tên bàn',
      dataIndex: 'tableName',
      key: 'tableName'
    },
    {
      title: 'Mô tả',
      dataIndex: 'tableDescription',
      key: 'tableDescription'
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => renderAction(record)
    }
  ];

  const [dataSource, setDataSource] = useState([
    { key: "1", name: "Bàn 1", link: "" },
    { key: "2", name: "Bàn 2", link: "" },
    { key: "3", name: "Bàn 3", link: "" },
  ]);

  return (
    <div>
      <Conter style={{ textAlign: 'center', padding: '20px', backgroundColor: "#f3e2d3" }}>
        <h1>QUẢN LÝ BÀN</h1>
        <div style={{ margin: '10px' }}>
          <ButtonGruoup onClick={() => setIsModalOpen(true)}>Thêm mới</ButtonGruoup>
        </div>
        <Tablecontainer >
          <Table onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                setRowSelected(record)
              }
            };
          }}
            dataSource={table}
            columns={columns}
            pagination={{pageSize: 6 }}
            bordered
            rowKey="tableId"
            style={{ overflowX: 'auto' }}
          />
        </Tablecontainer>
        <Modald title="Thêm bàn" open={isModalOpen} setStatus={setStatus} onCancel={handleCancel} footer={null}>
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
              label="Tên bàn"
              name="tableName"
              rules={[{ required: true, message: 'Vui lòng nhập tên bàn!' }]}
            >
              <InpuComponent value={tableName} onChange={(e) => setTableName(e.target.value)} name="tableName" placeholder="Nhập"/>
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="tableDescription"
            >
              <InpuComponent value={tableDescription} onChange={(e) => setTableDescription(e.target.value)} name="tableDescription" placeholder="Nhập"/>
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

        <Modald title='Chỉnh sửa bàn'

          isOpen={isOpenMoadl}
          onCancel={() => {
            setIsOpenModal(false);
            handleCancel();
          }}
          footer={null}
          setStatus={setStatus}
          table={table}
        >
          <Form
            key={table?.tableId}
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ tableName: selectedTable?.tableName,
             tableDescription: selectedTable?.tableDescription}} 
            onFinish={() => {
              handleSubmitForm();
              setTimeout(() => {
                setIsModalOpen(false);
              }, 500);
            }}
            autoComplete="on"
          >
            <Form.Item
              label="Tên bàn"
              name="tableName"
              rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
            >
              <InpuComponent defaultValue={tableName} value={tableName} onChange={(e) => {
                setTableName(e.target.value);
                }} />
              <span></span>
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="tableDescription"
            >
              <InpuComponent defaultValue={tableDescription} value={tableDescription} onChange={(e) => {
                setTableDescription(e.target.value);
                }} />
              <span></span>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button
              style={{ marginLeft: '10px' }}
              onClick={handleCancel}
            >
              ĐÓNG
            </Button>              
            </Form.Item>
          </Form>
        </Modald>


        <Modald title="Xóa Bàn" open={isModalOpenDelete} onCancel={handleCancelDelete}
          onOk={() => {
            handleDeleteTable();
            setTimeout(() => {
              handleCancelDelete();
            }, 500);
          }} okText="Có" cancelText="Hủy">
            Bạn có chắc muốn xóa bàn{" "}
            <strong>{selectedTable?.tableName || "này"}</strong> không?
        </Modald>
      </Conter>
      <Foor />
    </div>
  )
}

export default Tabled