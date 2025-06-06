import { DashboardCard } from '@/types/dashboard-cards';

// https://:URL/api/v1/dashboard/dashboard_cards?no_verifiers=1
export async function getDashboardCards(domain: string, token: string): Promise<DashboardCard[]> {
  const response = await fetch(
    `https://${domain}/api/v1/dashboard/dashboard_cards?no_verifiers=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.json();
}
