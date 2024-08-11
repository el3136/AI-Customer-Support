// components/LanguageSwitcher.js
import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useLanguage } from '../LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Select
      value={language}
      onChange={handleChange}
      size="small"
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="es">Español</MenuItem>
      <MenuItem value="fr">Français</MenuItem>
    </Select>
  );
};

export default LanguageSwitcher;