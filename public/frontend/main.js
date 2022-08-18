
document.getElementById('signupForm').addEventListener('submit', registerUser);

function registerUser(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    const User = {
        name,
        email,
        phone,
        password
    }
    console.log(User);
    axios.post('http://localhost:3000/signup', User)
        .then(res => {
            if(res.status === 200){
                console.log("User Registered")
            }else {
                console.log("User Registration failed")
                throw new Error(response.data.messsage);
            }
        })
        .catch(err => {
            console.log("error" + err.messsage);
        })
    
    document.getElementById('signupForm').reset();

}