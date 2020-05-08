import React from "react";
import {Collapse, Icon} from "antd";
import MainStyles from "../../Home.module.css";
import styles from "./Faq.module.css"
import ReactGA from "react-ga";

const {Panel} = Collapse;
export const Faq = () => {

	return (
			<div className={`${MainStyles.container} faq`}>
				<div className={styles.title}>
					F.A.Q.
				</div>
				<Collapse
						accordion
						expandIconPosition="right"
						bordered={false}
						className={styles.collapse}
						expandIcon={({isActive}) => <Icon type="down" rotate={isActive ? 180 : 0} className={styles.icon}/>}
				>
					<Panel header="When stablecoins appreciate, where is the money coming from?" key="1" className={styles.panel}>
						<p>
							From traders. Traders borrow stablecoins when they are worth less and repay their loans later when
							stablecoins are worth slightly more. They have to pay the difference for using the borrowed money while
							holders of stablecoins
							earn the same difference.
						</p>
					</Panel>
					<Panel header="How do I get stablecoins?" key="2" className={styles.panel}>
						<p>
							Depending on your investment strategy, buy them on an exchange or issue new stablecoins on this website.
						</p>
					</Panel>
					<Panel header="How are stablecoins issued?" key="3" className={styles.panel}>
						<p>
							Stablecoins are issued as debt against GBYTE collateral when a trader borrows them on this website. The
							collateral is larger than the value of the stablecoins issued (usually 150%) to ensure that the debt is
							properly secured.
						</p>
					</Panel>
					<Panel header="Do I need to issue stablecoins in order to benefit from their appreciation?" key="4"
								 className={styles.panel}>
						<p>
							No. Issuing is for traders who try to make money from price movements of GBYTE against USD, GBYTE against
							BTC, gold against USD, etc. To benefit from stablecoin appreciation, buy stablecoins on an exchange.
						</p>
					</Panel>
					<Panel header="How do I sell/redeem stablecoins?" key="5" className={styles.panel}>
						<p>
							Sell them on an exchange or, if you hold a loan, repay it on this website.
						</p>
					</Panel>
					<Panel header="Where are stablecoins traded?" key="6" className={styles.panel}>
						<p>
							Stablecoins are traded on:
						</p>
						<ul>
							<li>
								<a target="_blank" href="https://odex.ooo/" onClick={()=>{
									ReactGA.event({
										category: 'Home page',
										action: 'Go to odex',
										label: 'faq'
									});
								}}>
									ODEX decentralized exchange
								</a>: stable vs GBYTE, stable vs stable;
							</li>
							<li>
								<a target="_blank" rel="noopener" href="https://www.oswap.io/" onClick={()=>{
									ReactGA.event({
										category: 'Home page',
										action: 'Go to oswap',
										label: 'faq'
									});
							}}>
									Oswap automated market maker
								</a>
								: stable vs GBYTE, stable vs stable;
							</li>
							<li>
								<a target="_blank" rel="noopener" href="https://cryptox.pl/" onClick={()=>{
									ReactGA.event({
										category: 'Home page',
										action: 'Go to cryptox',
										label: 'faq'
									});
								}}>
									Cryptox centralized exchange
								</a>
								: BTC-pegged stablecoin vs BTC.
							</li>
						</ul>
					</Panel>
					<Panel header="What makes stablecoins pegged to their benchmark?" key="7" className={styles.panel}>
						<p>
							They have limited lifetime and after the expiry date they can be exchanged for GBYTE exactly at the
							exchange
							rate registered on that date. Their price on any earlier date is “pulled” to traders’ expectations about
							the asset’s price
							on the expiry date. This is exactly the same mechanism that determines the prices of futures contracts.
						</p>
					</Panel>
					<Panel header="What are these numbers like 20200701 in stablecoin names?" key="8" className={styles.panel}>
						<p>It is their expiry dates. Every stablecoin has two distinct periods in its lifetime: before expiry and
							after expiry.</p>
						<p>
							Before the expiry date, stablecoins are issued when borrowed against GBYTE collateral and destroyed when
							the debt is repaid.
							They are also freely traded between users (e.g. on ODEX decentralized exchange).
						</p>
						<p>
							After expiry, every stablecoin has guaranteed liquidity vs GBYTE, exactly at the exchange rate of the
							benchmark asset/index
							registered on the expiry date. This is what makes it pegged to the price of the asset/index it is
							tracking.
						</p>
					</Panel>
					<Panel header="What happens if I don’t sell stablecoins before the expiry date?" key="9"
								 className={styles.panel}>
						<p>
							You can still sell them on this website but the exchange rate vs GBYTE is as it was on the expiry date.
							That
							is, your stablecoins stop being stable relative to their original benchmark (USD, BTC, …) and become
							stable relative
							to GBYTE.
						</p>
					</Panel>
					<Panel header="What are the risks?" key="10" className={styles.panel}>
						<p>Stablecoins may lose their value under some circumstances.</p>
						<p>
							Normally, stablecoins are issued against collateral that is worth much more (typically, 50% more) than the
							value of the stablecoins issued. If the collateral depreciates, the borrowers normally have enough time to
							refill the
							collateral to keep the stablecoins properly collateralized. They have good incentives to do so because if
							their
							collateralization ratio drops below certain minimum, their loan is put on auction and the borrower may
							lose part of its value. However,
							if the price of collateral drops too much too fast, the borrowers and auction participants might not have
							enough time to
							adapt and the whole system becomes undercollateralized. In such cases, the value of stablecoins might drop
							to reflect the
							value of the underlying collateral.
						</p>
						<p>
							As an investor, you need to take these risks into account and expect a higher return compared with
							risk-free investments.
						</p>
					</Panel>
					<Panel header="How are discount stablecoins different from DAI, USDT, USDC, etc?" key="11"
								 className={styles.panel}>
						<p>Discount stablecons appreciate, while the other ones don’t.</p>
						<p>Discount stablecoins are an investment instrument in the first place, while every other stablecoin is a
							payment medium.</p>
					</Panel>
					<Panel header="What leverage can I get when taking a long position in GBYTE?" key="12"
								 className={styles.panel}>
						<p>It depends on the parameters of the stablecoin you trade and the current discount. Assuming that
							overcollateralization ratio is 150% and ignoring discount, you can lock $150 worth of GBYTE collateral to
							borrow $100 worth of
							stablecoins, then sell the stablecoins for $100 worth of GBYTE. Your net investment is worth $50 ($150
							minus $100 proceeds of the sale
							of stablecoins) while exposure is $150 worth of GBYTE locked as collateral. That is, the leverage is 3:1
							($150/$50). This is
							the maximum leverage you can get with 150% overcollateralization, actual leverage is less due to discount,
							slippage, and
							trading fees.</p>
					</Panel>
					<Panel header="What happens if a loan becomes undercollateralized?" key="13" className={styles.panel}>
						<p>It is put on auction. Auction participants bid to add more collateral to bring it back to a healthy
							collateralization ratio, and the one who offers the largest additional collateral wins the auction. The
							loan is assigned to the
							winner while the former borrower loses the right to repay the loan and reclaim the collateral which is
							still worth more than the
							loan value.</p>
					</Panel>
					<Panel header="I want to trade a stablecoin pegged to asset X but it doesn’t exist" key="14"
								 className={styles.panel}>
						<p>
							If an oracle that posts the price of X already exists, you can create the corresponding stablecoin right
							away!
						</p>
						<p>
							If there is no such oracle yet -- create the oracle. You have to be a developer though. There are sources
							of example oracle to help you get started. If you are not a developer and cannot hire one, signal your
							demand in Obyte discord.
						</p>
					</Panel>
				</Collapse>
			</div>
	)
}