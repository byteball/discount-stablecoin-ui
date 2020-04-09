import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Modal,
  Typography,
  Divider
} from "antd";
import obyte from "obyte";

import { t } from "../../utils";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const { Option } = Select;
const { Title } = Typography;

export const WalletForm = ({ onChange }) => {
  const [scWallets, setScWallets] = useLocalStorage("scWallets", []);
  const [scWalletsActive, setScWalletsActive] = useLocalStorage(
    "scWalletsActive",
    undefined
  );
  const [walletsActive, setWalletsActive] = useState(scWalletsActive);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState({
    value: "",
    valid: false,
    error: {
      status: "",
      help: ""
    }
  });
  // const [addressSingle, setAddressSingle] = useState({
  //   value: "",
  //   valid: false,
  //   error: {
  //     status: "",
  //     help: ""
  //   }
  // });
  const handleChangeAddress = ev => {
    const value = ev.target.value;
    if (value) {
      if (obyte.utils.isValidAddress(value)) {
        setAddress({
          value,
          valid: true,
          error: {
            status: "success",
            help: ""
          }
        });
      } else {
        setAddress({
          value,
          valid: false,
          error: {
            status: "error",
            help: t("forms.error.notValid", { field: "Address" })
          }
        });
      }
    } else {
      setAddress({
        value: "",
        valid: false,
        error: {
          status: "",
          help: ""
        }
      });
    }
  };
  const handleClickAdd = address => {
    setModalVisible(false);

    if (address && scWallets.find(wallet => wallet === address) === undefined) {
      const wallets = scWallets.slice();
      wallets.unshift(address);
      setScWallets(wallets);
      setWalletsActive(address);
      setScWalletsActive(address);
    }

    setAddress({
      value: "",
      valid: false,
      error: {
        status: "",
        help: ""
      }
    });
  };

  const handleSubmit = ev => {
    if (ev) {
      ev.preventDefault();
    }
    handleClickAdd(address.value);
  };

  useEffect(() => {
    if (scWallets.length > 0) {
      onChange(scWalletsActive);
    } else {
      // if (addressSingle.valid) {
      //   onChange(addressSingle.value);
      // } else {
      //   onChange("");
      // }
    }
  }, [onChange, scWalletsActive, scWallets]);

  // const handleAddressSingle = e => {
  //   const value = e.target.value;
  //   if (value) {
  //     if (obyte.utils.isValidAddress(value)) {
  //       setAddressSingle({
  //         value,
  //         valid: true,
  //         error: {
  //           status: "success",
  //           help: ""
  //         }
  //       });
  //       setScWalletsActive(value);
  //       setWalletsActive(value);
  //     } else {
  //       setAddressSingle({
  //         value,
  //         valid: false,
  //         error: {
  //           status: "error",
  //           help: t("forms.error.notValid", { field: "Address" })
  //         }
  //       });
  //     }
  //   } else {
  //     setAddressSingle({
  //       value: "",
  //       valid: false,
  //       error: {
  //         status: "",
  //         help: ""
  //       }
  //     });
  //   }
  // };

  return (
    <Form>
      <Row>
        <Title level={3}>{t("forms.wallet.title")}</Title>
        <p style={{ fontSize: 18 }}>
          This is the list of stablecoin loans you received from its Autonomous
          Agent
        </p>
        <Col md={{ span: 16 }} xs={{ span: 24 }}>
          <Form.Item>
            <Select
              key={"5464564590"}
              size="large"
              placeholder={t("forms.wallet.fields.selectAddress.name")}
              dropdownRender={menu => (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      padding: 8
                    }}
                    onMouseDown={e => e.preventDefault()}
                  >
                    <Button onClick={() => setModalVisible(true)}>
                      Add wallet
                    </Button>
                  </div>
                  <Divider style={{ margin: "4px 0" }} />
                  {menu}
                </div>
              )}
              onChange={address => {
                setScWalletsActive(address);
                setWalletsActive(address);
              }}
              value={walletsActive}
            >
              {scWallets.map((arr, i) => (
                <Option key={`${arr}${i}`} value={arr}>
                  {arr}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/*  <Form.Item*/}
          {/*    help={addressSingle.error.help}*/}
          {/*    hasFeedback*/}
          {/*    validateStatus={addressSingle.error.status}*/}
          {/*  >*/}
          {/*    <Input*/}
          {/*      placeholder={t("forms.wallet.modal.fields.address.name")}*/}
          {/*      size="large"*/}
          {/*      value={addressSingle.value}*/}
          {/*      onChange={handleAddressSingle}*/}
          {/*      autoFocus={true}*/}
          {/*    />*/}
          {/*  </Form.Item>*/}
          {/*)}*/}
        </Col>
        {/*<Col md={{ span: 6, offset: 2 }} xs={{ span: 24 }}>*/}
        {/*  <Button*/}
        {/*    size="large"*/}
        {/*    type="primary"*/}
        {/*    onClick={() => setModalVisible(true)}*/}
        {/*    icon="plus"*/}
        {/*  >*/}
        {/*    {t("forms.wallet.submit")}*/}
        {/*  </Button>*/}
        {/*</Col>*/}
      </Row>
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            {t("forms.wallet.modal.submits.cancel.name")}
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={() => handleClickAdd(address.value)}
            disabled={!address.valid}
          >
            {t("forms.wallet.modal.submits.add.name")}
          </Button>
        ]}
      >
        <Title level={3}>{t("forms.wallet.modal.title")}</Title>
        <Form onSubmit={handleSubmit}>
          <Form.Item
            help={address.error.help}
            hasFeedback
            validateStatus={address.error.status}
          >
            <Input
              placeholder={t("forms.wallet.modal.fields.address.name")}
              size="large"
              value={address.value}
              onChange={handleChangeAddress}
              autoFocus={true}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
};
