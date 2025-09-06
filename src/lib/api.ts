// src/lib/api.ts
export async function generateProgram(userData: any) {
  try {
    const response = await fetch("https://resilient-bat-710.convex.site/vapi/generate-program", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
}
