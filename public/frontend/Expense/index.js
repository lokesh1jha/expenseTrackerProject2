const URLTOBACKEND = 'http://localhost:3000/';
const EMAILID = 'ceolokeshjha@gmail.com'
const PHONENO = 9768523325
const tableBody = document.querySelector('.table');

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
    if (localStorage.getItem('pagelimit')) {
        document.getElementById('setlimit').innerHTML = localStorage.getItem('pagelimit');
    }

    getExpenses(1, 5);
});


//Pagination 

const prev = document.getElementById('prevPage')
const curr = document.getElementById('currPage')
const next = document.getElementById('nextPage')

let totalpages;
let ITEM_PER_PAGE = parseInt(document.getElementById('setlimit').value);
let prevPageNumber;
let currPageNumber;
let nextPageNumber;


//prev
prev.addEventListener('click', () => {
    console.log("back clicked");
    currPageNumber = parseInt(curr.innerHTML);

    ITEM_PER_PAGE = document.getElementById('setlimit').value;

    if (currPageNumber !== 1) {
        currPageNumber--;
        curr.innerHTML = currPageNumber;
        getExpenses(currPageNumber, ITEM_PER_PAGE);
    }
});



//next
next.addEventListener('click', () => {
    console.log("next clicked");
    currPageNumber = parseInt(curr.innerHTML);

    ITEM_PER_PAGE = document.getElementById('setlimit').value;

    // if (currPageNumber < totalpages) {
    currPageNumber++;
    curr.innerHTML = currPageNumber;
    getExpenses(currPageNumber, ITEM_PER_PAGE);
    // }
});

//Pagination END


function getExpenses(page = 1, limit = 5) {
    tableBody.innerHTML = ` <tr>
        <th>Amount</th>
        <th>Description</th>
        <th>Category</th>
        <th>Delete</th>
        </tr>`;

    axios.get(`${URLTOBACKEND}user/getexpense?page=${page}&limit=${limit}`, { headers: { "Authorization": token } })
    .then(response => {    
        if (response.status == 200) {
            response.data.expense.results.forEach(expense => {
                // totalpages = expense.lastPage;
                addExpensetoUI(expense);
            })
        } else {
            throw new Error();
        }
    })
}

function addExpensetoUI(element) {

    tableBody.innerHTML += `
        <tr id="expense-${element.id}">
        <td class="amount">${element.expenseamount}</td>
        <td class="description">${element.description}</td>
        <td class="category">${element.category}</td>
        <td><button style="cursor: pointer;background-color: red;border: none;" onclick='deleteExpense(event, ${element.id})'>Delete</button></td>
        </tr>`;
}


function addNewExpensetoUI(element) {
    tableBody.innerHTML += `
        <tr id="expense-${element.id}">
        <td class="amount">${element.expenseamount}</td>
        <td class="description">${element.description}</td>
        <td class="category">${element.category}</td>
        <td><button style="cursor: pointer;background-color: red;border: none;" onclick='deleteExpense(event, ${element.id})'>Delete</button></td>
        </tr>`;
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const response = await axios.get(`${URLTOBACKEND}purchase/premiummembership`, { headers: { "Authorization": token } });

    var options = {
        "key": response.data.keyid,
        "name": "Lokesh Kumar Jha",
        "orderid": response.data.order.id,
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
            axios.post(`${URLTOBACKEND}purchase/updatetransactionstatus`, {
                orderid: options.orderid,
                paymentid: response.razorpay_paymentid,
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
        alert(response.error.metadata.orderid);
        alert(response.error.metadata.paymentid);
    });

};




function deleteExpense(e, expenseid) {
    e.preventDefault();
    axios.delete(`${URLTOBACKEND}user/deleteexpense?id=${expenseid}`, { headers: { "Authorization": token } })
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
            console.log(response.status + "" + response.data.fileURL);
            if (response.status === 201) {
                //the backend is essentially sending a download link
                //  which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileURL;
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


