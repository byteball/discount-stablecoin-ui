import React from "react";
import styles from "./Header.module.css";
import MainStyles from "../../Home.module.css";
import growth from "./img/growth.svg";

export const Header = () => (
		<header className={styles.wrap}>
			<div className={MainStyles.container}>
				<div className={styles.button}>
					<a target="_blank" rel="noopener" href="/app">Open app</a>
				</div>
				<div className={styles.descr}>
					<div className={styles.titles}>
						<h1 className={styles.main_title}>Discount Stablecoins</h1>
						<h2 className={styles.sub_title}>Stablecoins that appreciate in value</h2>
						<div className={styles.discount}>
							Discount stablecoins track the value of real-world assets and indexes, e.g. USD, BTC, gold, etc.
							Unlike other stablecoins, they are expected to trade with a discount relative to their benchmark
							asset/index.
							As it gets closer to the expiry, the discount decreases, therefore stablecoins appreciate.
						</div>
					</div>
					<div className={styles.image}>
						<img src={growth} alt=""/>
					</div>
				</div>
			</div>
		</header>
)