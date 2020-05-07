import React from "react";
import styles from "./Home.module.css";
import {UseCase} from "./components/UseCase/UseCase";
import {Header} from "./components/Header/Header";
import {Faq} from "./components/Faq/Faq";
import {Footer} from "./components/Footer/Footer";

export const HomePage = () => (
		<div className={styles.pageWrap}>
			<Header/>
			<UseCase/>
			<Faq/>
			<Footer/>
		</div>
)