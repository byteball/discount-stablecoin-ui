import React from "react";
import MainStyles from "../../Home.module.css";
import styles from "./Footer.module.css"
import ReactGA from "react-ga";

export const Footer = () => (
		<footer className={styles.footer}>
			<div className={MainStyles.container}>
				<div className={styles.discord}>
					Any other questions? Read the{" "}
					<a target="_blank" href="https://blog.obyte.org/introducing-discount-stablecoins-6e7b5e9a8fd6"
					   onClick={()=>{
						   ReactGA.event({
							   category: 'Home page',
							   action: 'Go to medium',
							   label: 'footer'
						   });
					   }}
					>
						introductory article
					</a>  or ask on{" "}
					<a target="_blank" href="https://discord.obyte.org/" onClick={()=>{
						ReactGA.event({
							category: 'Home page',
							action: 'Go to discord',
							label: 'footer'
						});
					}}>discord</a>.
				</div>
				<div className={styles.footer_copy}>&copy; <a target="_blank" rel="noopener" href="https://obyte.org/">Obyte</a></div>
			</div>
		</footer>
)