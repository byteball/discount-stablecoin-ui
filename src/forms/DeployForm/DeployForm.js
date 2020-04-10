import React, { useState } from "react";
import obyte from "obytenewfork";
import { trim } from "lodash";
import { Form, Input, Button, Row, Col, DatePicker } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";

import { pendingDeployRequest } from "../../store/actions/deploy";

import { LabelForm } from "../../components/LabelForm/LabelForm";

import config from "../../config";
import { toNumericValue, t } from "../../utils";

const initStateInput = {
  value: "",
  valid: true,
  error: {
    status: "success",
    help: ""
  }
};
const defaultValues = {
  oracle: config.TESTNET ? "F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N" : "JPQKPRI5FMTQRJF4ZZMYZYDQVRD55OTC",
  feedName: "GBYTE_USD",
  maFeedName: "GBYTE_USD_MA",
  maxLoan: "100000",
  decimals: "2",
  collateralizationRatio: "1.5",
  liquidationRatio: "1.3"
};
export const DeployForm = ({ params }) => {
  const [inputs, setInputs] = useState({
    oracle: { ...initStateInput, value: defaultValues.oracle },
    feedName: { ...initStateInput, value: defaultValues.feedName },
    maFeedName: { ...initStateInput, value: defaultValues.maFeedName },
    maxLoan: { ...initStateInput, value: defaultValues.maxLoan },
    decimals: { ...initStateInput, value: defaultValues.decimals },
    collateralizationRatio: {
      ...initStateInput,
      value: defaultValues.collateralizationRatio
    },
    liquidationRatio: {
      ...initStateInput,
      value: defaultValues.liquidationRatio
    },
    expiryDate: {
      ...initStateInput,
      valid: false,
      error: {
        status: "",
        help: ""
      }
    },
    auctionPeriod: {
      ...initStateInput,
      value: "3600"
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
    expiryDate,
    auctionPeriod
  } = inputs;
  const dispatch = useDispatch();
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
    const reg = /^[0-9.]+$/g;
    if (value) {
      if (reg.test(value)) {
        if (Number(value) <= 1e16) {
          changeInput("maxLoan", value, true);
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

  const handleChangeExpiryDate = (momentDate, date) => {
    if (momentDate) {
      if (moment(date).isValid()) {
        const StringDateNow = moment().format("YYYY-MM-DD");
        if (moment(StringDateNow).isSameOrBefore(date)) {
          changeInput("expiryDate", momentDate, true);
        } else {
          changeInput(
            "expiryDate",
            momentDate,
            false,
            t("forms.error.datePassed")
          );
        }
      } else {
        changeInput(
          "expiryDate",
          undefined,
          false,
          t("forms.error.notValid", { field: "Date" })
        );
      }
    } else {
      changeInput("expiryDate", undefined, false, "", false);
    }
  };
  const handleSummit = ev => {
    ev.preventDefault();
    const url = `obyte${
      config.TESTNET ? "-tn" : ""
      }:data?app=definition&definition=${encodeURIComponent(AA)}`;
    dispatch(
      pendingDeployRequest(
        {
          oracle: oracle.value,
          overcollateralization_ratio: toNumericValue(
            collateralizationRatio.value
          ),
          max_loan_value_in_underlying: toNumericValue(
            Number(maxLoan.value) * 10 ** Number(decimals.value)
          ),
          decimals: toNumericValue(decimals.value),
          auction_period: toNumericValue(auctionPeriod.value),
          liquidation_ratio: toNumericValue(liquidationRatio.value),
          feed_name: feedName.value,
          ma_feed_name: maFeedName.value,
          expiry_date: expiryDate.valid && expiryDate.value.format("YYYY-MM-DD")
        },
        url
      )
    );
  };
  const AA = `{
  base_aa: '${config.BASE_AA}',
  params: {
    oracle: '${oracle.value}',
    overcollateralization_ratio: ${collateralizationRatio.value},
    max_loan_value_in_underlying: ${String(
    Number(maxLoan.value) * 10 ** Number(decimals.value)
  )}, 
    decimals: ${decimals.value}, 
    auction_period: ${auctionPeriod.value}, 
    liquidation_ratio: ${liquidationRatio.value}, 
    feed_name: '${feedName.value}',
    ma_feed_name: '${maFeedName.value}',
    expiry_date: '${expiryDate.valid && expiryDate.value.format("YYYY-MM-DD")}'
  }
}`;
  const validInputsData =
    oracle.valid &&
    feedName.valid &&
    maFeedName.valid &&
    maxLoan.valid &&
    decimals.valid &&
    collateralizationRatio.valid &&
    liquidationRatio.valid &&
    auctionPeriod.valid &&
    expiryDate.valid;

  return (
    <Form onSubmit={handleSummit}>
      <Row>
        <Form.Item
          hasFeedback
          validateStatus={oracle.error.status}
          help={oracle.error.help}
          label={<LabelForm field="oracle" page="deploy" tooltip={true} />}
          colon={false}
        >
          <Input
            size="large"
            value={oracle.value}
            onChange={handleChangeOracle}
          />
        </Form.Item>
      </Row>
      <Row>
        <Col md={{ span: 7, offset: 0 }} xs={{ span: 24, offset: 0 }}>
          <Form.Item
            hasFeedback
            validateStatus={collateralizationRatio.error.status}
            help={collateralizationRatio.error.help}
            label={
              <LabelForm
                field="overCollateralizationRatio"
                page="deploy"
                tooltip={true}
              />
            }
            colon={false}
          >
            <Input
              size="large"
              value={collateralizationRatio.value}
              onChange={ev => handleChangeRation(ev, "collateralizationRatio")}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 7, offset: 2 }}>
          <Form.Item
            hasFeedback
            validateStatus={liquidationRatio.error.status}
            help={liquidationRatio.error.help}
            label={
              <LabelForm
                field="liquidationRatio"
                page="deploy"
                tooltip={true}
              />
            }
            colon={false}
          >
            <Input
              size="large"
              value={liquidationRatio.value}
              onChange={ev => handleChangeRation(ev, "liquidationRatio")}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 6, offset: 2 }}>
          <Form.Item
            hasFeedback
            validateStatus={auctionPeriod.error.status}
            help={auctionPeriod.error.help}
            label={
              <LabelForm field="auctionPeriod" page="deploy" tooltip={true} />
            }
            colon={false}
          >
            <Input
              size="large"
              value={auctionPeriod.value}
              onChange={handleAuctionPeriod}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11 }}>
          <Form.Item
            hasFeedback
            validateStatus={feedName.error.status}
            help={feedName.error.help}
            label={<LabelForm field="feedName" page="deploy" tooltip={true} />}
            colon={false}
          >
            <Input
              size="large"
              value={feedName.value}
              onChange={ev => handleChangeFeed(ev, "feedName")}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11, offset: 2 }}>
          <Form.Item
            hasFeedback
            validateStatus={maFeedName.error.status}
            help={maFeedName.error.help}
            label={
              <LabelForm field="maFeedName" page="deploy" tooltip={true} />
            }
            colon={false}
          >
            <Input
              size="large"
              value={maFeedName.value}
              onChange={ev => handleChangeFeed(ev, "maFeedName")}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11, offset: 0 }}>
          <Form.Item
            hasFeedback
            validateStatus={maxLoan.error.status}
            help={maxLoan.error.help}
            label={<LabelForm field="maxLoan" page="deploy" tooltip={true} />}
            colon={false}
          >
            <Input
              size="large"
              style={{ width: "100%" }}
              onChange={handleChangeMaxLoan}
              value={maxLoan.value}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11, offset: 2 }}>
          <Form.Item
            hasFeedback
            validateStatus={decimals.error.status}
            help={decimals.error.help}
            label={<LabelForm field="decimals" page="deploy" tooltip={true} />}
            colon={false}
          >
            <Input
              size="large"
              style={{ width: "100%" }}
              value={decimals.value}
              onChange={handleChangeDecimal}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 11 }}>
          <Form.Item
            hasFeedback
            validateStatus={expiryDate.error.status}
            help={expiryDate.error.help}
            label={
              <LabelForm field="expiryDate" page="deploy" tooltip={true} />
            }
            colon={false}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              onChange={handleChangeExpiryDate}
              value={expiryDate.value ? moment(expiryDate.value) : undefined}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            disabled={!validInputsData}
          >
            {t("forms.deploy.submit")}
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};
