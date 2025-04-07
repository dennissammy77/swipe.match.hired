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
            const data = {
                email: email,
                password: password
            };
            fetch("/api/signin", {
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
                alert(`An error occurred. Please try again later.${error}`);
            });
        }catch (error) {
            console.error("Error:", error);
            alert(`An error occurred. Please try again later.${error}`);
        }
    });
})