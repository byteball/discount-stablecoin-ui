import React from "react";
import MainStyles from "../../Home.module.css";
import styles from "./Footer.module.css"

export const Footer = () => (
		<footer className={styles.footer}>
			<div className={MainStyles.container}>
				<div className={styles.discord}>
					Any other questions? <a target="_blank" href="http://discord.obyte.org/">Go&nbsp;to&nbsp;discord</a>
				</div>
				<div className="footer__cop">&copy; Obyte</div>
			</div>
		</footer>
)