import styles from "./NotFound.module.css";

const NotFound = () => {
	return (
		<div class={styles.not_found}>
			<h1>404</h1>
			<p>
				Sorry, there is nothing to see there, but <a href="/admin">here</a>{" "}
				there is.{" "}
			</p>
		</div>
	);
};

export default NotFound;
