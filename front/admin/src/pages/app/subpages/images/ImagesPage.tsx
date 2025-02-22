import { useContext } from "solid-js";
import { listObjects, postObject } from "../../../google/storage";
import { StoreContext } from "../../../../store/StoreContext";

const ImagesPage = () => {
	const { state } = useContext(StoreContext);

	const handleListClick = async () => {
		const bucketObjects = await listObjects(
			state.config.bucket,
			state.config.siteId,
			state.accessToken,
		);
		console.log({ bucketObjects });
	};

	const handlePutClick = async () => {
		const response = await postObject(
			state.config.bucket,
			`${state.config.siteId}/${Math.ceil(Math.random() * 10000)}.txt`,
			state.accessToken,
		);
		console.log({ putObjectResponse: response });
	};
	return (
		<>
			<h1>Images</h1>
			<button type="button" onClick={handleListClick}>
				List bucket
			</button>
			<br />
			<button type="button" onClick={handlePutClick}>
				Put random object
			</button>
		</>
	);
};

export default ImagesPage;
