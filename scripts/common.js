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

if ( toggleMode )
{
  toggleMode.onclick = () =>
  {
    viewModes.forEach( view =>
    {
      view.classList.toggle( "-right-[100vw]" );
      view.classList.toggle( "right-0" );

    } );
  };
}

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

export const updateRecord = () =>
{
  const updateRecords = document.querySelectorAll( ".updateRecord" );
  updateRecords.forEach( record =>
  {

    let deleteText = "Are you sure want to delete the record?";
    let updateText = "Are you sure want to update the record?";

    record.onclick = () =>
    {
      let recordParent = record.parentElement.getAttribute( "id" );

      // Delete Ledger.
      if ( record.dataset.update === "deleteLedger" )
      {
        if ( confirm( deleteText ) === true )
        {
          db.collection( "expenseDetails" ).doc( recordParent ).delete()
            .then( () => prompts( "Record deleted successfully.", "success" ) )
            .catch( err => prompts( err, "fail" ) );
        }
      }

      // Clear Ledger.
      if ( record.dataset.update === "clearLedger" )
      {
        if ( confirm( updateText ) === true )
        {
          db.collection( "expenseDetails" ).doc( recordParent ).update( {
            clearRecord: "Cleared"
          } )
            .then( () => prompts( "Record updated successfully.", "success" ) )
            .catch( err => prompts( err, "fail" ) );
          record.classList.add( "text-emerald-600" );
          record.classList.remove( "text-rose-600" );
        }
      }

      // Delete Base Amount.
      if ( record.dataset.update === "deleteBaseAmount" )
      {
        if ( confirm( deleteText ) === true )
        {
          db.collection( "baseAmounts" ).doc( recordParent ).delete()
            .then( () => prompts( "Record deleted successfully.", "success" ) )
            .catch( err => prompts( err, "fail" ) );
        }
      }

    };
  } );
};

export const currencyIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 7.5A.75.75 0 0 0 9 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 0 0 9 12h3.622a2.251 2.251 0 0 1-2.122 1.5H9a.75.75 0 0 0-.53 1.28l3 3a.75.75 0 1 0 1.06-1.06L10.8 14.988A3.752 3.752 0 0 0 14.175 12H15a.75.75 0 0 0 0-1.5h-.825A3.733 3.733 0 0 0 13.5 9H15a.75.75 0 0 0 0-1.5H9Z" clip-rule="evenodd" />
            </svg>
`;

export const currencyFormatter = value =>
  new Intl.NumberFormat( "en-IN", {
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  } ).format( value );

