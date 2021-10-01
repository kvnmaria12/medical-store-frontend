const name_create = document.getElementById("name-create");
const price_create = document.getElementById("price-create");
const quantity_create = document.getElementById("quantity-create");
const categories_create = document.getElementById("categories-create");
const manufacture_date_create = document.getElementById("manufacture_date-create");
const expiry_date_create = document.getElementById("expiry_date-create");

let id_update = document.getElementById("id-update");
let name_update = document.getElementById("name-update");
let price_update = document.getElementById("price-update");
let quantity_update = document.getElementById("quantity-update");
let categories_update = document.getElementById("categories-update");
let manufacture_date_update = document.getElementById("manufacture_date-update");
let expiry_date_update = document.getElementById("expiry_date-update");

// all the parent elements
const table_section = document.querySelector(".table-section");
const table_section_create = document.querySelector(".table-section-create");
const table_section_get = document.querySelector(".get-data");
const table_section_update = document.querySelector(".table-section-update");
const table_section_delete = document.querySelector(".table-section-delete");

const form_create = document.getElementById("form-create");
form_create.addEventListener("submit", runEvent);
function runEvent(e) {
    e.preventDefault();

    const categoriesList = categories_create.options[categories_create.selectedIndex].text;
    const headers = {
        "Content-Type": "application/json"
    }
    // posting data using axios
    axios.post("http://localhost:1212/api/medicine", {
        name: name_create.value,
        price: price_create.value,
        quantity: quantity_create.value,
        categories: categoriesList,
        manufacture_date: manufacture_date_create.value,
        expiry_date: expiry_date_create.value,
    }, { headers })
        .then(response => {
            if (response.status == 200) {
                success_msg_create.classList.toggle("hidden");
                overlay_create.classList.toggle("hidden");
            }
        })
        .catch(err => console.log(err, err.response));

    // to reset the form once it has been submitted
    document.getElementById("form-create").reset();
}


// Updating a Data 
const form_update = document.getElementById("form-update");

form_update.addEventListener("submit", updateDataEvent);

function updateDataEvent(e) {
    e.preventDefault();

    const index = categories_update.selectedIndex > 0 ? categories_update.selectedIndex : undefined;
    const categoriesList = categories_update.options[index].text;

    const url = new URL(`http://localhost:1212/api/medicine/${id_update.value}`);
    if (name_update.value) { url.searchParams.append("name", name_update.value) }
    if (price_update.value) { url.searchParams.append("price", price_update.value) }
    if (quantity_update.value) { url.searchParams.append("quantity", quantity_update.value) }
    if (categoriesList) { url.searchParams.append("categories", categoriesList) }
    if (manufacture_date_update.value) { url.searchParams.append("manufacture_date", manufacture_date_update.value) }
    if (expiry_date_update.value) { url.searchParams.append("expiry_date", expiry_date_update.value) }

    axios.put(url)
        .then(response => {
            if (response.status == 200) {
                success_msg_update.classList.toggle("hidden");
                overlay_update.classList.toggle("hidden");
            }
        })
        .catch(err => console.log(err, err.response));
    document.getElementById("form-update").reset();
}

// Create Overlay Part
const success_msg_create = document.querySelector(".success-msg-create");
const close_btn_create = document.querySelector(".close-btn-create");
const overlay_create = document.querySelector(".overlay-create");

// For SuccessMessage
function openModal() {
    success_msg_create.classList.toggle("hidden");
    overlay_create.classList.toggle("hidden");
}

function closeModalCreate() {
    success_msg_create.classList.add("hidden");
    overlay_create.classList.add("hidden");
}

close_btn_create.addEventListener("click", () => {
    success_msg_create.classList.add("hidden");
    overlay_create.classList.add("hidden");
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !success_msg_create.classList.contains("hidden")) {
        closeModalCreate();
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
});


// Update Data Overlay Part
const success_msg_update = document.querySelector(".success-msg-update");
const close_btn_update = document.querySelector(".close-btn-update");
const overlay_update = document.querySelector(".overlay-update");

function closeModalUpdate() {
    success_msg_update.classList.add("hidden");
    overlay_update.classList.add("hidden");
}

close_btn_update.addEventListener("click", () => {
    closeModalUpdate();
    table_section_update.classList.add("hidden");
    table_section.classList.remove("hidden");
    setTimeout(() => {
        window.location.reload();
    }, 100);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !success_msg_update.classList.contains("hidden")) {
        closeModalUpdate();
    }
});


// Delete Overlay Part
const success_msg_delete = document.querySelector(".success-msg-delete");
const close_btn_delete = document.querySelector(".close-btn-delete");
const overlay_delete = document.querySelector(".overlay-delete");


function closeModalDelete() {
    success_msg_delete.classList.add("hidden");
    overlay_delete.classList.add("hidden");
}

close_btn_delete.addEventListener("click", () => {
    closeModalDelete();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !success_msg_delete.classList.contains("hidden")) {
        closeModalDelete();
    }
});


//all buttons
const createData = document.getElementById("create-data");

function createDataDisplay(e) {
    e.preventDefault();
    table_section.classList.add("hidden");
    table_section_create.classList.remove("hidden");
}
createData.addEventListener("click", createDataDisplay)


// Dynamically Created Table
const title = [];
const rows = [];
async function loadIntoTable(url, table) {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    const response = await fetch(url);
    const { data } = await response.json();
    data.forEach(item => {
        const keys = Object.keys(item);
        title.push(keys);
        const values = Object.values(item);
        rows.push(values);
    });
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";

    title[0].forEach(header => {
        const headerElement = document.createElement("th");
        headerElement.textContent = header;
        tableHead.querySelector("tr").appendChild(headerElement);
    });

    for (const row of rows) {
        const rowElement = document.createElement("tr");

        for (const cellText of row) {
            const cellElement = document.createElement("td");

            cellElement.textContent = cellText;
            rowElement.append(cellElement);
        }

        tableBody.append(rowElement);
    }

    const tableRow = document.querySelectorAll("tbody tr");
    tableRow.forEach(item => {
        const editIcon = document.createElement("i");
        editIcon.className = "fas fa-edit edit-icon";
        item.append(editIcon);
        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash delete-icon";
        item.append(deleteIcon);
    });

    // searching functionality
    const searchInput = document.getElementById("medicine-name-homepage");
    searchInput.addEventListener("keyup", filterItems);
    function filterItems(e) {
        e.preventDefault();
        const searchValue = e.target.value.toLowerCase();
        const rowElements = document.querySelectorAll(".content-table tbody tr");
        rowElements.forEach(row => {
            const rowData = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
            if (rowData.startsWith(searchValue)) {
                row.style.display = "table-row"
            } else {
                row.style.display = "none";
            }
        });
    }

    const editBtn = document.querySelectorAll(".edit-icon");

    // loop for editBtn
    for (let i = 0; i < editBtn.length; i++) {
        editBtn[i].addEventListener("click", () => {
            const parentElement = editBtn[i].parentElement;
            const tableData = parentElement.querySelectorAll("td");
            tableData.forEach((data, index) => {
                if (index === 0) {
                    id_update.value = data.textContent;
                }
                if (index === 1) {
                    name_update.value = data.textContent;
                }
                if (index === 2) {
                    price_update.value = data.textContent;
                }
                if (index === 3) {
                    quantity_update.value = data.textContent;
                }
                if (index === 4) {
                    const options = categories_update.options;
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].text == data.textContent) {
                            options[i].selected = true;
                            break;
                        }
                    }
                }
                if (index === 5) {
                    manufacture_date_update.value = data.textContent;
                }
                if (index === 6) {
                    expiry_date_update.value = data.textContent;
                }
            })
            table_section.classList.add("hidden");
            table_section_update.classList.remove("hidden");
        });
    }

    const alert_msg = document.querySelector(".are-you-sure");
    const overlay_2_delete = document.querySelector(".overlay-2-delete");
    const success_message_delete = document.querySelector(".success-msg-delete");
    const overlay_delete = document.querySelector(".overlay-delete");

    const noBtn = document.querySelector(".are-you-sure-no-btn");
    noBtn.addEventListener("click", btnScreenDisplay);
    function btnScreenDisplay() {
        alert_msg.classList.add("hidden");
        overlay_2_delete.classList.add("hidden");

    }
    const deleteBtn = document.querySelectorAll(".delete-icon");
    const areYouSure = document.querySelector(".are-you-sure-txt");
    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener("click", () => {
            const parent = deleteBtn[i].parentElement;
            const medicineName = parent.querySelector("td:nth-child(2)")
            areYouSure.innerHTML = `<span>Are you sure in Deleting <strong>${medicineName.textContent}</strong></span>`;
            alert_msg.classList.toggle("hidden");
            overlay_2_delete.classList.toggle("hidden");
            const yesBtn = document.querySelector(".are-you-sure-yes-btn");
            yesBtn.addEventListener("click", () => {
                const rowId = deleteBtn[i].parentElement;
                const id = rowId.querySelector("td");
                console.log(id.textContent);

                axios.delete(`http://localhost:1212/api/medicine/${id.textContent}`)
                    .then(response => {
                        if (response.status === 200) {
                            btnScreenDisplay();
                            success_message_delete.classList.toggle("hidden");
                            overlay_delete.classList.toggle("hidden");
                            const rowElement = document.querySelector("tbody");
                            const parentElement = deleteBtn[i].parentElement;
                            rowElement.removeChild(parentElement);
                        }
                    })
                    .catch(err => console.log(err, err.response));
            });
        });
    }

}
loadIntoTable("http://localhost:1212/api/medicine/", document.querySelector(".content-table"));



// Client Side
const create = document.querySelector(".create");
function showSuccessCreate(input) {
    const parentElement = input.parentElement;
    parentElement.className = "form-control-create success";
}

function showSuccessUpdate(input) {
    const parentElement = input.parentElement;
    parentElement.className = "form-control-update success";
}

function showErrorCreate(input, msg) {
    const parentElement = input.parentElement;
    parentElement.className = "form-control-create error";
    create.innerText = msg;
}

const update = document.querySelector(".update");
function showErrorUpdate(input, msg) {
    const parentElement = input.parentElement;
    parentElement.className = "form-control-update error";
    update.innerText = msg;
}
