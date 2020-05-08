import React from "react";
import MainStyles from "../../Home.module.css";
import styles from "./Footer.module.css"

export const Footer = () => (
		<footer className={styles.footer}>
			<div className={MainStyles.container}>
				<div className={styles.discord}>
					Any other questions? Read the <a target="_blank" href="https://medium.com/obyte/introducing-discount-stablecoins-6e7b5e9a8fd6">introductory article</a> or ask on <a target="_blank" href="https://discord.obyte.org/">discord</a>
				</div>
				<div className="footer__cop">&copy; Obyte</div>
			</div>
		</footer>
)