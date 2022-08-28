const URLTOBACKEND = 'http://localhost:3000/';
const token = localStorage.getItem('token');

function addTotalExpensestoUI() {
    document.getElementById('all').innerHTML += `<li>all details</li>`;
}

window.addEventListener('load', ()=> {
    axios.get(`${URLTOBACKEND}user/leaderboard`, { headers: {"Authorization" : token} }).then(response => {
      
        if(response.status == 200 && JSON.parse(localStorage.getItem("userDetails")).ispremiumuser){
            // document.getElementById('firstperson').innerHTML = `<p>${} </p>`;
           console.log(response);
            addTotalExpensestoUI();
            
        } else {
            throw new Error();
        }
    })
});
