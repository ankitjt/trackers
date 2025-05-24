import { prompts } from '../prompts.js';
import { todayDate } from '../common.js';
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
              class="ex-base-monthHistory flex items-center justify-between dark:bg-black/60 rounded-lg p-4 bg-slate-200" id='${ doc.id }'>
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
