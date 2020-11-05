/***********************************************
  VARIABLES
***********************************************/

const chuckNorrisAPI = 'https://api.icndb.com/jokes/random';

/***********************************************
    HELPER FUNCTIONS
***********************************************/

function createNodeElement(tag, className, value, children) {
    const data = document.createElement(tag);

    if (className) {
        className.forEach(item => data.classList.add(item))
    }

    if (value) {
        data.appendChild(document.createTextNode(value))
    }
    
    if (children) {
        children.forEach(child => data.appendChild(child))
    }
    
    return data
}


/***********************************************
    PURE FUNCTIONS
***********************************************/

function createButton(className, value, onClick) {
    let buttonNode = createNodeElement('button', className, value, null)
    if (onClick) buttonNode.onclick = onClick
    return buttonNode
}

function createTextContainer(id, className, model) {
    const containerNode = createNodeElement('div', [className], model.text, null)
    containerNode.id = id;
    return containerNode;
}

function createAudio(className, src,) {
    let audioNode = createNodeElement('audio', className, null, null)
    if (src) audioNode.src = src
    audioNode.controls = 'controls'
    return audioNode
}

/***********************************************
    MODEL
***********************************************/

const data = {
    id: '',
    text: 'Click Button to hear joke!'
};

/***********************************************
    VIEW
***********************************************/

function view(fn, model) {
    return createNodeElement('div', ['main'], null, [
        createButton(['button'], 'click me', () => fn('get-data')),
        createTextContainer(['text-container'], 'text-container', model),
        createAudio(['audio']),
    ]);
}

/***********************************************
    UPDATE
***********************************************/

async function update(event, model) {
    switch(event) {
        case 'get-data': 
            const result = await getJokeFromAPI()
            const { id, joke } = result.value
            const data = { ...model, id, text: joke }
            return data
        default:
            return model
    }
}

/***********************************************
    DIRTY FUNCTIONS
***********************************************/
async function getJokeFromAPI() {

    try {      
        const request = await fetch(chuckNorrisAPI);
        const result = await request.json();
        return result
    } catch (err) {
        console.error(`Something went wrong: ${err}`)
    }

}

function App(node,view,initModel) {

    let model = initModel
    let currentView = view(dispatch, model)
    node.appendChild(currentView)

   // Dispatch function triggers update
   async function dispatch(msg) {
        model = await update(msg, model)

        // Updates HTML veiw
        const updatedView = view(dispatch, model)

        // Replaces Old HTML view in the DOM
        node.replaceChild(updatedView, currentView)

        // Sets current view to updated view
        currentView = updatedView
        console.log(model)

    }

}

const node = document.getElementById('root')

App(node, view, data)
