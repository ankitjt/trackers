const promptsWrapper = document.querySelector( ".promptsWrapper" );

export const prompts = ( message, status ) =>
{
  let promptContent = document.createElement( "div" );
  promptContent.classList.add( "w-full", "px-6", "promptContent" );
  promptsWrapper.classList.remove( "-left-[100vw]" );
  promptsWrapper.classList.add( "left-0" );


  promptContent.innerHTML += `
    <span class="rounded-lg p-3 text-center ${ status === "success" ? "bg-emerald-600" : "bg-rose-600" } text-slate-300 font-semibold w-full  capitalize inline-block">${ message }</span>
  `;
  promptsWrapper.appendChild( promptContent );
  closePrompts();
};



const closePrompts = () =>
{
  let closePromptsBox = document.querySelector( ".closePrompts" );
  closePromptsBox.onclick = () =>
  {
    promptsWrapper.classList.remove( "left-0" );
    promptsWrapper.classList.add( "-left-[100vw]" );
    let promptContent = document.querySelectorAll( ".promptContent" );
    promptContent.forEach( prm =>
    {
      prm.remove();
    } );
  };
};
