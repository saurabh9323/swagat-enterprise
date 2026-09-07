'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { hasAdminToken } from '../services/api.js';
import { isAdminUnlocked } from '../utils/adminAuth.js';

export default function AdminGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!isAdminUnlocked() || !hasAdminToken()) {
      router.replace(`/admin/login?from=${encodeURIComponent(pathname || '/admin')}`);
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) return null;

  return children;
}
