import { supabaseClient } from '@/lib/Database/Supabase';
import { TicketData } from '@/lib/Types/TicketData/TicketData';
import { auth } from '@clerk/nextjs/server';

export async function getAllTickets() {
  const { getToken } = auth();
  const supabaseAccessToken = await getToken({ template: 'supabase' });

  if (!supabaseAccessToken) {
    console.error('No access token found');
    return;
  }

  const supabase = await supabaseClient(supabaseAccessToken);

  const { data, error } = await supabase.from('tickets').select(
    `
              ticket_id,
              status,
              priority,
              user_id,
              notes,
              assigned_to,
              owned_by,
              created_at,
              branches:branches!inner(branch_name, branch_id, company_id, companies:companies!inner(company_name))
        `,
  );

  if (error) {
    throw error;
  }

  return (data as unknown as TicketData[]) || [];
}
