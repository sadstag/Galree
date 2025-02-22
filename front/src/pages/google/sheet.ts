export async function getSheetData(sheetId: string, accessToken: string) {
    const range = "Artworks!A2:E";

    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
        { headers: { "Authorization": `Bearer ${accessToken}` } },
    );

    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
