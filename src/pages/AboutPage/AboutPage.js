import React from "react";
import {Layout} from "../../components/Layout/Layout";
import {Col, Row} from "antd";

export const AboutPage = ()=><Layout title="About" page="about">
	<Row style={{ fontSize: 18 }}>
		<Col xs={{ span: 24 }} lg={{ span: 16 }} xl={{ span: 12 }}>
			<p>
				Issue and redeem <a href="https://medium.com/obyte/introducing-discount-stablecoins-6e7b5e9a8fd6" target="_blank" rel="noopener  noreferrer">discount stablecoins</a>. Or define a new stablecoin
				linked to an asset of your choice.
			</p>
			<p>
				Every stablecoin has guaranteed liquidity after its expiry date,
				exactly at the exchange rate registered on the expiry date.
			</p>
			<p>
				Before the expiry date, stablecoins are freely traded between
				users, and each stablecoin is expected to trade with discount
				relative to its underlying asset. The closer to the expiry, the
				smaller the discount. Buying a stablecoin early (with larger
				discount) and selling later (with smaller discount) allows to earn
				interest.
			</p>
		</Col>
	</Row>
</Layout>