let siteNavbar = document.querySelector( ".site-navbar" );
let siteLinks = document.querySelectorAll( ".site-link" );
let pageLinks = document.querySelectorAll( ".page-link" );
let hideSiteNav = document.querySelector( ".hideSiteNav" );
let showSiteNav = document.querySelector(".showSiteNav")
let promptsWrapper = document.querySelector(".promptsWrapper")
let pageTitle = document.querySelector(".pageTitle")
let today = new Date()
let year = today.getFullYear()
let month = String(today.getMonth() + 1).padStart(2, '0')
let date = String(today.getDate()).padStart(2, '0')
let todayDate = `${year}-${month}-${date}`

if (showSiteNav) {
  showSiteNav.onclick = () =>
      {
        siteNavbar.classList.add( "left-0", "z-10" );
        siteNavbar.classList.remove( "-left-[100vw]" );
      };
}

if (hideSiteNav) {
  hideSiteNav.onclick = () =>
  {
    siteNavbar.classList.add( "-left-[100vw]" );
    siteNavbar.classList.remove( "left-0" );
  };
}

const currentPath = window.location.pathname.split("/").pop()
siteLinks.forEach(site_link => {
    let site_url = site_link.getAttribute("href").split("/").pop()
    if (currentPath === site_url) {
        site_link.classList.add("text-white")
    }
    site_link.onclick = () => {
        if (site_url === currentPath) {
            site_link.classList.add("text-white")
        }
    }
})

const prompts = (message, status) => {
  let promptContent = document.createElement("div")
  promptContent.classList.add("w-full", "px-6", "promptContent")
  promptsWrapper.classList.remove("-left-[100vw]")
  promptsWrapper.classList.add("left-0")
  
  document.querySelectorAll(".loaderSpinner").forEach(loader => loader.remove());

  promptContent.innerHTML += `
    <span class="rounded-lg p-3 text-center ${status === "success" ? "bg-emerald-600" : "bg-rose-600"} text-slate-300 font-semibold w-full  capitalize inline-block">${message}</span>
  `
  promptsWrapper.appendChild(promptContent)
  closePrompts()
}

const closePrompts = () => {
  let closePromptsBox = document.querySelector(".closePrompts")
    closePromptsBox.onclick = () => {
      promptsWrapper.classList.remove("left-0")
      promptsWrapper.classList.add("-left-[100vw]")
      let promptContent = document.querySelectorAll(".promptContent")
      promptContent.forEach(prm => {
        prm.remove()
      })
    }
}

let toggleMode = document.querySelector(".toggleMode")
let viewModes = document.querySelectorAll(".viewModes")

toggleMode.onclick = () => {
  viewModes.forEach(view => {
    view.classList.toggle("-right-[100vw]")
    view.classList.toggle("right-0")
    
  })
}

