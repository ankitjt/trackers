import { prompts } from '../prompts.js';
import { todayDate } from '../common.js';
const { year, month, date, dateToday } = todayDate();


const tags = document.querySelectorAll( ".ex-tag" );
let selectedTag = '';
let selectedColor = '';
tags.forEach( tag =>
{
  tag.onclick = () =>
  {
    tags.forEach( t =>
    {
      t.classList.remove( "bg-black" );
    } );
    tag.classList.add( 'bg-black' );
    selectedTag = tag.dataset.tag;
    selectedColor = tag.dataset.color;
  };
} );

// Inputs Fields to Db and checks.
const exInputs = document.querySelectorAll( ".ex-expenseInputs" );
const addExpenseBtn = document.querySelector( ".ex-addExpense" );

addExpenseBtn.onclick = e =>
{

  e.preventDefault();
  let allFilled = true;
  let formData = {};

  exInputs.forEach( input =>
  {
    if ( input.value === "" )
    {
      allFilled = false;
      input.classList.add( "border-2", "border-rose-600" );
      prompts( `${ input.getAttribute( 'id' ) } cannot be blank`, "fail" );
    }
    else
    {
      input.classList.remove( "border-2", "border-rose-600" );
    }
  } );

  if ( selectedTag === "" )
  {
    prompts( "Select a Tag.", "fail" );
    allFilled = false;
  }

  if ( allFilled )
  {
    exInputs.forEach( input =>
    {
      let key = input.getAttribute( "id" );
      formData[ key ] = input.value;
    } );
    formData[ "tag" ] = selectedTag;
    formData[ "tagColor" ] = selectedColor;
    formData[ "entryFullDate" ] = dateToday;
    formData[ "firebaseTimestamp" ] = firebase.firestore.FieldValue.serverTimestamp();
    formData[ "entryYear" ] = year;
    formData[ "entryMonth" ] = month;
    formData[ "entryDate" ] = date;

    db.collection( "expenseDetails" ).add( formData )
      .then( () =>
      {
        prompts( "Expenses details added successfully !!! ", "success" );
        tags.forEach( tag =>
        {
          tag.classList.remove( "bg-black" );
        } );
        exInputs.forEach( input =>
        {
          input.value = '';
        } );
      } )
      .catch( err =>
      {
        prompts( err, "fail" );
      } );

  }

};
