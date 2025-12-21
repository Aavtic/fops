export async function apiFetch(
  url: string,
): Promise<Response> {
  const res = await fetch(url, {
    headers: {
        "Content-Type": "application/json"
    },
    credentials: "include",
  });

 return res;
}

export async function apiPost(url: string, payload: any): Promise<Response> {
    const res = await fetch(url, {
        method: "POST",
        headers: {
              "Content-Type": "application/json",
          },
        body: JSON.stringify(payload),
        credentials: "include",
    });

 return res
}
