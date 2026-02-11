import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // הגדרת ה-base קריטית כדי ש-GitHub Pages ידע למצוא את הקבצים בתיקיית התיקייה של הפרויקט
  base: '/Smart-Aviv/', 
})
