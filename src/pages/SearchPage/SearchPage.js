import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { truncate } from "lodash";
import { Popover, Row, Table } from "antd";
import { useHistory } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { SearchForm } from "../../forms";
import { useWindowSize } from "../../hooks/useWindowSize";
import { aasTotalCoin } from "../../store/actions/aa/aasTotalCoin";
import moment from "moment";
import { changeActiveAA } from "../../store/actions/aa";
import styles from "./SearchPage.module.css";
export const SearchPage = props => {
  const listByBase = useSelector(state => state.aa.listByBase);
  const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);
  const totalCoinList = useSelector(state => state.aa.totalCoinList);
  const totalCoinListLoaded = useSelector(
    state => state.aa.totalCoinListLoaded
  );
  const dispatch = useDispatch();
  let history = useHistory();
  const [dataSource, setDataSource] = useState([]);
  const [dataSearch, setDataSearch] = useState(null);
  const [width] = useWindowSize();
  const truncateOptions = { length: width < 1280 ? 13 : 20 };
  const columns = [
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: text => {
        if (width >= 1440) {
          return text;
        } else {
          if (text.length > truncateOptions.length) {
            return (
              <Popover content={<div style={{ maxWidth: 600 }}>{text}</div>}>
                <span>{truncate(text, truncateOptions)}</span>
              </Popover>
            );
          } else {
            return text;
          }
        }
      }
    },
    {
      title: "Oracle",
      dataIndex: "oracle",
      key: "oracle",
      render: text => {
        if (width >= 1440) {
          return text;
        } else {
          if (text.length > truncateOptions.length) {
            return (
              <Popover content={<div style={{ maxWidth: 600 }}>{text}</div>}>
                <span>{truncate(text, truncateOptions)}</span>
              </Popover>
            );
          } else {
            return text;
          }
        }
      }
    },
    {
      title: "Feed name",
      dataIndex: "feed_name",
      key: "feed_name",
      width: width >= 1280 ? "auto" : "none",
      render: text => {
        if (width >= 1440) {
          return text;
        } else {
          if (text.length > truncateOptions.length) {
            return (
              <Popover content={<div style={{ maxWidth: 600 }}>{text}</div>}>
                <span>{truncate(text, truncateOptions)}</span>
              </Popover>
            );
          } else {
            return text;
          }
        }
      }
    },
    {
      title: "M.a. feed name",
      dataIndex: "ma_feed_name",
      key: "ma_feed_name",
      width: width >= 1280 ? "auto" : "none",
      render: text => {
        if (width >= 1440) {
          return text;
        } else {
          if (text.length > truncateOptions.length) {
            return (
              <Popover content={<div style={{ maxWidth: 600 }}>{text}</div>}>
                <span>{truncate(text, truncateOptions)}</span>
              </Popover>
            );
          } else {
            return text;
          }
        }
      }
    },
    {
      title: "Expiry date",
      dataIndex: "expiry_date",
      key: "expiry_date",
      width: 100
    },
    {
      title: "Total stablecoins",
      dataIndex: "total",
      key: "total",
      width: 100
    }
  ];
  useEffect(() => {
    dispatch(aasTotalCoin());
  }, [dispatch, listByBase]);

  useEffect(() => {
    if (listByBaseLoaded) {
      const dataSource = listByBase.map(aa => {
        const params = aa.definition[1].params;
        const address = aa.address;
        const total =
          totalCoinList && String(address) in totalCoinList
            ? totalCoinList[address]
            : 0;
        return {
          key: address,
          address: address,
          oracle: params.oracle,
          feed_name: params.feed_name,
          ma_feed_name: params.ma_feed_name,
          expiry_date: params.expiry_date,
          decimals: params.decimals,
          max_loan:
            Number(params.max_loan_value_in_underlying) /
            Number(10 ** params.decimals),
          total: Number(total) / 10 ** Number(params.decimals),
          auction_period: params.auction_period,
          overcollateralization_ratio: params.overcollateralization_ratio,
          liquidation_ratio: params.liquidation_ratio
        };
      });
      setDataSource(
        dataSource.sort(function(a, b) {
          return b.total - a.total;
        })
      );
    }
  }, [listByBase, listByBaseLoaded, totalCoinList]);
  const DateNow = moment()
    .utc(false)
    .unix();
  const handleSearch = data => {
    let newList = [...dataSource];
    const {
      oracle,
      feedName,
      maFeedName,
      maxLoan,
      decimals,
      collateralizationRatio,
      liquidationRatio,
      hideExpired,
      auctionPeriod
    } = data;
    if (oracle.value) {
      newList = newList.filter(aa => {
        return (
          aa.oracle.toUpperCase().indexOf(oracle.value.toUpperCase()) !== -1
        );
      });
    }
    if (collateralizationRatio.value) {
      newList = newList.filter(aa => {
        return (
          String(aa.overcollateralization_ratio) ===
          String(collateralizationRatio.value)
        );
      });
    }
    if (liquidationRatio.value) {
      newList = newList.filter(aa => {
        return String(aa.liquidation_ratio) === String(liquidationRatio.value);
      });
    }
    if (auctionPeriod.value) {
      newList = newList.filter(aa => {
        return String(aa.auction_period) === String(auctionPeriod.value);
      });
    }
    if (feedName.value) {
      newList = newList.filter(aa => {
        return (
          aa.feed_name.toUpperCase().indexOf(feedName.value.toUpperCase()) !==
          -1
        );
      });
    }
    if (maFeedName.value) {
      newList = newList.filter(aa => {
        return (
          aa.ma_feed_name
            .toUpperCase()
            .indexOf(maFeedName.value.toUpperCase()) !== -1
        );
      });
    }
    if (maxLoan.value) {
      newList = newList.filter(aa => {
        return String(aa.max_loan) === String(maxLoan.value);
      });
    }
    if (decimals.value) {
      newList = newList.filter(aa => {
        return String(aa.decimals) === String(decimals.value);
      });
    }
    if (hideExpired) {
      newList = newList.filter(aa => {
        return DateNow <= moment.utc(aa.expiry_date).unix();
      });
    }
    setDataSearch(newList);
  };
  return (
    <Layout title="Search" page="search">
      <SearchForm onSearch={handleSearch} />
      {dataSource.length !== 0 && width >= 800 && (
        <Table
          dataSource={dataSearch || dataSource}
          columns={columns}
          size="middle"
          loading={!totalCoinListLoaded}
          rowKey={record => record.key}
          rowClassName={styles.row}
          onRow={record => {
            return {
              onClick: event => {
                dispatch(changeActiveAA(record.address));
                history.push("/app");
              }
            };
          }}
        />
      )}
      {dataSource.length !== 0 && width < 800 && (
        <Row>
          {(dataSearch || dataSource).map((aa, i) => {
            return (
              <div
                key={"aa" + aa.key + i}
                className={styles.viewRow}
                onClick={() => {
                  dispatch(changeActiveAA(aa.address));
                  history.push("/app");
                }}
              >
                <div>
                  <b>Address:</b> {aa.address}
                </div>
                <div>
                  <b>Oracle:</b> {aa.oracle}
                </div>
                <div>
                  <b>Feed name:</b> {aa.feed_name}
                </div>
                <div>
                  <b>M.a. feed name:</b> {aa.ma_feed_name}
                </div>
                <div>
                  <b>Max Loan:</b> {aa.max_loan}
                </div>
                <div>
                  <b>Auction period:</b> {aa.auction_period}
                </div>
                <div>
                  <b>overcollateralization ratio:</b>{" "}
                  {aa.overcollateralization_ratio}
                </div>
                <div>
                  <b>liquidation ratio:</b> {aa.liquidation_ratio}
                </div>
                <div>
                  <b>Expiry date:</b> {aa.expiry_date}
                </div>
                <div>
                  <b>Total stablecoins:</b> {aa.total}
                </div>
              </div>
            );
          })}
        </Row>
      )}
    </Layout>
  );
};
