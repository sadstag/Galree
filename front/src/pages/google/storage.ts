export async function listObjects(
    bucket: string,
    folder: string,
    accessToken: string,
) {
    const response = await fetch(
        `https://storage.googleapis.com/storage/v1/b/${bucket}/o?maxResults=10&prefix=${folder}/`,
        {
            headers: { "Authorization": `Bearer ${accessToken}` },
        },
    );

    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}

export async function postObject(
    bucket: string,
    objectName: string,
    accessToken: string,
) {
    const metadata = {
        name: objectName,
        contentType: "text/plain",
    };

    const boundary = "-------SEPARATOR";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
        `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${
            JSON.stringify(metadata)
        }${delimiter}Content-Type: text/plain\r\n\r\nCoucou${closeDelimiter}`;

    const response = await fetch(
        `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=multipart`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": `multipart/related; boundary="${boundary}"`,
            },
            body: multipartRequestBody,
        },
    );

    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
