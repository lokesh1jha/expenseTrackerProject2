const URLTOBACKEND = 'http://localhost:3000/';
const EMAILID = 'ceolokeshjha@gmail.com'
const PHONENO = 9768523325
const tableBody = document.querySelector('.table');
tableBody.innerHTML += ` <tr>
        <th>Amount</th>
        <th>Description</th>
        <th>Category</th>
        <th>Edit</th>
        <th>Delete</th>
        </tr>`;

const token = localStorage.getItem('token');
function addNewExpense(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    const expenseDetails = {
        expenseamount: form.get("expenseamount"),
        description: form.get("description"),
        category: form.get("category")
    }
    console.log(expenseDetails)
    axios.post(`${URLTOBACKEND}user/addexpense`, expenseDetails, { headers: { "Authorization": token } }).then((response) => {

        if (response.status === 201) {
            addNewExpensetoUI(response.data.expense);
        } else {
            throw new Error('Failed To create new expense');
        }

    }).catch(err => showError(err))

}

window.addEventListener('load', () => {

    const header = document.getElementById('navbar');

    if (JSON.parse(localStorage.getItem("userDetails")).ispremiumuser) {
        header.classList.remove('display');
        document.body.classList.add("dark");
    }

    axios.get(`${URLTOBACKEND}user/getexpense`, { headers: { "Authorization": token } }).then(response => {

        if (response.status == 200) {
            response.data.expense.forEach(expense => {
                addNewExpensetoUI(expense);
            })
        } else {
            throw new Error();
        }
    })
});



function addNewExpensetoUI(element) {
    tableBody.innerHTML += `
        <tr data-id="${element._id}">
        <td class="amount">${element.expenseamount}</td>
        <td class="description">${element.description}</td>
        <td class="category">${element.category}</td>
        <td><a class="EditButton" id="edit-exp">Edit</td>
        <td><a class="DeleteButton" id="delete-exp">Delete</td>
        </tr>`;
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const response = await axios.get(`${URLTOBACKEND}purchase/premiummembership`, { headers: { "Authorization": token } });
    console.log(response);
    var options = {
        "key": response.data.key_id,
        "name": "Lokesh Kumar Jha",
        "order_id": response.data.order.id,
        "prefill": {
            "name": "Lokesh Kumar Jha",
            "email": `${EMAILID}`,
            "contact": `${PHONENO}`
        },
        "theme": {
            "color": "#3399cc"
        },
        //This handler function will handle the success payment
        "handler": function (response) {
            console.log(response);
            axios.post(`${process.env.URL}purchase/updatetransactionstatus`, {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } }).then(() => {
                alert('You are a Premium User Now')
            }).catch(() => {
                alert('Something went wrong. Try Again!!!')
            })

        }
    }


    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });

};




function deleteExpense(e, expenseid) {
    axios.delete(`${process.env.URL}user/deleteexpense/${expenseid}`, { headers: { "Authorization": token } })
        .then((response) => {

            if (response.status === 204) {
                removeExpensefromUI(expenseid);
            } else {
                throw new Error('Failed to delete');
            }
        }).catch((err => {
            showError(err);
        }))
}

function showError(err) {
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function removeExpensefromUI(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

function download() {
    axios.get(`${URLTOBACKEND}user/download`, { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 201) {
                //the backend is essentially sending a download link
                //  which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileUrl;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }

        })
        .catch((err) => {
            showError(err)
        });
}


