document.addEventListener("DOMContentLoaded", () => {
    const invoiceForm = document.getElementById("invoiceForm");
    const invoiceList = document.getElementById("invoiceList");
    let invoices = [];
    
    // Store GST rates for categories
    const gstRates = {
        "Electronics": 18,
        "Services": 12
    };

    invoiceForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const customerName = document.getElementById("customerName").value;
        const productCategory = document.getElementById("productCategory").value;
        const productName = document.getElementById("productName").value;
        const price = document.getElementById("price").value;

        if (!customerName || !productCategory || !productName || !price) {
            alert("Please fill in all fields.");
            return;
        }

        // Log to check what product category is selected
        console.log("Selected Category: ", productCategory);

        // Get GST for the selected category, default to 0 if undefined
        const gst = gstRates[productCategory] || 0;
        
        // Log to check the gst value
        console.log("GST for selected category: ", gst);

        const invoice = {
            id: invoices.length + 1,
            customerName,
            productCategory,
            productName,
            price: parseFloat(price).toFixed(2),
            gst,
            totalPrice: (parseFloat(price) * (1 + gst / 100)).toFixed(2),
            date: new Date().toLocaleDateString()
        };

        invoices.push(invoice);
        renderInvoices();
        invoiceForm.reset();
    });

    function renderInvoices() {
        invoiceList.innerHTML = "";
        invoices.forEach((invoice) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>Invoice #${invoice.id}</strong> - ${invoice.customerName} - ${invoice.productCategory} - $${invoice.price} + GST: $${(invoice.price * invoice.gst / 100).toFixed(2)} <br> ${invoice.date} <br> Total: $${invoice.totalPrice}`;
    
            const downloadBtn = document.createElement("button");
            downloadBtn.textContent = "Download PDF 📥";
            downloadBtn.addEventListener("click", () => downloadInvoice(invoice));
            downloadBtn.style.width = "250px";  // Reduce button width
    
            const shareBtn = document.createElement("button");
            shareBtn.textContent = "Share 📤";
            shareBtn.addEventListener("click", () => shareInvoice(invoice));
            shareBtn.style.width = "250px";  // Reduce button width
    
            li.appendChild(downloadBtn);
            li.appendChild(shareBtn);
            invoiceList.appendChild(li);
        });
    }
    

    function downloadInvoice(invoice) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add invoice content with GST and total price
        doc.text(`Invoice #${invoice.id}`, 10, 10);
        doc.text(`Customer: ${invoice.customerName}`, 10, 20);
        doc.text(`Category: ${invoice.productCategory}`, 10, 30);
        doc.text(`Product: ${invoice.productName}`, 10, 40);
        doc.text(`Price: $${invoice.price}`, 10, 50);
        doc.text(`GST: $${(invoice.price * invoice.gst / 100).toFixed(2)}`, 10, 60);
        doc.text(`Total Price: $${invoice.totalPrice}`, 10, 70);
        doc.text(`Date: ${invoice.date}`, 10, 80);

        // Save the PDF
        doc.save(`Invoice_${invoice.id}.pdf`);
    }

    function shareInvoice(invoice) {
        const message = `Invoice #${invoice.id}\nCustomer: ${invoice.customerName}\nCategory: ${invoice.productCategory}\nProduct: ${invoice.productName}\nPrice: $${invoice.price}\nGST: $${(invoice.price * invoice.gst / 100).toFixed(2)}\nTotal: $${invoice.totalPrice}\nDate: ${invoice.date}`;
        
        if (navigator.share) {
            const pdfBlob = generatePdfBlob(invoice);
            
            navigator.share({
                title: `Invoice #${invoice.id}`,
                text: message,
                files: [new File([pdfBlob], `Invoice_${invoice.id}.pdf`, { type: 'application/pdf' })],
            }).catch((error) => console.log("Error sharing", error));
        } else {
            alert("Sharing not supported on this browser.");
        }
    }

    function generatePdfBlob(invoice) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add invoice content with GST and total price
        doc.text(`Invoice #${invoice.id}`, 10, 10);
        doc.text(`Customer: ${invoice.customerName}`, 10, 20);
        doc.text(`Category: ${invoice.productCategory}`, 10, 30);
        doc.text(`Product: ${invoice.productName}`, 10, 40);
        doc.text(`Price: $${invoice.price}`, 10, 50);
        doc.text(`GST: $${(invoice.price * invoice.gst / 100).toFixed(2)}`, 10, 60);
        doc.text(`Total Price: $${invoice.totalPrice}`, 10, 70);
        doc.text(`Date: ${invoice.date}`, 10, 80);

        // Creating PDF as Blob for sharing
        return doc.output('blob');
    }
});
