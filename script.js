const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector(".item-list");
const feedback = document.querySelector(".feedback");
const addBtn = document.querySelector("#add-item");
const clearBtn = document.querySelector("#clear-list");

let todoList = [];

const getList = function (todoItems) {
    itemList.innerHTML = "";
    todoItems.forEach((item, index)=>{
        itemList.insertAdjacentHTML("beforeend", 
            `<div class="item">
                    <div class="item-info">
                        <h6 class="item-index">${index}</h6>
                        <p class="item-name">${item}</p>
                    </div>
                    <div class="item-icons">
                        <i class="far fa-check-circle complete-item"></i>
                        <i class="far fa-edit edit-item"></i>
                        <i class="far fa-times-circle delete-item"></i>
                    </div>
                </div>`);
        handleItem(item);
    });
};

const handleItem = function (itemName) {
    const items = itemList.querySelectorAll(".item");
    
    items.forEach((item)=>{
        if(item.querySelector(".item-name").textContent.trim().toLowerCase() === itemName.trim().toLowerCase()){
            //complete event
            item.querySelector(".complete-item").addEventListener("click", function () {
                let itemIndex=item.querySelector(".item-index");
                let itemName=item.querySelector(".item-name");

                itemIndex.classList.toggle("completed");
                itemName.classList.toggle("completed");
            });
            //edit event
            item.querySelector(".edit-item").onclick = () => {
                addBtn.innerHTML = "Edit item";
                itemInput.value = itemName;
                itemList.removeChild(item);

                todoItems = todoItems.filter((item) => {
                    return item !== itemName;
                });
                setLocalStorage(todoItems);
            };
            //delete event
            item.querySelector(".delete-item").onclick = () => {
                if(confirm("Are you sure?")){
                    itemList.removeChild(item);
                    todoItems = todoItems.filter((item) => {
                        return item !== itemName;
                    });
                    setLocalStorage(todoItems); 
                    getList(todoItems); //gets the new list after deletion(s)
                    sendFeedback("Item deleted", "red");
                }
            }
        }
    });
};
//Add item to list
form.addEventListener("submit", function(e){
    e.preventDefault();
    const itemName =  itemInput.value;
    console.log("Item name: ", itemName);
    //if input is empty
    if(itemName.length === 0){
        sendFeedback("Please enter valid value", "red");
    }
    else{
        //add to list
        todoItems.push(itemName);
        setLocalStorage(todoItems);
        getList(todoItems);
        sendFeedback("Item added to the list", "green");
    }
    //after adding, clear input
    itemInput.value = "";
});

//Save and load to local storage
const setLocalStorage = function (todoItems) {
    localStorage.setItem("todoItems", JSON.stringify(todoItems)); 
}

const getLocalStorage = function(){
    const todoStorage = localStorage.getItem("todoItems"); 
    if (todoStorage === "undefined" || todoStorage === null) {
        todoItems = [];
    }
    else{
        todoItems = JSON.parse(todoStorage); //converts JSON string to array
        getList(todoItems);
    }
};
//retrieve already saved items if there are any
getLocalStorage();

//Updates the feedback bar at the top of the page
function sendFeedback(text, className){
    feedback.classList.add(`${className}`);
    feedback.innerHTML = text;
    //makes the feedback bar disappear and returns it to default
    setTimeout(() => {
        feedback.classList.remove(`${className}`);
        feedback.innerHTML = "Write value for item";  
    }, 3000); //3 seconds or 3000 milliseconds
}

//Clear all items
clearBtn.onclick=()=>{
    if(confirm("Are you sure you want to clear the list?")){
        todoItems = [];
        localStorage.clear();
        getList(todoItems);
    }
}

