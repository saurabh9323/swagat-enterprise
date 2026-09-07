'use client';

import React from 'react';
import { ToastProvider } from './ToastProvider.jsx';

export default function AppProviders({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
