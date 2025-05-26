import { todayDate, currencyFormatter } from './scripts/common.js'
const { month, year } = todayDate()

const showMonthFilter = document.querySelectorAll(".showMonthFilter")
const monthFilter = document.querySelectorAll(".monthFilter");

(() => {
  let totalExpense = 0
  let totalSaved = 0
  let totalLater = 0

  db.collection("expenseDetails")
    .where("entryMonth", "==", month)
    .where("entryYear", "==", year)
    .onSnapshot(querySnapshot => {
      totalExpense = 0
      totalSaved = 0

      querySnapshot.forEach(doc => {
        let data = doc.data()
        const amount = Number(data.expAmount)
        if (data.tag === "Saved") {
          totalSaved += amount
        }
        if (data.tag === "Later") {
          totalLater += amount
        }
        else if (data.tag !== "Saved" && data.tag !== "Later") {
          totalExpense += amount
          // totalExpense = totalExpense - totalLater
        }

      })

      document.querySelector(".totalExpense").textContent = currencyFormatter(totalExpense)

      document.querySelector(".totalSaved").textContent = currencyFormatter(totalSaved)

      document.querySelector(".totalLater").textContent = currencyFormatter(totalLater)
    })

  // Total Left
  db.collection("baseAmounts")
    .where("systemMonth", "==", month)
    .where("systemYear", "==", year)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        let data = doc.data()
        let totalLeft = Number(data.exAmount) - (totalSaved + totalExpense)
        document.querySelector(".totalLeft").textContent = currencyFormatter(totalLeft)
      })
    })


})();

showMonthFilter.forEach((filter, index) => {
  filter.onclick = () => {
    const input = monthFilter[ index ]
    const isVisible = !input.classList.contains("opacity-0")

    showMonthFilter.forEach(icon => icon.classList.remove("text-white"))
    monthFilter.forEach(monthInput => {
      monthInput.classList.add("opacity-0", "pointer-events-none")
    })

    if (!isVisible) {
      filter.classList.add("text-white")
      input.classList.remove("opacity-0", "pointer-events-none")
    }
  }

})

monthFilter.forEach(filter => {
  filter.onchange = () => {
    if (filter.dataset.input === "expenseSummary") {
      console.log("You want the expense summary.")
    }
    if (filter.dataset.input === "countSummary") {
      console.log("You want the counts summary.")
    }
  }
})