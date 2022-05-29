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
const TAGS = 'tags';

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
const renderTags = (arrOfTags, element = tagListWrapper) => {
    let div = document.createElement("div");
    arrOfTags.forEach(elem => {
        div.append(createNewTagHtml(elem));
    })
    element.innerHTML = '';
    element.append(div);
}
const getDataFromInput = (element = addTagInput) => {
    return element.value;
}
const clearInput = (element = addTagInput) => {
    element.value = '';
}
const convertTagToObj = (tag, id) => {
    return {id, tag}
}
const getDataFromLocalStorageAsObj = (name) => {
    return ((localStorage.getItem(name))?JSON.parse(localStorage.getItem(name)):[])
}
const setDataToLocalStorage = (name, data) => {
    console.log(name,data)
    localStorage.setItem(name, JSON.stringify(data));
}
const getNewId = (arr) => {
    if(!arr || arr.length === 0 || !arr.length){
        return 1;
    }else {
        return ((arr[arr.length - 1].id) + 1);
    }
}
const addTagToStore = (tag, store) => {
    console.log(tag,store)
    let id = getNewId(store);
    store.push(convertTagToObj(tag, id));
    console.log(store)
    return store
}
const removeTagFromStore = (tagId, store) => {
    const indexOfTag = store.findIndex(elem => -elem.id === -tagId);
    if(indexOfTag === -1) return store;//error return previous state
    const firstPart = store.slice(0, indexOfTag);
    const secondPart = store.slice(indexOfTag + 1);
    let newArr = firstPart.concat(secondPart);
    return newArr;
}

const addTagHandler = (e) => {
    e.preventDefault();
    let store = addTagToStore(getDataFromInput(),getDataFromLocalStorageAsObj(TAGS))
    setDataToLocalStorage(TAGS,store);
    clearInput();
    renderTags(store);
}
const removeTagHandler = (e) => {
    e.preventDefault();
    let store = removeTagFromStore(e.target.name, getDataFromLocalStorageAsObj(TAGS));
    setDataToLocalStorage(TAGS, store);
    renderTags(store);
}
const changeReadOnlyStatusHandler = (e) => {
    setReadOnly(readonlyCheckbox.checked);
}
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
const firstOpenPage = () => {
    renderTags(getDataFromLocalStorageAsObj(TAGS));
    changeReadOnlyStatusHandler();
}

firstOpenPage();
//to off read only mode try to reload page with ctrl+f5