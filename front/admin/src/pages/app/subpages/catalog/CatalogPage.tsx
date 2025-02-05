import { useAccessToken } from "../../../AccesstokenProvider";
import { getGalreeConfig } from "../../../config";
import { getSheetData } from "../../../google/sheet";

const CatalogPage = () => {
	const accessToken = useAccessToken();
	const loadSheet = async () => {
		const sheetData = await getSheetData(
			getGalreeConfig().googleSheetId,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			accessToken()?.accessToken!,
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
