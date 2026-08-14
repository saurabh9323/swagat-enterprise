import React from 'react';
import { usePropertyDesk } from './hooks/usePropertyDesk.js';
import AppRouter from './routes/AppRouter.jsx';

export default function App() {
  const desk = usePropertyDesk();
  return <AppRouter desk={desk} />;
}
