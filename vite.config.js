import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'pages/about.html',
        applyNow: 'pages/apply-now.html',
        balanceTransfer: 'pages/balance-transfer.html',
        contact: 'pages/contact.html',
        emergencyLoan: 'pages/emergency-loan.html',
        emiCalculator: 'pages/emi-calculator.html',
        homeRenovation: 'pages/home-renovation.html',
        overdraftLoan: 'pages/overdraft-loan.html',
        personalLoan: 'pages/personal-loan.html',
        privacyPolicy: 'pages/privacy-policy.html',
        terms: 'pages/terms.html',
        weddingLoan: 'pages/wedding-loan.html'
      }
    }
  }
})
