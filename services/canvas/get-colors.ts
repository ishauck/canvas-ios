// https://:URL/api/v1/users/self/colors?no_verifiers=1
export async function getColors(domain: string, token: string): Promise<Record<string, string>> {
  const response = await fetch(`https://${domain}/api/v1/users/self/colors?no_verifiers=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.custom_colors;
}
