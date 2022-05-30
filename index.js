//add all necessary selectors
const wrapperTagsApp = document.querySelector('.wrapper_tags_app');

const addTagWrapper = wrapperTagsApp.querySelector('.add_tag');
const addTagInput = addTagWrapper.querySelector('.add_tag_input');
const addTagBtn = addTagWrapper.querySelector('.add_tag_btn');
//selectors change mode
const changeModeWrapper = wrapperTagsApp.querySelector('.change_mode');
const readonlyCheckbox = changeModeWrapper.querySelector('.checkbox_readonly');
//wrapper for all tags
const tagListWrapper = wrapperTagsApp.querySelector('.wrapper_tag_list');
//consts to work without mistakes
/**
 * @constant
 * @default
 */
const TAGS = 'tags';

/**
 * create div element with tag and delete button
 * @param {object} tag - tag object 
 * @param {number} tag.id - unique id for each tag
 * @param {string} tag.tag - tag string
 * @returns {element} return dom element to append on page
 */
const createNewTagHtml = (tag) => {
    let div = document.createElement("div");
    div.style.display = "flex";
    let p = document.createElement("p");
    p.innerText = tag.tag;
    div.append(p);
    let btn = document.createElement('button');
    btn.name = tag.id;
    btn.innerHTML = '&times'; 
    div.append(btn);
    return div;
}

//arrOfTags. tag
/**
 * get all tags and add dom elements from tags
 * @param {object[]} arrOfTags - array of object tags
 * @param {number} arrOfTags[].id - unique id for each tag
 * @param {string} arrOfTags[].tag - tag string
 * @param {Element} [wrapper] - wrrapper dom elem to add all dom elements 
 */
const renderTags = (arrOfTags, wrapper = tagListWrapper) => {
    let div = document.createElement("div");
    arrOfTags.forEach(elem => {
        div.append(createNewTagHtml(elem));
    })
    wrapper.innerHTML = '';
    wrapper.append(div);
}

/**
 * return value of dom element
 * @param {Element} [element] 
 * @returns {string} element.value
 */
const getDataFromInput = (element = addTagInput) => {
    return element.value;
}

/**
 * change element.value = '';
 * @param {Element} [element] - changed element
 */
const clearInput = (element = addTagInput) => {
    element.value = '';
}

/**
 * get 2 params and complete object
 * @param {string} tag 
 * @param {number} id 
 * @return {{tag: tag, id: id}} obj
 */
const convertTagToObj = (tag, id) => {
    return {id, tag}
}

/**
 * get key of lockalStorage and return value if no key return []
 * @param {string} name key of lockal storage value
 * @returns {array} array from lockalStorage or []
 */
const getDataFromLocalStorageAsObj = (name) => {
    return ((localStorage.getItem(name))?JSON.parse(localStorage.getItem(name)):[])
}

/**
 * set item to localStorage
 * @param {string} key to add to lockalStorage
 * @param {object} data will JSON.stringify
 * set lockalStorage with key: key; and value: data
 */
const setDataToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * 
 * @param {[]} arr array of tags
 * @returns {number} if arr param no array then return 1 else return (id + 1) from last element of array
 */
const getNewId = (arr) => {
    return ((!arr || arr.length === 0 || !arr.length) ? 1 : ((arr[arr.length - 1].id) + 1))     
}

/**
 * add new tag to store
 * @param {string} tag name of tag to add
 * @param {object[]} store - array of object tags
 * @param {number} store[].id - unique id for each tag
 * @param {string} store[].tag - tag string
 * @returns {object[]} store with added one more tagObject
 */
const addTagToStore = (tag, store) => {
    let id = getNewId(store);
    store.push(convertTagToObj(tag, id));
    return store
}

/**
 * find tag at the store array by id, and delete it
 * if not found return curent store
 * @param {number} tagId to find element
 * @param {object[]} store 
 * @returns {object[]} array without element with id: tagId
 */
const removeTagFromStore = (tagId, store) => {
    const indexOfTag = store.findIndex(elem => -elem.id === -tagId);
    if(indexOfTag === -1) return store;//error return previous state
    const firstPart = store.slice(0, indexOfTag);
    const secondPart = store.slice(indexOfTag + 1);
    let newArr = firstPart.concat(secondPart);
    return newArr;
}

/**
 * @function after click button event
 * add tag to store
 * set store to local storage
 * clear input
 * render to page all tags from store
 * @param {*} e event to cancel default events
 */
const addTagHandler = (e) => {
    e.preventDefault();
    let store = addTagToStore(getDataFromInput(),getDataFromLocalStorageAsObj(TAGS))
    setDataToLocalStorage(TAGS,store);
    clearInput();
    renderTags(store);
}

/**
 * @function after click button event
 * remove target tag from store
 * set store to localStorage
 * render to page all tags from store
 * @param {*} e event to cancel default events and to get e.target.name
 */
const removeTagHandler = (e) => {
    e.preventDefault();
    let store = removeTagFromStore(e.target.name, getDataFromLocalStorageAsObj(TAGS));
    setDataToLocalStorage(TAGS, store);
    renderTags(store);
}

/**
 *  after change checkbox status on the page
 * coll function
 * {@link setReadOnly}
 * @param {*} e 
 */
const changeReadOnlyStatusHandler = (e) => {
    setReadOnly(readonlyCheckbox.checked);
}

/**
 * add or remove to all buttons and input in wrapper of app 'disabled' attribure depend on isReadOnly
 * add or remove listeners to page depend on isReadOnly
 * @param {boolean} isReadOnly parametr of checkbox
 */
const setReadOnly = (isReadOnly) => {
    let inputs = wrapperTagsApp.querySelectorAll('input');
    let btns = wrapperTagsApp.querySelectorAll('button');
    if(isReadOnly){
        inputs.forEach(elem=>elem.setAttribute('disabled', 'disabled'));
        btns.forEach(elem=>elem.setAttribute('disabled', 'disabled'));
        addTagBtn.removeEventListener("click", addTagHandler);
        readonlyCheckbox.removeEventListener("click", changeReadOnlyStatusHandler);
        tagListWrapper.removeEventListener("click", removeTagHandler);
    } else {
        inputs.forEach(elem=>elem.removeAttribute('disabled'));
        btns.forEach(elem=>elem.removeAttribute('disabled'));
        addTagBtn.addEventListener("click", addTagHandler);
        readonlyCheckbox.addEventListener("click", changeReadOnlyStatusHandler);
        tagListWrapper.addEventListener("click", removeTagHandler);
    } 
}

/**
 * @function start when script start(page open first)
 * it render all tags from lockal storage on page
 * check readOnly status
 */
const firstOpenPage = () => {
    renderTags(getDataFromLocalStorageAsObj(TAGS));
    changeReadOnlyStatusHandler();
}
//run script functionality
firstOpenPage();
//to off read only mode try to reload page with ctrl+f5