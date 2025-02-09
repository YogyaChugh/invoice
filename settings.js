document.addEventListener("DOMContentLoaded", () => {
    const settingsForm = document.getElementById("settingsForm");
    const categoryList = document.getElementById("categoryList");
    let categories = JSON.parse(localStorage.getItem("categories")) || [];

    // Function to render categories
    function renderCategories() {
        categoryList.innerHTML = "";
        categories.forEach((category) => {
            const li = document.createElement("li");
            li.textContent = `${category.name} - GST: ${category.gstRate}%`;
            categoryList.appendChild(li);
        });
    }

    // Display existing categories
    renderCategories();

    // Handle form submission to save a new category
    settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const categoryName = document.getElementById("categoryName").value.trim();
        const gstRate = parseFloat(document.getElementById("gstRate").value);

        // Validate input
        if (!categoryName || isNaN(gstRate)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const newCategory = {
            name: categoryName,
            gstRate: gstRate // Save as a number directly
        };
        

        // Save the new category to localStorage
        categories.push(newCategory);
        localStorage.setItem("categories", JSON.stringify(categories));

        // Reset form and reload the category list
        settingsForm.reset();
        renderCategories();
    });
});
