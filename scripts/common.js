let siteNavbar = document.querySelector( ".site-navbar" );
let siteLinks = document.querySelectorAll( ".site-link" );
let pageLinks = document.querySelectorAll( ".page-link" );
let hideSiteNav = document.querySelector( ".hideSiteNav" );
let showSiteNav = document.querySelector(".showSiteNav")

showSiteNav.onclick = () =>
    {
      siteNavbar.classList.add( "left-0", "z-10" );
      siteNavbar.classList.remove( "-left-[100vw]" );
    };
    
    hideSiteNav.onclick = () =>
    {
      siteNavbar.classList.add( "-left-[100vw]" );
      siteNavbar.classList.remove( "left-0" );
    };

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

