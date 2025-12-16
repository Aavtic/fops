export async function apiFetch(
  url: string,
): Promise<Response> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

 return res;
}

export async function apiPost(url: string, payload: any): Promise<any> {
  const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
  });

 return res.json();
}

// export async function apiFetch(
//   url: string,
// ): Promise<T> {
//   const res = await fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//
//  const data: T = await res.json();
//  return data;
// }
