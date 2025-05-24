import { prompts } from './prompts.js';

let siteNavbar = document.querySelector( ".site-navbar" );
let siteLinks = document.querySelectorAll( ".site-link" );
let hideSiteNav = document.querySelector( ".hideSiteNav" );
let showSiteNav = document.querySelector( ".showSiteNav" );

export const todayDate = () =>
{
  let today = new Date();
  let year = today.getFullYear();
  let month = String( today.getMonth() + 1 ).padStart( 2, '0' );
  let date = String( today.getDate() ).padStart( 2, '0' );
  let dateToday = `${ year }-${ month }-${ date }`;
  return { year, month, date, dateToday };
};

if ( showSiteNav )
{
  showSiteNav.onclick = () =>
  {
    siteNavbar.classList.add( "left-0", "z-10" );
    siteNavbar.classList.remove( "-left-[100vw]" );
  };
}

if ( hideSiteNav )
{
  hideSiteNav.onclick = () =>
  {
    siteNavbar.classList.add( "-left-[100vw]" );
    siteNavbar.classList.remove( "left-0" );
  };
}

const currentPath = window.location.pathname.split( "/" ).pop();
siteLinks.forEach( site_link =>
{
  let site_url = site_link.getAttribute( "href" ).split( "/" ).pop();
  if ( currentPath === site_url )
  {
    site_link.classList.add( "text-white" );
  }
  site_link.onclick = () =>
  {
    if ( site_url === currentPath )
    {
      site_link.classList.add( "text-white" );
    }
  };
} );


let toggleMode = document.querySelector( ".toggleMode" );
let viewModes = document.querySelectorAll( ".viewModes" );

toggleMode.onclick = () =>
{
  viewModes.forEach( view =>
  {
    view.classList.toggle( "-right-[100vw]" );
    view.classList.toggle( "right-0" );

  } );
};

const pageLinks = document.querySelectorAll( ".page-link" );
let pageTitle = document.querySelector( ".pageTitle" );
let exPageSections = document.querySelectorAll( ".ex-sections" );
pageLinks.forEach( link =>
{
  link.onclick = () =>
  {
    pageLinks.forEach( page =>
    {
      page.classList.remove( "text-white" );
    } );
    link.classList.add( "text-white" );
    exPageSections.forEach( section =>
    {
      section.classList.add( "-left-[100vw]" );
      section.classList.remove( "left-0" );
      window.scrollTo( { top: 0 } );
      if ( section.dataset.name === link.dataset.name )
      {
        section.classList.remove( "-left-[100vw]" );
        section.classList.add( "left-0" );
        pageTitle.textContent = section.dataset.name;
      }
    } );
  };
} );

export const deleteEntry = () =>
{
  let deleteEntry = document.querySelectorAll( ".deleteEntry" );
  deleteEntry.forEach( entry =>
  {
    entry.onclick = () =>
    {
      let text = "Are you sure want to delete the record?";
      if ( confirm( text ) === true )
      {
        let targetEntry = entry.parentElement.getAttribute( "id" );
        if ( entry.dataset.delete === "delBaseAmount" )
        {
          db.collection( "baseAmounts" ).doc( targetEntry ).delete()
            .then( () =>
            {
              prompts( "Record deleted successfully.", "success" );
            } )
            .catch( err => prompts( err, 'fail' ) );
        }
        if ( entry.dataset.delete === "delLedger" )
        {
          db.collection( "expenseDetails" ).doc( targetEntry ).delete()
            .then( () =>
            {
              prompts( "Record deleted successfully.", "success" );
            } )
            .catch( err => prompts( err, 'fail' ) );
        }
      }
    };
  } );

}

