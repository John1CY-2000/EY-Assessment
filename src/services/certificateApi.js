
const API_BASE_URL = "https://apim-interviews-prod.azure-api.net";
const API_KEY = import.meta.env.VITE_ZALEX_API_KEY;

function formatApiDate(date) {
  const [year, month, day] = date.split("-");

  return `${Number(month)}/${Number(day)}/${year}`;
}

export async function submitCertificate(formData) {
  if (!API_KEY) {
    throw new Error("API key is missing.");
  }

  const url = new URL(`${API_BASE_URL}/request-certificate`);
  url.searchParams.set("subscription-key", API_KEY);

  const requestBody = {
    ...formData,
    issued_on: formatApiDate(formData.issued_on),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Request failed: HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.responce !== "Ok") {
    throw new Error("The server did not confirm the request.");
  }

  return data;
}
