const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.replace("form-visible", "form-hidden");
  registerForm.classList.replace("form-hidden", "form-visible");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.replace("form-visible", "form-hidden");
  loginForm.classList.replace("form-hidden", "form-visible");
});


registerForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const email = registerForm.querySelector("input[type='email']").value;
    const name = registerForm.querySelector("input[placeholder='Name']").value;
    const password = registerForm.querySelector("input[type='password']").value;

    try {
        const res = await fetch("http://localhost:5000/api/v0/users/register",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email,name,password}),
        });
        const data = await res.json();
        if(res.ok){
            alert("Registered successfully");
        }
        else{
            alert(data.message || "Something went wrong during sign up");
        }
    } catch (error) {
        console.error(error);
        alert("Network error");
    }
});

loginForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const email = loginForm.querySelector("input[type='email']").value;
    const password  = loginForm.querySelector("input[type='password']").value;
    try {
        const res = await fetch("http://localhost:5000/api/v0/users/login",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({email,password}),
        });    
        const data = await res.json();
        if(res.ok){
            alert("Logged in successfully");
        }
        else{
            alert(data.message || "Something went wrong during login");
        }
    } catch (error) {
        console.error(error);
        alert('Network error');
    }
});