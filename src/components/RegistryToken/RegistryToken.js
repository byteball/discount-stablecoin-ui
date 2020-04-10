import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Form, Input, Button, Typography, Icon, Result } from "antd";

import {
  pendingCheckToken,
  clearCheckToken,
  tokenRegistryClose
} from "../../store/actions/deploy";
import config from "../../config";
import base64url from "base64url";

const { Title } = Typography;

const reservedTokens = ["GBYTE", "MBYTE", "KBYTE", "BYTE"];
export const RegistryToken = () => {
  const dispatch = useDispatch();
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const symbol = useSelector(state => state.aa.symbol);
  const active = useSelector(state => state.aa.active);
  const pendingCheck = useSelector(state => state.deploy.checkTokenPending);
  const wasTaken = useSelector(state => state.deploy.checkToken);
  const { feed_name, expiry_date, decimals } = useSelector(
    state => state.aa.activeParams
  );
  const checkBtn = useRef(null);
  const regBtn = useRef(null);
  const asset = activeInfo.asset;
  // const [token, setToken] = useState({
  //   value: initToken,
  //   valid: true
  // });
  const [token, setToken] = useState(null);
  const [descr, setDescr] = useState({
    value: `USD-pegged stablecoin expiring on ${expiry_date}`,
    valid: true
  });
  useEffect(() => {
    setDescr({
      value: `USD-pegged stablecoin expiring on ${expiry_date}`,
      valid: true
    });
  }, [active, expiry_date]);
  useEffect(() => {
    dispatch(clearCheckToken());
    let initToken;
    const feedNameSplit = feed_name.split("_");
    if (feedNameSplit.length > 1) {
      initToken = `${
        feedNameSplit[feedNameSplit.length - 1]
      }_${expiry_date.replace(/-/g, "")}`;
    } else {
      initToken = `${feed_name}_${expiry_date.replace(/-/g, "")}`;
    }
    setToken({
      value: initToken,
      valid: true
    });
  }, [active, feed_name, expiry_date, dispatch]);

  const [tokenSupport, setTokenSupport] = useState({
    value: 0.1,
    valid: true
  });
  if (!token) {
    return null;
  }
  const handleChangeSymbol = ev => {
    const targetToken = ev.target.value.toUpperCase();
    // eslint-disable-next-line no-useless-escape
    const reg = /^[0-9A-Z_\-]+$/;
    if (reg.test(targetToken) || !targetToken) {
      if (targetToken.length > 0) {
        if (targetToken.length <= 40) {
          if (reservedTokens.find(t => targetToken === t)) {
            setToken({ ...token, value: targetToken, valid: false });
          } else {
            setToken({ ...token, value: targetToken, valid: true });
          }
        } else {
          setToken({
            ...token,
            value: targetToken,
            valid: false
          });
        }
      } else {
        setToken({ ...token, value: targetToken, valid: false });
      }
    }
  };

  const handleChangeSupport = ev => {
    const support = ev.target.value;
    const reg = /^[0-9.]+$/;
    const f = x => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);
    if (support) {
      if (reg.test(support) && f(support) <= 9) {
        if (Number(support) >= 0.1) {
          setTokenSupport({ ...token, value: support, valid: true });
        } else {
          setTokenSupport({ ...token, value: support, valid: false });
        }
      }
    } else {
      setTokenSupport({ ...token, value: "", valid: false });
    }
  };

  let validateStatusSymbol;
  let helpSymbol;
  if (!token.valid) {
    if (token.value.length > 40) {
      validateStatusSymbol = "error";
      helpSymbol = "The symbol must be less than 40 characters";
    } else if (reservedTokens.find(t => token.value === t)) {
      validateStatusSymbol = "error";
      helpSymbol = "This symbol name is reserved";
    } else {
      validateStatusSymbol = null;
      helpSymbol = null;
    }
  } else if (token.valid) {
    if (wasTaken === true) {
      if (symbol && symbol === token.value) {
        validateStatusSymbol = "warning";
        helpSymbol = `Symbol name ${token.value} is already assigned to this stablecoin, you can add support to this symbol.`;
      } else {
        validateStatusSymbol = "warning";
        helpSymbol =
          "This token name is already taken. This will start a dispute";
      }
    } else if (wasTaken === false) {
      validateStatusSymbol = "success";
      helpSymbol = (
        <span
          style={{ color: "#52c41a" }}
        >{`Symbol name ${token.value} is available, you can register it.`}</span>
      );
    }
  }
  let data = { symbol: token.value, asset };
  if (!wasTaken && !symbol) {
    data = { ...data, decimals };
    if (descr && descr.value.length > 0) {
      data = { ...data, description: String(descr.value) };
    }
  }
  const dataString = JSON.stringify(data);
  const dataBase64 = base64url(dataString);
  const handleSubmit = ev => {
    ev.preventDefault();
    if (wasTaken === null) {
      checkBtn.current.click();
    } else {
      regBtn.current.click();
    }
  };
  const handleChangeDescr = ev => {
    const { value } = ev.target;
    if (value.length < 140) {
      setDescr({ value, valid: true });
    } else {
      setDescr({ value, valid: false });
    }
  };
  let disabled;
  if (!tokenSupport.valid) {
    disabled = true;
  } else {
    if (wasTaken) {
      disabled = false;
    } else {
      if (descr) {
        if (descr.valid) {
          disabled = false;
        } else {
          disabled = true;
        }
      } else {
        disabled = false;
      }
    }
  }
  return (
    <>
      {"asset" in activeInfo ? (
        <Row>
          <Title level={3}>Register a ticker symbol</Title>
          {symbol && (
            <p>
              This stablecoin already has a symbol {symbol} assigned to it.
              Attempting to assign a new symbol will start a dispute process
              which can take more than 30 days. The symbol that gets more
              support (in terms of GBYTE deposits) eventually wins.
            </p>
          )}
          <Form layout="horizontal" onSubmit={handleSubmit}>
            <Form.Item
              hasFeedback
              validateStatus={validateStatusSymbol}
              help={helpSymbol}
              label="Symbol"
            >
              <Input
                value={token.value}
                size="large"
                onChange={ev => {
                  dispatch(clearCheckToken());
                  handleChangeSymbol(ev);
                }}
                disabled={pendingCheck}
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              validateStatus={tokenSupport.valid ? "success" : "error"}
              help={!tokenSupport.valid && "Minimum support 0.1 GBYTEs"}
              label="Your deposit in support of this symbol (in GBYTEs)"
              extra="You can withdraw your deposit at any time. However, if there are several competing names, the name with the largest support wins."
            >
              <Input
                value={tokenSupport.value}
                size="large"
                onChange={handleChangeSupport}
              />
            </Form.Item>
            {!(symbol || (wasTaken !== null && wasTaken)) && (
              <Form.Item
                label="Description of an asset (up to 140 characters)"
                hasFeedback
                validateStatus={descr && !descr.valid ? "error" : null}
              >
                <Input.TextArea
                  disabled={pendingCheck}
                  value={descr ? descr.value : undefined}
                  onChange={handleChangeDescr}
                />
              </Form.Item>
            )}
            <Form.Item>
              {wasTaken === null ? (
                <Button
                  type="primary"
                  size="large"
                  ref={checkBtn}
                  onClick={() => dispatch(pendingCheckToken(token.value))}
                  loading={pendingCheck}
                  disabled={!token.valid}
                >
                  Check availability
                </Button>
              ) : (
                <a
                  className="ant-btn ant-btn-primary ant-btn-lg"
                  ref={regBtn}
                  disabled={disabled}
                  href={`obyte${config.TESTNET ? "-tn" : ""}:${
                    config.TOKEN_REGISTRY_AA_ADDRESS
                  }?amount=${tokenSupport.value *
                    10 ** 9}&base64data=${dataBase64}`}
                >
                  {wasTaken
                    ? (symbol && symbol === token.value && "Add support") ||
                      "Register anyway"
                    : "Register"}
                </a>
              )}
              <Button
                type="link"
                size="large"
                style={{ marginLeft: 10 }}
                onClick={() => dispatch(tokenRegistryClose())}
              >
                Skip
              </Button>
            </Form.Item>
          </Form>
        </Row>
      ) : (
        <div>
          <Result
            icon={<Icon type="loading" />}
            title="We are waiting for the asset issue"
            extra={
              <Button
                type="link"
                size="large"
                onClick={() => dispatch(tokenRegistryClose())}
              >
                Skip
              </Button>
            }
          />
        </div>
      )}
    </>
  );
};
