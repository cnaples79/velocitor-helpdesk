'use server';

import { supabaseClient } from '@/lib/Database/Supabase';
import { auth } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs';
import * as z from 'zod';
import { createTicketFormSchema } from './CreateTicketForm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addTicket(
  values: z.infer<typeof createTicketFormSchema>,
) {
  const { userId, getToken } = auth();
  const user = await currentUser();
  const user_fullName = user?.firstName + ' ' + user?.lastName;
  const user_email = user?.emailAddresses[0]?.emailAddress;
  const username = user?.username;

  if (!userId) {
    throw new Error('Not authenticated');
  }

  const supabaseAccessToken = await getToken({ template: 'supabase' });

  if (!supabaseAccessToken) {
    console.error('No access token found');
    return;
  }

  const supabase = await supabaseClient(supabaseAccessToken);

  if (!supabase) {
    throw new Error('No supabase client found');
  }

  const { error } = await supabase.from('tickets').insert([
    {
      ...values,
      user_id: user?.id,
      user_fullName: user_fullName,
      user_email: user_email,
      branch_id: Number(values.branch_id),
    },
  ]);

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath('/tickets');
  redirect('/tickets');
}
