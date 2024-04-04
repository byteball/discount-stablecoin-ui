import React from "react";
import ReactGA from "react-ga";

import MainStyles from "../../Home.module.css";
import styles from "./Faq.module.css"

export const Faq = () => (
	<div className={`${MainStyles.container} faq`}>
		<div className={styles.title}>
			F.A.Q.
		</div>
		<div className={styles.collapse}>
			<div key="1" className={styles.panel}>
				<h2>When stablecoins appreciate, where is the money coming from?</h2>
				<p>
					From traders. Traders borrow stablecoins when they are worth less and repay their loans later when
					stablecoins are worth slightly more. They have to pay the difference for using the borrowed money while
					holders of stablecoins
					earn the same difference.
				</p>
			</div>

			<div key="2" className={styles.panel}>
				<h2>How do I get stablecoins?</h2>
				<p>
					Depending on your investment strategy, buy them on an exchange or{" "}
					<a href="/app/" target="_blank" onClick={() => {
						ReactGA.event({
							category: 'Home page',
							action: 'Go to the app',
							label: 'faq'
						});
					}}>issue</a>{" "}
					new stablecoins on this website.
				</p>
			</div>
			<div key="3" className={styles.panel}>
				<h2>How are stablecoins issued?</h2>
				<p>
					Stablecoins are{" "}
					<a href="/app/" target="_blank" onClick={() => {
						ReactGA.event({
							category: 'Home page',
							action: 'Go to the app',
							label: 'faq'
						});
					}}>issued</a>{" "}
					as debt against GBYTE collateral when a trader borrows them on this website. The
					collateral is larger than the value of the stablecoins issued (usually 150%) to ensure that the debt is
					properly secured.
				</p>
			</div>
			<div key="4" className={styles.panel}>
				<h2>Do I need to issue stablecoins in order to benefit from their appreciation?</h2>
				<p>
					No. Issuing is for traders who try to make money from price movements of GBYTE against USD, GBYTE against
					BTC, gold against USD, etc. To benefit from stablecoin appreciation, buy stablecoins on an exchange.
				</p>
			</div>
			<div key="5" className={styles.panel}>
				<h2>How do I sell/redeem stablecoins?</h2>
				<p>
					Sell them on an exchange or, if you hold a loan,{" "}
					<a href="/app/" target="_blank" onClick={() => {
						ReactGA.event({
							category: 'Home page',
							action: 'Go to the app',
							label: 'faq'
						});
					}}>repay it on this website</a>.
				</p>
			</div>
			<div key="6" className={styles.panel}>
				<h2>Where are stablecoins traded?</h2>
				<p>
					Stablecoins are traded on:
				</p>
				<ul>
					<li>
						<a target="_blank" rel="noopener" href="https://odex.ooo/" onClick={() => {
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
						<a target="_blank" rel="noopener" href="https://oswap.io/" onClick={() => {
							ReactGA.event({
								category: 'Home page',
								action: 'Go to oswap',
								label: 'faq'
							});
						}}>
							Oswap automated market maker
						</a>: stable vs GBYTE, stable vs stable;
					</li>
					<li>
						<a target="_blank" rel="noopener" href="https://cryptox.pl/BTC_20200701-BTC.html" onClick={() => {
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
			</div>
			<div key="7" className={styles.panel}>
				<h2>What makes stablecoins pegged to their benchmark?</h2>
				<p>
					They have limited lifetime and after the expiry date they can be exchanged for GBYTE exactly at the
					exchange
					rate registered on that date. Their price on any earlier date is “pulled” to traders’ expectations about
					the asset’s price
					on the expiry date. This is exactly the same mechanism that determines the prices of futures contracts.
				</p>
			</div>
			<div key="8" className={styles.panel}>
				<h2>What are these numbers like 20200701 in stablecoin names?</h2>
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
			</div>
			<div key="9" className={styles.panel}>
				<h2>What happens if I don’t sell stablecoins before the expiry date?</h2>
				<p>
					You can still{" "}
					<a href="/app/" target="_blank" onClick={() => {
						ReactGA.event({
							category: 'Home page',
							action: 'Go to the app',
							label: 'faq'
						});
					}}>sell them on this website</a>{" "}
					but the exchange rate vs GBYTE is as it was on the expiry date.
					That is, your stablecoins stop being stable relative to their original benchmark (USD, BTC, …) and become
					stable relative to GBYTE.
				</p>
			</div>
			<div key="10" className={styles.panel}>
				<h2>What are the risks?</h2>
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
			</div>
			<div key="11" className={styles.panel}>
				<h2>How are discount stablecoins different from DAI, USDT, USDC, etc?</h2>
				<p>Discount stablecoins appreciate, while the other ones don’t.</p>
				<p>Discount stablecoins are an investment instrument in the first place, while every other stablecoin is a
					payment medium.</p>
			</div>
			<div key="12" className={styles.panel}>
				<h2>What leverage can I get when taking a long position in GBYTE?</h2>
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
			</div>
			<div key="13" className={styles.panel}>
				<h2>What happens if a loan becomes undercollateralized?</h2>
				<p>It is put on{" "}
					<a href="/app/auction" target="_blank" onClick={() => {
						ReactGA.event({
							category: 'Home page',
							action: 'Go to the app (auction)',
							label: 'faq'
						});
					}}>auction</a>.{" "}
					Auction participants bid to add more collateral to bring it back to a healthy
					collateralization ratio, and the one who offers the largest additional collateral wins the auction. The
					loan is assigned to the
					winner while the former borrower loses the right to repay the loan and reclaim the collateral which is
					still worth more than the
					loan value.</p>
			</div>
			<div key="14" className={styles.panel}>
				<h2>I want to trade a stablecoin pegged to asset X but it doesn’t exist</h2>
				<p>
					If an oracle that posts the price of X already exists, you can{" "}
					<a href="/app/deploy" target="_blank" onClick={() => {
						ReactGA.event({
							category: 'Home page',
							action: 'Go to the app (deploy)',
							label: 'faq'
						});
					}}>create the corresponding stablecoin</a> right away!
				</p>
				<p>
					If there is no such oracle yet &mdash; create the oracle. You have to be a developer though. There are sources
					of <a href="https://github.com/byteball/oracle-example" target="_blank" onClick={() => {
						ReactGA.event({
							category: 'Home page',
							action: 'Go to github (oracle-example)',
							label: 'faq'
						});
					}}>example oracle</a> to help you get started. If you are not a developer and cannot hire one, signal your
					demand in <a target="_blank" rel="noopener" href="https://discord.obyte.org/" onClick={() => {
						ReactGA.event({
							category: 'Home page',
							action: 'Go to discord',
							label: 'faq'
						});
					}}>Obyte discord</a>.
				</p>
			</div>
		</div>
	</div>
)
