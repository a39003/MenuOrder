import React from 'react';
import { Typography, Image, Row, Col, message } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import logo from "../../../config/ngon.jpeg";
import logo1 from "../../../config/dep.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { Headers, Titles, Contents, ContentMain1, Footer, Cartd } from './style';

const { Text } = Typography;

const ClientTable = () => {
  const navigate = useNavigate();
  const params = useParams();

  const handleCreateOrder = async () => {
    await fetch(`http://localhost:8080/${params.tableId}/menus`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.length > 0) {
          message.success("Tạo order thành công");
          navigate(`/menu/${params.tableId}`);
        }
      });
  };

  return (
    <div style={{ margin: '0 auto', backgroundColor: '#FFF', maxWidth: '100%' }}>

      <Headers style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <Titles level={4}>TLU QUÁN</Titles>
      </Headers>


      <Contents>
        <ContentMain1>
          <div
            style={{
              borderRadius: '15px',
              overflow: 'hidden',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <Image
              src={logo}
              alt="Food"
              preview={false}
              style={{ borderRadius: '15px', width: '100%' }}
            />
          </div>

          <Titles level={3} style={{ fontSize: '22px', margin: '0', fontWeight: 'bold' }}>
            TLU QUÁN
          </Titles>
          <Text type="secondary" style={{ fontSize: '14px', lineHeight: '22px' }}>
            Monday - Sunday <br />
            6PM - 12PM
          </Text>
        </ContentMain1>

        {/* Promotion Section */}
        <Row
          style={{
            backgroundColor: '#F1EFEF',
            borderRadius: '25px',
            padding: '15px',
            textAlign: 'center',
            margin: '10px 0',
          }}
          gutter={[16, 16]}
        >
          <Col xs={24} md={12}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Giảm ngay{' '}
              <span style={{ color: '#FF0000', fontSize: '20px', fontWeight: 'bold' }}>20%</span>
            </Text>
          </Col>
          <Col xs={24} md={12}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              CHO KHÁCH ĐẶT BÀN ONLINE
            </Text>
          </Col>
          <Col xs={24}>
            <Image
              src={logo1}
              alt="Promotion"
              preview={false}
              style={{ borderRadius: '10px', width: '100%' }}
            />
          </Col>
        </Row>
      </Contents>

 
      <Cartd onClick={handleCreateOrder} style={{ textAlign: 'center', margin: '20px 0' }}>
        <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Order Now</p>
      </Cartd>

      <Footer style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px' }}>
        Địa Chỉ: Nghiêm Xuân Yên - Đại Kim - Hoàng Mai - Hà Nội <br />
        SDT: 012345678
      </Footer>
    </div>
  );
};

export default ClientTable;
