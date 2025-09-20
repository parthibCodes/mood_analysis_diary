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
    const username = registerForm.querySelector("input[placeholder='Name']").value;
    const password = registerForm.querySelector("input[type='password']").value;

    try {
        const res = await fetch("http://localhost:5000/api/v0/users/register",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email,username,password}),
        });
        const data = await res.json();
        if(res.ok){
            alert("Registered successfully");
        }
        else{
            alert(data.message || "Something went wrong");
        }
    } catch (error) {
        console.error(error);
        alert("Network error");
    }
});

// const submitLoginForm = document.getElementById("submitLoginForm");
// submitLoginForm.addEventListener("click",(e)=>{

// })