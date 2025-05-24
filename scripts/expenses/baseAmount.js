import { prompts } from '../prompts.js';
import { todayDate, deleteEntry } from '../common.js';
const { year, month, date, dateToday } = todayDate();

const baseInputs = document.querySelectorAll( ".ex-baseInputs" );
const addBaseAmount = document.querySelector( ".ex-addBaseAmount" );
const baseAmountHistory = document.querySelector( ".baseAmountHistory" );
const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

( () =>
{
  db.collection( "baseAmounts" )
    .orderBy( "entryMonth", "desc" )
    .onSnapshot( querySnapshot =>
    {
      baseAmountHistory.innerHTML = '';
      let historyDetails = document.createElement( "div" );
      historyDetails.classList.add( "flex", "flex-col", "gap-y-4" );
      querySnapshot.forEach( doc =>
      {
        historyDetails.innerHTML += `
          <div
              class="ex-base-monthHistory flex items-center justify-between dark:bg-black/60 rounded-lg p-4 bg-slate-200 relative" id='${ doc.id }'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-rose-600 absolute -bottom-2 left-1/2 -translate-x-1/2 deleteEntry" data-delete="delBaseAmount">
              <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
            </svg>

              <div class="ex-baseAmountMonthYear flex items-center">
                <div class="ex-base-month">${ months[ Number( doc.data().entryMonth ) - 1 ] }</div>
                <div>,</div>
                <div class="ex-base-year ml-1">${ doc.data().entryYear }</div>
              </div>
              <div class="ex-baseAmountHistory flex items-center gap-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 7.5A.75.75 0 0 0 9 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 0 0 9 12h3.622a2.251 2.251 0 0 1-2.122 1.5H9a.75.75 0 0 0-.53 1.28l3 3a.75.75 0 1 0 1.06-1.06L10.8 14.988A3.752 3.752 0 0 0 14.175 12H15a.75.75 0 0 0 0-1.5h-.825A3.733 3.733 0 0 0 13.5 9H15a.75.75 0 0 0 0-1.5H9Z"
                    clip-rule="evenodd" />
                </svg>
                <span class="ex-base-monthAmount">${ new Intl.NumberFormat( "en-IN", { currency: "INR", maximumFractionDigits: 2, minimumFractionDigits: 2 } ).format( doc.data().exAmount ) }</span>
              </div>
            </div>
        `;
      } );
      baseAmountHistory.appendChild( historyDetails );
      deleteEntry();
    } );
} )();

addBaseAmount.onclick = () =>
{
  let baseInputData = {};
  let allFilled = true;

  baseInputs.forEach( input =>
  {

    if ( input.value === '' )
    {
      prompts( `${ input.dataset.name } cannot be blank.`, 'fail' );
      input.classList.add( "border-2", "border-rose-600" );
      allFilled = false;
    }
    else
    {
      input.classList.remove( "border-2", "border-rose-600" );
    }
  } );

  if ( allFilled )
  {
    baseInputs.forEach( input =>
    {
      let key = input.getAttribute( "id" );
      baseInputData[ key ] = input.value;
      if ( input.getAttribute( "type" ) === "month" )
      {
        let splitter = input.value.split( "-" );
        baseInputData[ 'entryYear' ] = splitter[ 0 ];
        baseInputData[ 'entryMonth' ] = splitter[ 1 ];
      }
    } );
    baseInputData[ "systemFullDate" ] = dateToday;
    baseInputData[ "systemYear" ] = year;
    baseInputData[ "systemMonth" ] = month;
    baseInputData[ "systemDate" ] = date;
    baseInputData[ "firebaseTimestamp" ] = firebase.firestore.FieldValue.serverTimestamp();
    db.collection( "baseAmounts" ).add( baseInputData )
      .then( () =>
      {
        prompts( "Base Amount added.", "success" );
        baseInputs.forEach( input =>
        {
          input.value = '';
        } );
      } )
      .catch( err => prompts( err, "fail" ) );
  }

};
