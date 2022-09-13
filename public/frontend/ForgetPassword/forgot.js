const URLTOBACKEND = 'http://localhost:3000/';

document.getElementById('forgetForm').addEventListener('submit', forgetPassword);

function forgetPassword(e) {
    e.preventDefault();

    const user = {
        email : document.getElementById('email').value
    }
    
    axios.post(`${URLTOBACKEND}password/forgotpassword`, user)
        .then(res => {
            if(res.status == 200){
                console.log(res);
                document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'                
            }else {
                console.log("Email Id Not Registered with us");
                throw new Error('Email Id Not Registered with us');
            }
        })
        .catch(err => {
            document.body.innerHTML += `<div style="color:red;">${err} <div>`;
        })
    
}