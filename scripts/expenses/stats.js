import { prompts } from "../prompts.js";
import { currencyFormatter, currencyIcon } from '../common.js';
const statsDetails = document.querySelector( ".ex-stats" );

let tagColors = {};
let tagsTotal = {};
let tagIcons = {};

const getTagDetails = () =>
{
  db.collection( "tagDetails" ).onSnapshot( snapshot =>
  {
    tagColors = {};
    tagIcons = {};
    snapshot.forEach( doc =>
    {
      const { tagName, tagColor, icon } = doc.data();

      tagColors[ tagName ] = tagColor;
      tagIcons[ tagName ] = icon;
    } );
    getTagsTotal();
  } );
};

const getTagsTotal = () =>
{
  db.collection( "expenseDetails" ).onSnapshot( snapshot =>
  {
    tagsTotal = {};
    snapshot.forEach( doc =>
    {
      const { tag, expAmount } = doc.data();
      if ( !tagsTotal[ tag ] )
      {
        tagsTotal[ tag ] = 0;
      }
      tagsTotal[ tag ] += Number( expAmount );
    } );
    renderDetails();
  } );
};

const renderDetails = () =>
{
  for ( let tag in tagsTotal )
  {
    let statsData = document.createElement( "div" );
    const amount = tagsTotal[ tag ];
    const color = tagColors[ tag ];
    const icon = tagIcons[ tag ];
    statsData.innerHTML = '';
    statsData.classList.add( "flex", "items-center", "justify-between", "rounded-lg", "p-3", `bg-${ color }` );
    statsData.innerHTML += `
      <div class="left uppercase flex items-center gap-x-1">
        <i class="fa-solid ${ icon } fa-1x text-${ color } bg-white rounded-full p-1"></i>
        <span>${ tag }</span>
        
      </div>
      <div class="right flex items-center gap-x-1">
        <span>${ currencyIcon }</span>
        ${ currencyFormatter( amount ) }
      </div>
    `;
    console.log( tag, amount, color );
    statsDetails.appendChild( statsData );
  }
};

getTagDetails();