'use client';

import { getMyPersonalSubscription } from '@/actions/stripeActions';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useSubscription = () => {
  const { data: session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ['subscription', session?.accessToken],
    queryFn: async () => {
      if (!session?.accessToken) return null;
      const response = await getMyPersonalSubscription(session.accessToken);
      return response.success ? response.data : null;
    },
    enabled: !!session?.accessToken,
  });

  const isPaidUser = data?.hasSubscription ?? false;
  const isFreeUser = !isPaidUser;

  return {
    subscription: data,
    isPaidUser,
    isFreeUser,
    isLoading,
    error,
  };
};
