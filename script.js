import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    limit,
    orderBy,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

/* ================= FIREBASE ================= */

const firebaseConfig = {
    apiKey: "AIzaSyDM_AQlCscGoPURtxvYFMSMd-crDHhWgA0",
    authDomain: "expensetrackers-8cf1d.firebaseapp.com",
    projectId: "expensetrackers-8cf1d",
    storageBucket: "expensetrackers-8cf1d.firebasestorage.app",
    messagingSenderId: "315835510091",
    appId: "1:315835510091:web:7793aeb890aec6e9ffccce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const dateFilters = document.querySelectorAll(".dateFilter");

dateFilters.forEach(filter => {

    const display = filter.querySelector(".display");
    const icon = filter.querySelector(".icon");
    const value = filter.querySelector(".value");
    const clearBtn = filter.querySelector(".clearBtn");
    const monthInput = filter.querySelector(".monthInput");

    // Open native month picker
    display.addEventListener("click", () => {
        monthInput.showPicker?.();
        monthInput.click();
    });

    // Month selected
    monthInput.addEventListener("change", () => {

        if (!monthInput.value) return;

        const [year, month] = monthInput.value.split("-");

        const date = new Date(year, month - 1);

        value.textContent = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
        });

        icon.classList.add("hidden");
        value.classList.remove("hidden");
        clearBtn.classList.remove("hidden");

        // Optional: store for filtering
        filter.dataset.month = monthInput.value;

        console.log(filter.dataset.month);
    });

    // Clear selection
    clearBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        monthInput.value = "";
        filter.dataset.month = "";

        value.textContent = "";

        icon.classList.remove("hidden");
        value.classList.add("hidden");
        clearBtn.classList.add("hidden");
    });

});

const categories = document.querySelectorAll(".category")
const closeCategoryPage = document.querySelector(".closeCategoryPage")
const categoryBreakdown = document.querySelector(".categoryBreakdown")

for (let category of categories) {
    category.addEventListener("click", () => {
        categoryBreakdown.classList.remove("hidden")
        let catName = category.querySelector(".iconName").innerText
        let catIcon = category.querySelector(".iconImage")
        let catIcon_1 = catIcon.getAttribute("src")

        let clickedIcon = document.querySelector(".clickedIcon")
        let clickedName = document.querySelector(".clickedName")
        clickedName.innerText = catName
        clickedIcon.setAttribute("src", catIcon_1)

    })
}

closeCategoryPage.addEventListener("click", () => {
    categoryBreakdown.classList.add("hidden")
})

const newExpenseDate = document.querySelector(".newExpenseDate")
const newExpenseCat = document.querySelector(".newExpenseCat")
const newExpenseAmount = document.querySelector(".newExpenseAmount")
const submitNewExpense = document.querySelector(".submitNewExpense")
const loader = document.querySelector(".loader")

// Adding new expense to Db 
submitNewExpense.onclick = async () => {

    if (newExpenseDate.value === "" || newExpenseCat.value === 'select' || newExpenseAmount.value === "") return alert('Invalid input');

    loader.classList.remove("hidden")
    try {
        await addDoc(collection(db, 'expenseTrackers'), {
            newExpenseDate: newExpenseDate.value,
            newExpenseCat: newExpenseCat.value,
            newExpenseAmount: newExpenseAmount.value.trim(),
            createdOn: serverTimestamp(),
        });
        newExpenseDate.value = ""
        newExpenseCat.selectedIndex = 0
        newExpenseAmount.value = ""
    }

    finally {
        alert("Data added.")
        loader.classList.add("hidden")
    }

}


// Updating Base Amount and Balance
let baseAmount = document.querySelector(".baseAmount")
let newBaseAmount = document.querySelector(".newBaseAmount")
let updateBaseAmount = document.querySelector(".updateBaseAmount")
const baseAmountWrapper = document.querySelector(".baseAmountWrapper")
const baseAmountUpdateWrapper = document.querySelector(".baseAmountUpdateWrapper");

let globalBaseAmount = 0;

(() => {
    const q = query(
        collection(db, "baseAmount"),
        orderBy("createdOn", "desc"),
        limit(1)
    );

    onSnapshot(q, (snap) => {

        if (snap.empty) {
            baseAmount.innerText = "0";
            return;
        }

        const doc = snap.docs[0];
        const data = doc.data();

        baseAmount.innerText = data.baseAmount;
        globalBaseAmount = Number(data.baseAmount)
        latestBaseAmount()
    });
})();

baseAmountWrapper.addEventListener("click", () => {
    baseAmountUpdateWrapper.classList.toggle("hidden")
})

updateBaseAmount.onclick = async () => {

    if (newBaseAmount.value === "") return alert("Enter Base Amount");

    loader.classList.remove("hidden")

    try {
        await addDoc(collection(db, 'baseAmount'), {
            baseAmount: newBaseAmount.value.trim(),
            createdOn: serverTimestamp(),
        });

    }

    finally {
        alert("Base Amount Updated.")
        baseAmount.value = newBaseAmount.value
        newBaseAmount.value = ""
        loader.classList.add("hidden")
        baseAmountUpdateWrapper.classList.add("hidden")


    }

}

const latestBaseAmount = () => {
    console.log(globalBaseAmount, typeof (globalBaseAmount))
}
