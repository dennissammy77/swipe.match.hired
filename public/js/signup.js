document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        try {
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const mobile = document.getElementById("mobile").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            // validate fields 
            if (!name || !email || !mobile || !password || !confirmPassword) {
                alert("Please enter both email and password");
                return;
            };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Invalid email address");
                return;
            };
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            };
            const data = {
                email,
                password,
                name,
                mobile,

            };
            fetch("/api/signup", {
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
                alert("Sign up successful!");
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