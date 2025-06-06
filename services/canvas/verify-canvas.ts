import { CanvasUser } from '@/types/user';

export const verifyCanvas = async (domain: string, accessToken: string): Promise<CanvasUser> => {
  const response = await fetch(`https://${domain}/api/v1/users/self`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
