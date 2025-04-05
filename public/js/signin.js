document.addEventListener("DOMContentLoaded", function () {
    const signinForm = document.getElementById("signin-form");
    signinForm.addEventListener("submit", function (event) {
        event.preventDefault();
        try {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            // validate email and password
            if (!email ||!password) {
                alert("Please enter both email and password");
                return;
            };
            // email regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Invalid email address");
                return;
            };
            // password regex
            // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            // if (!passwordRegex.test(password)) {
            //     alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character");
            //     return;
            // };
            const data = {
                email: email,
                password: password
            };
            fetch("http://localhost:3000/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    throw new Error(response.data.message);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert(data.message);
                    return;
                }
                localStorage.setItem("swipe.match.hired-accessToken", data.token);
                alert("Sign in successful!");
                window.location.href = "/jobs";
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            });
        }catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        }
    });
})