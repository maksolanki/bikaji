// Get references to all input fields and error message spans
const nameInput = document.getElementById("name");
const contactNumberInput = document.getElementById("contact_number");
const nameError = document.getElementById("name-error");
const contactNumberError = document.getElementById("contact_number-error");
const errorMessage = document.getElementById("error");
let apiResponseValue = null;

// Function to validate the input
function validateInput(input, errorElement) {
    if (input.value.trim() === "") {
        errorElement.textContent = "This is a required field.";
        return true
    } else {
        errorElement.textContent = "";
        return false
    }
}

function showError(error, errorElement) {
    console.log(error)
    if (error.status === 400) {
        errorElement.textContent = "Opps! Something went wrong please try again later.";
    } else if (error.status === 204) {
        errorElement.textContent = "Opps! The discount time is over now.";
    } else if (error.status === 429) {
        errorElement.textContent = "Opps! It appears you've attempted to retrieve the code multiple times.";
    } else if (error.status === 401) {
        errorElement.textContent = "Opps! Something went wrong please try again later.";
    }
}

// Add event listeners for the focusout event
nameInput.addEventListener("focusout", () => {
    validateInput(nameInput, nameError);
});

contactNumberInput.addEventListener("focusout", () => {
    validateInput(contactNumberInput, contactNumberError);
});


// Optional: Add a form submit event listener to prevent form submission if there are errors
const form = document.getElementById("myForm");

form.addEventListener("submit", (event) => {
    validateInput(nameInput, nameError);
    validateInput(contactNumberInput, contactNumberError);

    if (nameError.textContent || contactNumberError.textContent || cityError.textContent) {
        event.preventDefault(); // Prevent form submission if there are errors
    }
});

// Function to handle the form submission
function onSubmit(token) {
    const nameIsValid = !validateInput(nameInput, nameError);
    const contactNumberIsValid = !validateInput(contactNumberInput, contactNumberError);
    if (nameIsValid && contactNumberIsValid) {
        // Gather form data
        const formData = new FormData(document.getElementById('myForm'));

        // Define custom headers
        const headers = {
            'Accept': 'text/plain',
            'Content-Type': 'application/json',
        };

        // Make the API call using Axios with custom headers
        axios
            .post('https://apis.chatomate-bikaji.gradlesol.com/CouponCode', formData, {
                headers: headers
            })
            .then((response) => {
                // Handle the API response here
                const myVariable = response.data.data;
                replaceContentWithCode(myVariable)

            })
            .catch((error) => {
                // Handle API call errors here
                showError(error.response, errorMessage)
                console.error('API Error:', error);

            });
    }
}

function replaceContentWithCode(code) {
    const couponCodeContainer = document.querySelector(".coupon-code");
    couponCodeContainer.innerHTML = `
        <h1>Thank You!!</h1>
        <p>Copy the code below and enjoy a discount on your next Bikaji product purchase</p>
        <div class="card">
            <div class="p-4">
                <span>Here's your code. Copy the code and grab the discount</span>
                <div class="input-group mb-3 copy-code mt-3">
                    <input type="text" class="form-control copy-input" id="code" value="${code}" readonly>
                    <span onclick="copyCode()" class="input-group-text copy-icon" id="basic-addon2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
</svg>
</svg>
                </span>
            </div>
        </div>
    `;
}

// Example usage:
// Replace 'yourCodeFromAPI' with the actual code you receive from your API response.

// Add an event listener to the form for form submission
document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    onSubmit(); // Call the onSubmit function
});

function copyCode() {
    var copyText = document.getElementById("code");
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


// Add an input event listener to the CONTACT NUMBER input field
contactNumberInput.addEventListener("input", () => {
    const maxCharLimit = 10; // Define your maximum character limit
    const inputValue = contactNumberInput.value;

    if (!/^\d*$/.test(inputValue)) {
        // Check if the input contains only numbers
        contactNumberError.textContent = "Please enter only numbers.";
        contactNumberInput.value = inputValue.replace(/[^\d]/g, ""); // Remove non-numeric characters
    } else if (inputValue.length > maxCharLimit) {
        contactNumberInput.value = inputValue.slice(0, maxCharLimit); // Truncate input if it exceeds the limit
        contactNumberError.textContent = ""; // Clear the error message
    } else {
        contactNumberError.textContent = ""; // Clear the error message
    }
});
