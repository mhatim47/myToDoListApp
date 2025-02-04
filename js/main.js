import ToDoItem from "./todoitem.js";
import ToDoList from "./todolist.js";   

const toDoList = new ToDoList();

// launch app 

document.addEventListener("readystatechange", (event) =>{
    if(event.target.readyState === "complete") {
        initApp();
    }
})

const initApp = () =>{
    // Add linsteners
    
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        processSubmission();
    })

    const clearItem = document.getElementById("clearItems");
    clearItem.addEventListener("click", (e) => {
        const list = toDoList.getList();
        if (list.length) {
            // TODO add custom confirm window
            if (confirm("Are you sure you want to clear the entire list ?")) {
                toDoList.clearList();
                updatePresistentData(toDoList.getList());
                refrechThepage();
            }
        }
    })

    // Procedural
    loadListObject();
    refrechThepage();
}

const loadListObject = () => {
    const stordList = localStorage.getItem("myToDoList");
    if (typeof stordList !== "string") return ; 

    JSON.parse(stordList).forEach(itemObj => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);
        toDoList.addItem(newToDoItem);
    });
    
}

const refrechThepage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnTemEntry();
}

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    // Array.from(parentElement.children).forEach(e => {
    //     parentElement.remove(e);
    // })
    deleteContent(parentElement);
}

const deleteContent = (parentElement) => {
    let child = parentElement.lastElementChild;
    while(child) {
        parentElement.removeChild(child)
        child = parentElement.lastElementChild;
    }
}   

const renderList = () => {
    const list = toDoList.getList();
    list.forEach(item => {
        buildListItem(item);
    });
}

const buildListItem = (item) => {
    const div = document.createElement('div');
    div.className = "item";

    const check = document.createElement('input');
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;
    addClickListenerToCheckbox(check);

    const label = document.createElement('label');
    label.htmlFor = item.getId();
    label.textContent = item.getItem();

    div.appendChild(check);
    div.appendChild(label);

    const container = document.getElementById("listItems");
    container.appendChild(div);
}

const addClickListenerToCheckbox = (checkbox) =>{
    checkbox.addEventListener("click", (event) =>{
        let removedText = "";
        toDoList.getList().forEach((l)=> {
            if (l.getId() == checkbox.id) { 
                removedText = l.getItem();
            }
        })
        toDoList.removeItem(checkbox.id);
        updatePresistentData(toDoList.getList());
        updateScreenReaderConfirmation(removedText, "removed from list");
        setTimeout(() => {
            refrechThepage()
        }, 1000);
    })
}

const updatePresistentData = (list) => {
    localStorage.setItem("myToDoList", JSON.stringify(list));
}

const clearItemEntryField = () => {
    document.getElementById("newItem").value = "";
}
const setFocusOnTemEntry =  () => {
    document.getElementById("newItem").focus();
}

const processSubmission = () => {
    const newEntryText = document.getElementById("newItem").value.trim();
    if (!newEntryText.length) return;
    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId,newEntryText);
    toDoList.addItem(toDoItem);
    updatePresistentData(toDoList.getList());
    updateScreenReaderConfirmation(newEntryText, "added");
    refrechThepage();
}

const calcNextItemId = () => {
    let nextId = 1;
    if (toDoList._list.length) {
        nextId = toDoList._list[toDoList._list.length - 1].getId() + 1;
    }
    return nextId;
}

const createNewItem = (itemId,itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;
}

const updateScreenReaderConfirmation = (newEntryText, actionVerb) => {
    document.getElementById("confirmation").textContent = `${newEntryText} ${actionVerb}.`;
}