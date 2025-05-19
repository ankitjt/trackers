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


pageLinks.forEach( page =>
{
  page.onclick = () =>
  {
    pageLinks.forEach( link =>
    {
      link.classList.remove( "text-white" );
    } );
    page.classList.add( "text-white" );

  };
} );