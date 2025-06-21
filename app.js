const BASE_URL = "https://api.frankfurter.app/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with country codes
for (let select of dropdowns) {
    for (let currcode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currcode;
        newOption.value = currcode;
        if (select.name === "from" && currcode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currcode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag image
const updateFlag = (element) => {
    let currcode = element.value;
    let countryCode = countryList[currcode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Convert currency
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    let from = fromCurr.value;
    let to = toCurr.value;

    // Handle same currency case
    if (from === to) {
        msg.innerText = `${amtVal} ${from} = ${amtVal} ${to}`;
        return;
    }

    const URL = `${BASE_URL}?amount=${amtVal}&from=${from}&to=${to}`;

    try {
        let response = await fetch(URL);
        let data = await response.json();
        let rate = data.rates[to];
        let finalAmount = rate;

        msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
    } catch (err) {
        console.error("API Error:", err);
        msg.innerText = "Something went wrong while fetching conversion.";
    }
});



