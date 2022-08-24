const url = 'http://localhost:3000/';

const tableBody = document.querySelector('.table');
tableBody.innerHTML += ` <tr>
        <th>Amount</th>
        <th>Description</th>
        <th>Category</th>
        <th>Edit</th>
        <th>Delete</th>
        </tr>`;

const token = localStorage.getItem('token');
function addNewExpense(e){
    e.preventDefault();
    const form = new FormData(e.target);

    const expenseDetails = {
        expenseamount: form.get("expenseamount"),
        description: form.get("description"),
        category: form.get("category")

    }
    console.log(expenseDetails)
    axios.post(`${url}user/addexpense`,expenseDetails, { headers: {"Authorization" : token} }).then((response) => {

    if(response.status === 201){
        addNewExpensetoUI(response.data.expense);
    } else {
        throw new Error('Failed To create new expense');
    }

    }).catch(err => showError(err))

}

window.addEventListener('load', ()=> {
    axios.get(`${url}user/getexpense`, { headers: {"Authorization" : token} }).then(response => {
        
        if(response.status == 200){
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

