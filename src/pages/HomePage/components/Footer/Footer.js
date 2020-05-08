import React from "react";
import MainStyles from "../../Home.module.css";
import styles from "./Footer.module.css"
import ReactGA from "react-ga";

export const Footer = () => (
		<footer className={styles.footer}>
			<div className={MainStyles.container}>
				<div className={styles.discord}>
					Any other questions? {" "}
					<a target="_blank" href="http://discord.obyte.org/"
					   onClick={()=>{
						   ReactGA.event({
							   category: 'Home page',
							   action: 'Go to discord',
							   label: 'footer'
						   });
					   }}
					>
						Go&nbsp;to&nbsp;discord
					</a>
				</div>
				<div className="footer__cop">&copy; Obyte</div>
			</div>
		</footer>
)