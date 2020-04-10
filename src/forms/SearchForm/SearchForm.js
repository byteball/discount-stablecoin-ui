import React, { useState } from "react";
import obyte from "obytenewfork";
import { trim } from "lodash";
import { Form, Input, Button, Row, Col, Switch } from "antd";

import { t } from "../../utils";

const initStateInput = {
  value: "",
  valid: false,
  error: {
    status: "",
    help: ""
  }
};

export const SearchForm = ({ onSearch }) => {
  const [hideExpired, setHideExpired] = useState(false);
  const [inputs, setInputs] = useState({
    oracle: { ...initStateInput },
    feedName: { ...initStateInput },
    maFeedName: { ...initStateInput },
    maxLoan: { ...initStateInput },
    decimals: { ...initStateInput },
    collateralizationRatio: {
      ...initStateInput
    },
    liquidationRatio: {
      ...initStateInput
    },
    expiryDate: {
      ...initStateInput
    },
    auctionPeriod: {
      ...initStateInput
    }
  });
  const {
    oracle,
    feedName,
    maFeedName,
    maxLoan,
    decimals,
    collateralizationRatio,
    liquidationRatio,
    auctionPeriod
  } = inputs;
  const changeInput = (name, value, valid, help, status = true) => {
    let statusValue;
    if (status) {
      statusValue = valid ? "success" : "error";
    } else {
      statusValue = "";
    }
    setInputs({
      ...inputs,
      [name]: {
        value,
        valid,
        error: {
          status: statusValue,
          help: help || ""
        }
      }
    });
  };
  const handleChangeOracle = ev => {
    const value = ev.target.value;
    if (value) {
      if (obyte.utils.isValidAddress(value)) {
        changeInput("oracle", value, true);
      } else {
        changeInput(
          "oracle",
          value,
          false,
          t("forms.error.notValid", { field: "Address" })
        );
      }
    } else {
      changeInput("oracle", value, false, "", false);
    }
  };
  const handleChangeFeed = (ev, name) => {
    const value = ev.target.value;
    const reg = /^[a-zA-Z0-9_\-()?@#*:;/!№=~`^><&| ]+$/;
    if (value) {
      if (reg.test(value)) {
        if (trim(value).length <= 64) {
          if (trim(value).length < 1) {
            changeInput(name, value, false, t("forms.error.required"));
          } else {
            changeInput(name, value, true);
          }
        } else {
          changeInput(
            name,
            value,
            false,
            t("forms.error.maxChar", { count: 64 })
          );
        }
      }
    } else {
      changeInput(name, value, false, "", false);
    }
  };
  const handleChangeMaxLoan = ev => {
    const value = ev.target.value || "";
    const reg = /^[0-9]+$/g;
    if (value) {
      if (reg.test(value)) {
        if (Number(value) <= 1e16) {
          if (Number(value) * 10 ** Number(decimals.value) >= 1e9) {
            changeInput("maxLoan", value, true);
          } else {
            changeInput(
              "maxLoan",
              value,
              false,
              t("forms.error.minNum", {
                count: String(1e9 / 10 ** Number(decimals.value))
              })
            );
          }
        } else {
          changeInput("maxLoan", value, false, t("forms.error.muchValue"));
        }
      }
    } else {
      changeInput("maxLoan", value, false, "", false);
    }
  };
  const handleAuctionPeriod = ev => {
    const value = ev.target.value || "";
    const reg = /^[0-9]+$/g;
    if (value) {
      if (reg.test(value)) {
        if (Number(value) <= 1e16) {
          if (Number(value) >= 3000) {
            changeInput("auctionPeriod", value, true);
          } else {
            changeInput(
              "auctionPeriod",
              value,
              false,
              t("forms.error.minNum", { count: "3000" })
            );
          }
        } else {
          changeInput(
            "auctionPeriod",
            value,
            false,
            t("forms.error.muchValue")
          );
        }
      }
    } else {
      changeInput("auctionPeriod", value, false, "", false);
    }
  };
  const handleChangeDecimal = ev => {
    const value = ev.target.value;
    const reg = /^[0-9]+$/g;
    if (value) {
      if (reg.test(value)) {
        if (Number(value) <= 15) {
          if (Number(value) >= 0) {
            changeInput("decimals", value, true);
          } else {
            changeInput(
              "decimals",
              value,
              false,
              t("forms.error.minNum", { count: "0" })
            );
          }
        } else {
          changeInput(
            "decimals",
            value,
            false,
            t("forms.error.maxNum", { count: "15" })
          );
        }
      }
    } else {
      changeInput("decimals", value, false, "", false);
    }
  };
  const handleChangeRation = (ev, name) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;
    if (value) {
      if (reg.test(value)) {
        if (Number(value) <= 100000) {
          changeInput(name, value, true);
        } else {
          changeInput(
            name,
            value,
            false,
            t("forms.error.maxNum", { count: "100000" })
          );
        }
      }
    } else {
      changeInput(name, value, false, "", false);
    }
  };

  const handleSummit = ev => {
    ev.preventDefault();
    onSearch({ ...inputs, hideExpired });
  };

  return (
    <Form onSubmit={handleSummit}>
      <Row>
        <Form.Item>
          <Input
            size="large"
            value={oracle.value}
            placeholder={t("forms.deploy.fields.oracle.name")}
            onChange={handleChangeOracle}
          />
        </Form.Item>
      </Row>
      <Row>
        <Col md={{ span: 7, offset: 0 }} xs={{ span: 24, offset: 0 }}>
          <Form.Item>
            <Input
              size="large"
              value={collateralizationRatio.value}
              onChange={ev => handleChangeRation(ev, "collateralizationRatio")}
              placeholder={t(
                "forms.deploy.fields.overCollateralizationRatio.name"
              )}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 7, offset: 2 }}>
          <Form.Item>
            <Input
              size="large"
              value={liquidationRatio.value}
              onChange={ev => handleChangeRation(ev, "liquidationRatio")}
              placeholder={t("forms.deploy.fields.liquidationRatio.name")}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 6, offset: 2 }}>
          <Form.Item>
            <Input
              size="large"
              value={auctionPeriod.value}
              onChange={handleAuctionPeriod}
              placeholder={t("forms.deploy.fields.auctionPeriod.name")}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11 }}>
          <Form.Item>
            <Input
              size="large"
              value={feedName.value}
              onChange={ev => handleChangeFeed(ev, "feedName")}
              placeholder={t("forms.deploy.fields.feedName.name")}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11, offset: 2 }}>
          <Form.Item>
            <Input
              size="large"
              value={maFeedName.value}
              onChange={ev => handleChangeFeed(ev, "maFeedName")}
              placeholder={t("forms.deploy.fields.maFeedName.name")}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11, offset: 0 }}>
          <Form.Item>
            <Input
              size="large"
              style={{ width: "100%" }}
              onChange={handleChangeMaxLoan}
              value={maxLoan.value}
              placeholder={t("forms.deploy.fields.maxLoan.name")}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11, offset: 2 }}>
          <Form.Item>
            <Input
              size="large"
              style={{ width: "100%" }}
              value={decimals.value}
              onChange={handleChangeDecimal}
              placeholder={t("forms.deploy.fields.decimals.name")}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11 }}>
          <Form.Item>
            <span style={{ marginRight: 10 }}>Hide expired stablecoins? </span>
            <Switch onChange={setHideExpired} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Form.Item>
          <Button type="primary" size="large" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};
