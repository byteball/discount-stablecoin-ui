import React from "react";
import {Layout} from "../../components/Layout/Layout";
import {Col, Row} from "antd";

export const AboutPage = ()=><Layout title="About" page="about">
	<Row style={{ fontSize: 18 }}>
		<Col xs={{ span: 24 }} lg={{ span: 16 }} xl={{ span: 12 }}>
			<p>This website allows you to:</p>
			<ul>
				<li>borrow (issue) discount stablecoins by locking your GBYTEs as collateral;</li>
				<li>repay the loans and release the collateral;</li>
				<li>exchange stablecoins for GBYTE and vice versa at a fixed exchange rate after expiry;</li>
				<li>participate in auctions for undercollateralized loans of other users;</li>
				<li>define a new stablecoin pegged to an asset/index of your choice. It becomes available to all users.</li>
			</ul>	
			<p>
				Every stablecoin has two distinct periods in its lifetime: before expiry and after expiry.
			</p>
			<ul>
				<li>
					After expiry, every stablecoin has guaranteed liquidity vs GBYTE,
					exactly at the exchange rate of the benchmark asset/index registered on the expiry date. This is what makes it pegged to the price of the asset/index it is tracking.
				</li>
				<li>
					Before the expiry date, stablecoins are freely traded between
					users (e.g. on <a href="https://odex.ooo" target="_blank" rel="noopener">ODEX decentralized exchange</a>), and each stablecoin is expected to trade with discount
					relative to its benchmark asset/index. As it gets closer to the expiry, the
					discount decreases, therefore stablecoins appreciate. Buying a stablecoin early (with larger
					discount) and selling later (with smaller discount) allows to earn
					interest.
				</li>
			</ul>
			<p>
				<a href="https://medium.com/obyte/introducing-discount-stablecoins-6e7b5e9a8fd6" target="_blank" rel="noopener">Learn more about discount stablecoins</a>.
			</p>
		</Col>
	</Row>
</Layout>