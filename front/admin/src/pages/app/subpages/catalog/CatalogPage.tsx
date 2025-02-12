import { useContext } from "solid-js";
import { StoreContext } from "../../../../store/StoreContext";
import { getGalreeConfig } from "../../../config";
import { getSheetData } from "../../../google/sheet";

const CatalogPage = () => {
	const { state } = useContext(StoreContext);
	const loadSheet = async () => {
		const sheetData = await getSheetData(
			getGalreeConfig().googleSheetId,
			state.accessToken,
		);
		console.log({ sheetData });
	};

	return (
		<>
			<h1>Catalog</h1>
			<button type="button" onClick={loadSheet}>
				Load sheet
			</button>
		</>
	);
};

export default CatalogPage;
