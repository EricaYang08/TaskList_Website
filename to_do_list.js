const addButton = document.getElementById("add_button");
const inputTask = document.getElementById("input_task");
const taskList = document.getElementById("List");

//create a new task along with the close button
//set the relationship between close button and new task
function newTask(taskContent) {
    //create new task list
    const li = document.createElement('li');
    li.classList.add('to_do_item');

    const span = document.createElement('span')
    span.classList.add("task_content");
    span.textContent = taskContent;

    //create close button at the end
    const CloseButton = document.createElement('button');
    CloseButton.textContent = '\u00D7';
    CloseButton.classList.add('close_button');

    //add close button and li to the list
    li.appendChild(span)
    li.appendChild(CloseButton);
    taskList.appendChild(li);

    //set when click close button, li remove
    CloseButton.addEventListener('click', function () {
        li.classList.add('removing');

        //set time for li.remove
        setTimeout(function(){
            li.remove();

        },500);
    })
}

// event listener for the add button click
//when click, implement newTask function to create a new task
addButton.addEventListener('click', function () {
    const taskContent = inputTask.value.trim()
    if (taskContent != '') {
        newTask(taskContent);
        inputTask.value = '';
    }
});

//enter key can also submit input task
inputTask.addEventListener('keypress', function (event) {
    if (event.key == 'Enter') {
        addButton.click();
    }
});

//set close button to close the parent element which is li
const closeButton = document.querySelectorAll('.close_button');
closeButton.forEach(function (button) {
    button.addEventListener('click', function () {
        const taskLi = button.parentElement;
        taskLi.classList.add('removing');
        
        setTimeout(function(){
            taskLi.remove();
        },500)

    });
});


//set modification for the to do list task
taskList.addEventListener("click", function (event) {
    const target = event.target;
    const taskLi = target.closest('.to_do_item')

    //when click the task
    if (taskLi) {
        //find the corresponding span with task_content
        const taskContentElement = target.querySelector('.task_content')

        if (taskContentElement && (target === taskLi || target === taskContentElement)) {
            //create a new input field
            const inputField = document.createElement('input')
            inputField.type = 'text';
            inputField.value = taskContentElement.textContent

            //create the taskContent value and add input field to task Content
            taskContentElement.textContent = '';
            taskContentElement.appendChild(inputField);

            //set it to be focused
            inputField.focus();

            //set the text input field same side as the outside
            inputField.style.width = `${target.clientWidth}px`;
            inputField.style.height = `${target.clientHeight}px`;
            inputField.style.fontSize = '110%';

            //when not focus, update value
            inputField.addEventListener('blur', function () {
                const newContent = inputField.value.trim();
                taskContentElement.textContent = newContent;
            });

            //when click enter, also update values
            inputField.addEventListener('keypress', function (event) {
                if (event.key == 'Enter') {
                    const newContent = inputField.value.trim();
                    taskContentElement.textContent = newContent;
                };
            });
        };
    };
});
