// Connect to the server socket.io
const socket = io();
const table = document.getElementById("realProductsTable")

document.getElementById("createBtn").addEventListener("click", () => {
    const body = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value
    }
    fetch("/api/products", {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(result => result.json())
        .then(result => {
            if(result.status === "error") throw new Error(result.error)
        })
        .then(() => fetch("/api/products"))
        .then(result => result.json())
        .then(result => {
            if(result.status === "error") throw new Error(result.error)
            else socket.emit("productList", result.payload)
            alert("Producto agregado")
            document.getElementById("title").value = "",
            document.getElementById("description").value = "",
            document.getElementById("price").value = "",
            document.getElementById("code").value = "",
            document.getElementById("stock").value = ""
        })
        .catch(error => alert("Ocurrió un error: " + error.message));
})

deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: "delete"
    })
    .then(result => result.json())
    .then(result => {
        if(result.status === "error") throw new Error(result.error)
        else socket.emit("productList", result.payload)
        alert("Producto eliminado")
    })
    .catch(error => alert("Ocurrió un error: " + error.message));
}

// "listProducts" event received from the server
socket.on('updatedProducts', data => {
    console.log("Product list received on the client:", data);
    // Get the reference to the tbody element of the table
    const tbody = table.getElementsByTagName("tbody")[0];

    // Add each new product to the table
    for (const product of data) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${product.code}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>  
            <td>${product.stock}</td>
            <td><button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    }
});


// "listProducts" event received from the server
socket.on('updatedProducts', data => {
    // Update the table of products on the screen
    table.innerHTML =
        `
        <tr>
            <td><strong>Code</strong></td>
            <td><strong>Title</strong></td>
            <td><strong>Description</strong></td>
            <td><strong>Price</strong></td>  
            <td><strong>Stock</strong></td>  
            <td><strong>Button</strong></td>
        </tr>
        `
        for (product of data) {
            const tr = document.createElement("tr")
            tr.innerHTML = 
                `
                <td>${product.code}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>  
                <td>${product.stock}</td>
                <td><button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button></td>
              `
            table.getElementsByTagName("tbody")[0].appendChild(tr)
        }
});
