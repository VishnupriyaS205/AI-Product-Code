const API_BASE_URL = "http://localhost:4000";

export async function getListings() {
  const response = await fetch(`${API_BASE_URL}/api/listings`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Could not load listings");
  }

  return result.data;
}

export async function createInquiry(inquiry) {
  const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inquiry),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Could not send inquiry");
  }

  return result.data;
}
