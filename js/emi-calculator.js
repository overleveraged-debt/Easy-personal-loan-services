// Global variables to store current values
let currentLoanAmount = 50000;
let currentInterestRate = 9.99;
let currentLoanTenure = 1;

// Calculate EMI using the formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
function calculateEMI(principal, annualInterestRate, tenureInYears) {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = tenureInYears * 12;

    if (monthlyInterestRate === 0) {
        return principal / numberOfPayments;
    }

    const emi = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) /
               (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    return emi;
}

// Generate amortization schedule
function generateAmortizationSchedule(principal, annualInterestRate, tenureInYears) {
    const schedule = [];
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = tenureInYears * 12;
    let remainingBalance = principal;

    for (let month = 1; month <= numberOfPayments; month++) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const emi = calculateEMI(principal, annualInterestRate, tenureInYears);
        const principalPayment = emi - interestPayment;

        remainingBalance = remainingBalance - principalPayment;

        if (remainingBalance < 0) {
            remainingBalance = 0;
        }

        schedule.push({
            month: month,
            principalPaid: principalPayment,
            interestPaid: interestPayment,
            totalPayment: emi,
            remainingBalance: remainingBalance >= 0 ? remainingBalance : 0
        });
    }

    return schedule;
}

// Update display values
function updateDisplay() {
    // Update display values
    document.getElementById('loan-amount-value').textContent =
        new Intl.NumberFormat('en-IN').format(currentLoanAmount);
    document.getElementById('interest-rate-value').textContent = currentInterestRate + '%';
    document.getElementById('loan-tenure-value').textContent =
        currentLoanTenure === 1 ? '1 Year' : currentLoanTenure.toFixed(1) + ' Years';

    // Calculate EMI
    const monthlyEMI = calculateEMI(currentLoanAmount, currentInterestRate, currentLoanTenure);
    const totalAmount = monthlyEMI * currentLoanTenure * 12;
    const totalInterest = totalAmount - currentLoanAmount;

    // Update results
    document.getElementById('monthly-emi').textContent =
        '₹' + new Intl.NumberFormat('en-IN').format(Math.round(monthlyEMI));
    document.getElementById('principal-amount').textContent =
        '₹' + new Intl.NumberFormat('en-IN').format(currentLoanAmount);
    document.getElementById('total-interest').textContent =
        '₹' + new Intl.NumberFormat('en-IN').format(Math.round(totalInterest));
    document.getElementById('total-amount').textContent =
        '₹' + new Intl.NumberFormat('en-IN').format(Math.round(totalAmount));
}

// Generate amortization table
function generateAmortizationTable() {
    const schedule = generateAmortizationSchedule(currentLoanAmount, currentInterestRate, currentLoanTenure);
    const tableBody = document.getElementById('amortization-table-body');

    tableBody.innerHTML = '';

    // Limit to first 12 months for better performance/display
    const displaySchedule = schedule.slice(0, Math.min(12, schedule.length));

    displaySchedule.forEach((payment, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100';

        // Show every 3rd month after month 12, up to 5 years
        if (index >= 12) {
            const month = payment.month;
            if (month % 3 !== 0 && month <= 60) return; // Skip months not divisible by 3
        }

        row.innerHTML = `
            <td class="py-2 px-4 text-left">${payment.month}</td>
            <td class="py-2 px-4 text-right">₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.principalPaid))}</td>
            <td class="py-2 px-4 text-right">₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.interestPaid))}</td>
            <td class="py-2 px-4 text-right">₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.totalPayment))}</td>
            <td class="py-2 px-4 text-right">₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.remainingBalance))}</td>
        `;

        tableBody.appendChild(row);
    });

    // Add summary row for long loans
    if (schedule.length > 12) {
        const lastPayment = schedule[schedule.length - 1];
        const summaryRow = document.createElement('tr');
        summaryRow.className = 'border-b-2 border-gray-200 bg-gray-50 font-medium';
        summaryRow.innerHTML = `
            <td class="py-2 px-4 text-left font-bold">Final Payment</td>
            <td class="py-2 px-4 text-right">-</td>
            <td class="py-2 px-4 text-right">-</td>
            <td class="py-2 px-4 text-right">-</td>
            <td class="py-2 px-4 text-right">₹0</td>
        `;
        tableBody.appendChild(summaryRow);
    }
}

// Download PDF
function downloadPDF() {
    try {
        const { jsPDF } = window.jspdf;

        if (!jsPDF) {
            alert('PDF generation library not loaded. Please refresh the page and try again.');
            return;
        }

        const doc = new jsPDF();

        // Set font to support special characters
        doc.setFont('helvetica', 'normal');

        // Add title
        doc.setFontSize(20);
        doc.text('EMI Calculator Report', 20, 30);
        doc.text('Easy Personal Loan Services', 20, 40);

        // Add calculation timestamp
        const now = new Date();
        doc.setFontSize(10);
        doc.text(`Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 20, 50);

        // Add loan details
        doc.setFontSize(12);
        doc.text('Loan Details:', 20, 65);
        doc.text(`Loan Amount: ₹${new Intl.NumberFormat('en-IN').format(currentLoanAmount)}`, 20, 75);
        doc.text(`Interest Rate: ${currentInterestRate}% p.a.`, 20, 85);
        doc.text(`Loan Tenure: ${currentLoanTenure} years (${currentLoanTenure * 12} months)`, 20, 95);

        // Add payment summary
        const monthlyEMI = calculateEMI(currentLoanAmount, currentInterestRate, currentLoanTenure);
        const totalAmount = monthlyEMI * currentLoanTenure * 12;
        const totalInterest = totalAmount - currentLoanAmount;

        doc.setFontSize(12);
        doc.text('Payment Summary:', 20, 115);

        // Create a summary table manually
        const startY = 125;
        const rowHeight = 12;
        let currentY = startY;

        // Header
        doc.setFillColor(0, 82, 212);
        doc.rect(20, currentY, 170, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('Payment Summary', 25, currentY + 6);
        doc.text('Amount', 150, currentY + 6);
        currentY += 8;

        // Rows
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);

        const summaryItems = [
            ['Monthly EMI', `₹${new Intl.NumberFormat('en-IN').format(Math.round(monthlyEMI))}`],
            ['Principal Amount', `₹${new Intl.NumberFormat('en-IN').format(currentLoanAmount)}`],
            ['Total Interest', `₹${new Intl.NumberFormat('en-IN').format(Math.round(totalInterest))}`],
            ['Total Amount Payable', `₹${new Intl.NumberFormat('en-IN').format(Math.round(totalAmount))}`]
        ];

        summaryItems.forEach(([label, value], index) => {
            // Alternate row colors
            if (index % 2 === 0) {
                doc.setFillColor(248, 249, 250);
                doc.rect(20, currentY, 170, rowHeight, 'F');
            }

            doc.text(label, 25, currentY + 8);
            doc.text(value, 150, currentY + 8);
            currentY += rowHeight;

            // Draw border lines
            doc.setDrawColor(222, 226, 230);
            doc.line(20, currentY, 190, currentY);
        });

        // Draw table borders
        doc.setDrawColor(222, 226, 230);
        doc.rect(20, startY, 170, currentY - startY);

        // Add amortization schedule
        const schedule = generateAmortizationSchedule(currentLoanAmount, currentInterestRate, currentLoanTenure);
        const displaySchedule = schedule.slice(0, Math.min(12, schedule.length));

        doc.setFontSize(12);
        doc.text('Amortization Schedule (First 12 Months):', 20, currentY + 15);
        currentY += 25;

        // Create a simplified amortization table manually
        doc.setFontSize(8);
        doc.setDrawColor(222, 226, 230);

        // Header
        doc.setFillColor(0, 82, 212);
        doc.rect(20, currentY, 170, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Month', 25, currentY + 7);
        doc.text('Principal', 50, currentY + 7);
        doc.text('Interest', 80, currentY + 7);
        doc.text('EMI', 110, currentY + 7);
        doc.text('Balance', 140, currentY + 7);
        currentY += 10;

        // Rows
        doc.setTextColor(0, 0, 0);
        displaySchedule.forEach((payment, index) => {
            // Alternate row colors
            if (index % 2 === 0) {
                doc.setFillColor(248, 249, 250);
                doc.rect(20, currentY, 170, 8, 'F');
            }

            doc.text(payment.month.toString(), 25, currentY + 6);
            doc.text(`₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.principalPaid))}`, 50, currentY + 6);
            doc.text(`₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.interestPaid))}`, 80, currentY + 6);
            doc.text(`₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.totalPayment))}`, 110, currentY + 6);
            doc.text(`₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.remainingBalance))}`, 140, currentY + 6);
            currentY += 8;
        });

        // Add footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.text('Easy Personal Loan Services - EMI Calculator Report', 20, pageHeight - 20);
        doc.text('www.easypersonalloanservices.com', 20, pageHeight - 15);

        // Try to download the PDF
        try {
            doc.save('easy-personalloan-emi-report.pdf');
            // Show success message
            showNotification('PDF report downloaded successfully!', 'success');
        } catch (saveError) {
            console.error('Save error:', saveError);
            // If automatic download fails (common in local files), open in new tab
            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
            showNotification('PDF opened in new tab - use browser print/save to download', 'info');
        }

    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try using a different browser or check console for details.');

        // Fallback: show printable version
        showPrintableVersion();
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white font-medium z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Printable version fallback
function showPrintableVersion() {
    const printableWindow = window.open('', '_blank');

    if (!printableWindow) {
        alert('Please allow popups and try again for the printable version.');
        return;
    }

    const monthlyEMI = calculateEMI(currentLoanAmount, currentInterestRate, currentLoanTenure);
    const totalAmount = monthlyEMI * currentLoanTenure * 12;
    const totalInterest = totalAmount - currentLoanAmount;
    const schedule = generateAmortizationSchedule(currentLoanAmount, currentInterestRate, currentLoanTenure);
    const displaySchedule = schedule.slice(0, Math.min(12, schedule.length));

    printableWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>EMI Calculator Report - Easy Personal Loan Services</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #0052D4; text-align: center; }
                .summary { background: #f0f5ff; padding: 20px; border-radius: 10px; margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                th { background: #0052D4; color: white; }
                .footer { margin-top: 40px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <h1>EMI Calculator Report</h1>
            <h2>Easy Personal Loan Services</h2>
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>

            <div class="summary">
                <h3>Loan Details</h3>
                <p><strong>Loan Amount:</strong> ₹${new Intl.NumberFormat('en-IN').format(currentLoanAmount)}</p>
                <p><strong>Interest Rate:</strong> ${currentInterestRate}% p.a.</p>
                <p><strong>Loan Tenure:</strong> ${currentLoanTenure} years (${currentLoanTenure * 12} months)</p>

                <h3>Payment Summary</h3>
                <p><strong>Monthly EMI:</strong> ₹${new Intl.NumberFormat('en-IN').format(Math.round(monthlyEMI))}</p>
                <p><strong>Total Interest:</strong> ₹${new Intl.NumberFormat('en-IN').format(Math.round(totalInterest))}</p>
                <p><strong>Total Amount Payable:</strong> ₹${new Intl.NumberFormat('en-IN').format(Math.round(totalAmount))}</p>
            </div>

            <h3>Amortization Schedule (First 12 Months)</h3>
            <table>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Principal Paid</th>
                        <th>Interest Paid</th>
                        <th>EMI</th>
                        <th>Remaining Balance</th>
                    </tr>
                </thead>
                <tbody>
    `);

    displaySchedule.forEach(payment => {
        printableWindow.document.write(`
            <tr>
                <td>${payment.month}</td>
                <td>₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.principalPaid))}</td>
                <td>₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.interestPaid))}</td>
                <td>₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.totalPayment))}</td>
                <td>₹${new Intl.NumberFormat('en-IN').format(Math.round(payment.remainingBalance))}</td>
            </tr>
        `);
    });

    printableWindow.document.write(`
                </tbody>
            </table>

            <div class="footer">
                <p>Easy Personal Loan Services</p>
                <p>Contact: +91-987 388 3888 | Email: support@easypersonalloanservices.com</p>
            </div>
        </body>
        </html>
    `);

    printableWindow.document.close();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Slider event listeners
    document.getElementById('loan-amount-slider').addEventListener('input', function() {
        currentLoanAmount = parseInt(this.value);
        updateDisplay();
    });

    document.getElementById('interest-rate-slider').addEventListener('input', function() {
        currentInterestRate = parseFloat(this.value);
        updateDisplay();
    });

    document.getElementById('loan-tenure-slider').addEventListener('input', function() {
        currentLoanTenure = parseFloat(this.value);
        updateDisplay();
    });

    // Show amortization schedule
    document.getElementById('show-amortization-btn').addEventListener('click', function() {
        generateAmortizationTable();
        document.getElementById('amortization-schedule').classList.remove('hidden');
        this.style.display = 'none';
    });

    // Hide amortization schedule
    document.getElementById('hide-amortization-btn').addEventListener('click', function() {
        document.getElementById('amortization-schedule').classList.add('hidden');
        document.getElementById('show-amortization-btn').style.display = 'block';
    });

    // Download PDF
    document.getElementById('download-pdf-btn').addEventListener('click', function() {
        downloadPDF();
    });

    // Initialize display
    updateDisplay();
});
