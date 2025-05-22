let ex_sections = document.querySelectorAll(".ex-sections")
let exAddButtons = document.querySelectorAll(".ex-addButtons");

// Fetching data from Database ( Firestore )
(() => {
  let expenseLedger = document.querySelector(".ex-ledgerWrapper")

  db.collection("expenseDetails")
    .orderBy("expDate", "desc")
    .onSnapshot(querySnapshot => {
      // Clear old HTML
      expenseLedger.innerHTML = ''
      
      // Group data by dates
      const groupedData = {}

      querySnapshot.forEach(doc => {
        const data = doc.data()
        const date = data.expDate
        if (!groupedData[ date ]) {
          groupedData[ date ] = []
        }
        groupedData[ date ].push({
          id: doc.id,
          ...data
        })
      })

      Object.keys(groupedData).forEach(date => {
        let ledgerDate = document.createElement("div")
        let groupContainer = document.createElement("div")
        groupContainer.classList.add("flex", "flex-col", "gap-y-10")

        ledgerDate.innerHTML = `
          <div
            class="ledgerDate sticky text-white top-5 text-center text-xs ">
            <span class="bg-[#222] tracking-wider p-3 rounded-lg">${date}</span>
          </div>
        `
        groupContainer.appendChild(ledgerDate)

        groupedData[ date ].forEach(entry => {
          let entryDetails = document.createElement("div")
          let tagTextColor = `bg-${entry.tagColor}`
          entryDetails.classList.add("rounded-lg", "p-5", "grid","grid-cols-3","entryDetails","dark:bg-black/70", "bg-slate-200")
          entryDetails.id = entry.id

          entryDetails.innerHTML = `
          <div class="left flex items-center">
            <span class="capitalize">${entry.expDetails}</span>
          </div>

          <div class="text-center">
            <span class="${tagTextColor} text-center rounded-lg p-2 font-bold w-16 inline-block text-xs uppercase">${entry.tag}</span>
          </div>

          <div class="right flex items-center justify-end text-right gap-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 7.5A.75.75 0 0 0 9 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 0 0 9 12h3.622a2.251 2.251 0 0 1-2.122 1.5H9a.75.75 0 0 0-.53 1.28l3 3a.75.75 0 1 0 1.06-1.06L10.8 14.988A3.752 3.752 0 0 0 14.175 12H15a.75.75 0 0 0 0-1.5h-.825A3.733 3.733 0 0 0 13.5 9H15a.75.75 0 0 0 0-1.5H9Z" clip-rule="evenodd" />
          </svg>
            <span>
            ${ new Intl.NumberFormat( "en-IN", { currency: "INR", maximumFractionDigits: 2, minimumFractionDigits: 2 } ).format( entry.expAmount ) }
            </span>
          </div>

          `
          groupContainer.appendChild(entryDetails)
        })
        expenseLedger.appendChild(groupContainer)
        
      })
    })
})();

// Highlighting Page Links 
pageLinks.forEach(page =>
  {
      page.onclick = () =>
      {
      pageLinks.forEach( link =>
      {
          link.classList.remove( "text-white" );
      } );
        page.classList.add("text-white");
        ex_sections.forEach(section => {
          section.classList.add("-left-[100vw]")
          section.classList.remove("left-0")
          window.scrollTo({top: 0})
          if (page.dataset.name === section.dataset.name) {
            section.classList.remove("-left-[100vw]")
            section.classList.add("left-0")
          }
        })
      };
});

// Add button actions 
exAddButtons.forEach(addButton => {
  addButton.onclick = () => {
    if (addButton.dataset.button === "addExpense") {
      expenseInputs()
    }
    if (addButton.dataset.button === "addBaseAmount") {
      console.log("Add Base Amount button clicked.")
    }
  }
})

// Getting Tags
let tags = document.querySelectorAll(".ex-tag")
let selectedTag = ''
let selectedColor = ''
tags.forEach(tag => {
  tag.onclick = () => {
    tags.forEach(clearTag => {
      clearTag.classList.remove("bg-black")
    })
    tag.classList.add("bg-black")
    selectedTag = tag.dataset.tag
    selectedColor = tag.dataset.color
  }
})

// Getting Expense Inputs Data and checks.
const expenseInputs = () => {
  let expenseInputs = document.querySelectorAll(".ex-expenseInputs")
  let allFilled = true
  let formData = {}

  expenseInputs.forEach(input => {
    if (input.value === "") {
      allFilled = false
      input.classList.add('border-2', 'border-rose-600')
      prompts(`${input.getAttribute("id")} cannot be empty`, "fail")
    }
    else {
      input.classList.remove("border", "border-rose-600")
    }
  })

  if (selectedTag === "") {
    allFilled = false
    prompts("Select a Tag", "fail")
  }

  if (allFilled) {
    expenseInputs.forEach(input => {
      let objKey = input.getAttribute("id")
      formData[ objKey ] = input.value
    })

    formData[ "tag" ] = selectedTag
    formData[ "tagColor" ] = selectedColor
    formData[ "entryDate" ] = todayDate
    formData[ "firebaseDate" ] = firebase.firestore.FieldValue.serverTimestamp()
    formData["entryYear"] = year
    formData[ "entryMonth" ] = month
    formData["entryDate"] = date

    db.collection("expenseDetails").add(formData)
      .then(() => {
        prompts("Expense added successfully !!!", "success")
        tags.forEach(clearTag => {
          clearTag.classList.remove("bg-black")
        })
        expenseInputs.forEach(input => {
          input.value = ""
        })
      })
      .catch(err => {
        prompts(err, "fail")
      })
  }
}






