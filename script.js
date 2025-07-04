const API_URL = 'https://crudcrud.com/api/61fececc18414ff299245c3a8d0cbc35/vegetables';

document.addEventListener("DOMContentLoaded", loadItems);

// Load items from API
async function loadItems() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        document.getElementById("shop-items").innerHTML = "";
        let total = 0;
        data.forEach(item => {
            displayItem(item);
            total += item.price * item.quantity;
        });
        document.getElementById("total").innerText = `Total Amount: ₹${total}`;
    } catch (error) {
        alert("Failed to load items. Please refresh the page.");
        console.error(error);
    }
}

// Display one item in the DOM
function displayItem(item) {
    const itemDiv = document.createElement("div");
    itemDiv.className = "card";
    itemDiv.dataset.id = item._id;

    itemDiv.innerHTML = `
        <h3>${item.name}</h3>
        <p>Price: ₹${item.price}</p>
        <p>Quantity: <input type="number" value="${item.quantity}" min="1" class="quantity-input" style="width: 80px;" /></p>
        <div class="card-actions">
            <button onclick="buyItem(this)">Buy</button>
            <button onclick="editItem(this)">Edit</button>
            <button onclick="updateItem(this)">Update</button>
            <button onclick="deleteItem(this)">Delete</button>
        </div>
    `;

    document.getElementById("shop-items").appendChild(itemDiv);
}

// Add new item to API
async function addToShop() {
    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseFloat(document.getElementById("quantity").value);

    if (!name || price <= 0 || quantity <= 0) {
        alert("Please enter valid data.");
        return;
    }

    const newItem = { name, price, quantity };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem)
        });

        if (!res.ok) throw new Error("Failed to add item");

        resetForm();
        await loadItems();
    } catch (error) {
        alert("Error adding item");
        console.error(error);
    }
}

// Handle Add / Update button
async function handleAddOrUpdate() {
    const id = document.getElementById("addToShopId").value;
    if (id) {
        await updateItemById(id);
    } else {
        await addToShop();
    }
}

// Update item by ID from form
async function updateItemById(id) {
    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseFloat(document.getElementById("quantity").value);

    if (!name || price <= 0 || quantity <= 0) {
        alert("Please enter valid data.");
        return;
    }

    const updatedItem = { name, price, quantity };

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedItem)
        });

        if (!res.ok) throw new Error("Failed to update item");

        resetForm();
        await loadItems();
    } catch (error) {
        alert("Error updating item.");
        console.error(error);
    }
}

// Edit existing item (populate form)
function editItem(button) {
    const itemDiv = button.closest('.card');
    const id = itemDiv.dataset.id;
    const name = itemDiv.querySelector('h3').innerText;
    const price = itemDiv.querySelector('p').innerText.match(/₹(\d+(?:\.\d+)?)/)[1];
    const quantity = itemDiv.querySelector('.quantity-input').value;

    document.getElementById("name").value = name;
    document.getElementById("price").value = price;
    document.getElementById("quantity").value = quantity;
    document.getElementById("addToShopId").value = id;
}

// Update quantity directly from card
async function updateItem(button) {
    const itemDiv = button.closest('.card');
    const id = itemDiv.dataset.id;
    const name = itemDiv.querySelector('h3').innerText;
    const price = parseFloat(itemDiv.querySelector('p').innerText.match(/₹(\d+(?:\.\d+)?)/)[1]);
    const quantity = parseFloat(itemDiv.querySelector('.quantity-input').value);

    const updatedItem = { name, price, quantity };

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedItem)
        });

        if (!res.ok) throw new Error("Failed to update");

        await loadItems();
    } catch (error) {
        alert("Update failed.");
        console.error(error);
    }
}

// Delete item from API
async function deleteItem(button) {
    const itemDiv = button.closest('.card');
    const id = itemDiv.dataset.id;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("Failed to delete");

        await loadItems();
    } catch (error) {
        alert("Delete failed.");
        console.error(error);
    }
}

// Buy item (show quantity)
function buyItem(button) {
    const itemDiv = button.closest('.card');
    const qty = itemDiv.querySelector('.quantity-input').value;
    alert(`Bought ${qty}KG!`);
}

// Clear form
function resetForm() {
    document.getElementById("name").value = '';
    document.getElementById("price").value = '';
    document.getElementById("quantity").value = '';
    document.getElementById("addToShopId").value = '';
}
