import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AboutPage from '../pages/public/About/AboutPage.jsx';
import ContactPage from '../pages/public/Contact/ContactPage.jsx';
import HomePage from '../pages/public/Home/HomePage.jsx';
import NotFoundPage from '../pages/public/NotFound/NotFoundPage.jsx';
import PropertiesPage from '../pages/public/Properties/PropertiesPage.jsx';
import PropertyDetailsPage from '../pages/public/PropertyDetails/PropertyDetailsPage.jsx';

export default function PublicRoutes({ desk }) {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage properties={desk.properties} stats={desk.stats} onLead={desk.addLead} />} />
        <Route path="properties" element={<PropertiesPage properties={desk.properties} onLead={desk.addLead} />} />
        <Route path="properties/:id" element={<PropertyDetailsPage properties={desk.properties} onLead={desk.addLead} />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
