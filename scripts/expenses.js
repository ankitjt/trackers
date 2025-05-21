let ex_sections = document.querySelectorAll(".ex-sections")
let exAddButtons = document.querySelectorAll(".ex-addButtons")

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
    // ex_sections.forEach(section => {
    //   section.classList.add("-left-[100vw]")
    //   section.classList.remove("left-0")
    //   if (section.dataset.name === "ledger") {
    //     section.classList.add("left-0")
    //     section.classList.remove("-left-[100vw]")
    //   }
    // })
    // pageLinks.forEach(page => {
    //   page.classList.remove("text-white")
    //   if (page.dataset.name === "ledger") {
    //     page.classList.add("text-white")
    //   }
    // })
  }
})

const expenseInputs = () => {

  let expenseInputs = document.querySelectorAll(".ex-expenseInputs")
  let allFilled = true

  expenseInputs.forEach(input => {
    let header = input.parentElement.children[ 0 ]
    let requiredTextClass = header.querySelector(".required-text")

    if (requiredTextClass) {
      header.removeChild(requiredTextClass)
    }

    if (input.value === "") {
      allFilled = false
      input.classList.add('border-2', 'border-rose-600')
      let requiredText = document.createElement("span")
      requiredText.classList.add("required-text")
      requiredText.innerHTML = `<span class="text-rose-600">Required</span>`
      header.appendChild(requiredText)
    }
    else {
      input.classList.remove("border", "border-rose-600")
    }
  })

  if (allFilled) {
    expenseInputs.forEach(input => {
      console.log(input.getAttribute("id"), input.value)
      input.value = ""  
    })
  }
}





