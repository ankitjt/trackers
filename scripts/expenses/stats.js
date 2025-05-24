import { prompts } from "../prompts.js";

( () =>
{

  db.collection( "expenseDetails" ).get()
    .then( querySnapshot =>
    {
      let arr = [];
      querySnapshot.forEach( doc =>
      {
        let data = doc.data();
        if ( data.tag === "Food" )
        {
          arr.push( Number( data.expAmount ) );
          let final = arr.reduce( ( acc, curr ) => acc + curr, 0 );
          console.log( final );
        }
      } );
    } );
} )();