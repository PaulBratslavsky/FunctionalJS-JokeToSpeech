/***********************************************
  VoiceRSS API
***********************************************/

"use strict";const VoiceRSS={speech:function(e){this._validate(e),this._request(e)},_validate:function(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){var a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw"The browser does not support the audio codec "+e.c}},_request:function(e){var a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;new Audio(t.responseText).play()}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest:function(e){var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&v="+(e.v||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"},_detectCodec:function(){var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR:function(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};
function talk(msg) {
    VoiceRSS.speech({
        key: 'f778c3d5a3464c02b00bdcfd41c01f20',
        src: msg,
        hl: 'en-us',
        v: 'Linda',
        r: 0, 
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    }) 
}

/***********************************************
  Chuck Norris API
***********************************************/

const chuckNorrisAPI = 'https://api.icndb.com/jokes/random';


async function getJokeFromAPI() {
    try {      
        const request = await fetch(chuckNorrisAPI);
        return await request.json();
    } catch (err) {
        console.error(`Something went wrong: ${err}`)
    }
}

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
        talk(model.text)
    }

}

const node = document.getElementById('root')

App(node, view, data)
