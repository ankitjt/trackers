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
    where,
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

// Global Variables
let globalBaseAmount = 0;
let currentMonth = getCurrentMonthKey()
let currentMonthExpenses = [];
const categoryCards = document.querySelectorAll(".category")
const remaining = document.querySelector(".remaining")

function getCurrentMonthKey() {

    const today = new Date();

    return `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;
};



const dateFilters = document.querySelectorAll(".dateFilter");
for (let dateFilter of dateFilters) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    dateFilter.value = `${year}-${month}`;
}

// dateFilters.forEach(filter => {

//     const display = filter.querySelector(".display");
//     const icon = filter.querySelector(".icon");
//     const value = filter.querySelector(".value");
//     const clearBtn = filter.querySelector(".clearBtn");
//     const monthInput = filter.querySelector(".monthInput");

//     // Open native month picker
//     display.addEventListener("click", () => {
//         monthInput.showPicker?.();
//         monthInput.click();
//     });

//     // Month selected
//     monthInput.addEventListener("change", () => {

//         if (!monthInput.value) return;

//         const [year, month] = monthInput.value.split("-");

//         const date = new Date(year, month - 1);

//         value.textContent = date.toLocaleDateString("en-US", {
//             month: "short",
//             year: "numeric"
//         });

//         icon.classList.add("hidden");
//         value.classList.remove("hidden");
//         clearBtn.classList.remove("hidden");

//         // Optional: store for filtering
//         filter.dataset.month = monthInput.value;

//         console.log(filter.dataset.month);
//     });

//     // Clear selection
//     clearBtn.addEventListener("click", (e) => {

//         e.stopPropagation();

//         monthInput.value = "";
//         filter.dataset.month = "";

//         value.textContent = "";

//         icon.classList.remove("hidden");
//         value.classList.add("hidden");
//         clearBtn.classList.add("hidden");
//     });

// });

// Showing category wise transactions.

const closeCategoryPage = document.querySelector(".closeCategoryPage")
const categoryBreakdown = document.querySelector(".categoryBreakdown")

for (let category of categoryCards) {
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



// Adding new expense to Db 
const newExpenseDate = document.querySelector(".newExpenseDate")
const newExpenseCat = document.querySelector(".newExpenseCat")
const newExpenseAmount = document.querySelector(".newExpenseAmount")
const submitNewExpense = document.querySelector(".submitNewExpense")
const loader = document.querySelector(".loader")

submitNewExpense.onclick = async () => {

    if (newExpenseDate.value === "" || newExpenseCat.value === 'select' || newExpenseAmount.value === "") return alert('Invalid input');

    const today = new Date();

    const monthKey =
        `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}`;

    const [year, month] = monthKey.split("-")

    loader.classList.remove("hidden")
    try {
        await addDoc(collection(db, 'expenseTrackers'), {
            newExpenseDate: newExpenseDate.value,
            category: newExpenseCat.value,
            amount: Number(newExpenseAmount.value.trim()),
            monthKey: monthKey,
            year: Number(year),
            month: Number(month),
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
        // latestBaseAmount()
        updateCategoryCards()
        loadMonthExpense(currentMonth)
    });
})();


// Update Base Amount
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


// Update Category Cards
const updateCategoryCards = () => {
    const categoryTotals = {}
    let totalSpent = 0

    currentMonthExpenses.forEach(expense => {
        const category = expense.category
        const amount = Number(expense.amount)
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        totalSpent += amount;
    })

    categoryCards.forEach(card => {

        const category =
            card.dataset.category;

        const spentAmount =
            card.querySelector(".spentAmount");

        const spentPercentage =
            card.querySelector(".spentPercentage");

        const total =
            categoryTotals[category] || 0;

        const percentage =
            globalBaseAmount > 0
                ? (
                    (total / globalBaseAmount)
                    * 100
                ).toFixed(2)
                : "0.00";

        spentAmount.textContent =
            total.toLocaleString("en-IN");

        spentPercentage.textContent =
            `(${percentage}%)`;


    });

    const remainingBalance =
        globalBaseAmount - totalSpent;
    document.querySelector(".remaining")
        .textContent =
        remainingBalance.toLocaleString("en-IN");

}

// Loading Month Data
const loadMonthExpense = monthKey => {
    const q = query(
        collection(db, "expenseTrackers"),
        where(
            "monthKey",
            "==",
            monthKey
        )
    );

    onSnapshot(q, snap => {

        currentMonthExpenses = [];

        snap.forEach(doc => {

            currentMonthExpenses.push({
                id: doc.id,
                ...doc.data()
            });
        });

        updateCategoryCards();
    });
}

loadMonthExpense(currentMonth)
