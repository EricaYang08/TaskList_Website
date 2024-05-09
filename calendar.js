//variable for create the calendar
const monthYearElement = document.getElementById('monthYear');
const daysElement = document.querySelector('.days');
const day_hold = document.getElementById('day_hold');

//variables for events
const addEventButton = document.getElementById('addEventButton');
const eventForm = document.getElementById('eventForm');
const eventTitleInput = document.getElementById('eventTitle');
const eventStartTimeInput = document.getElementById('eventStartTime');
const eventEndTimeInput = document.getElementById('eventEndTime');
const eventsContainer = document.getElementById('eventContainer');
const saveEventButton = document.getElementById('saveEvent');

//initialize of current Date and selected Date
let currentDate = new Date();
let selectedDateElement = null;

// Object to store events by date
let selectedDateEvents = {};

//function for initialize the calendar
function createCalendar() {
    //clear all current day elements
    daysElement.innerHTML = '';

    //create month Year section by finding the current year month
    const monthYear = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentDate.getFullYear();
    monthYearElement.textContent = monthYear;

    //find first day and last day of each year
    //first Day get the day in week day from 0 to 6
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    //last day get the day in the month from 1 to 31
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    //for each day before first day, make it empty div
    for (let i = 0; i < firstDay; i++) {
        const placeholder = document.createElement('div');
        daysElement.appendChild(placeholder);
    }

    //for each day before last day, create valid div with text Content
    for (let i = 1; i <= lastDay; i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        dayElement.classList.add('valid');
        daysElement.appendChild(dayElement);


        //for each day element, add event listener for click
        dayElement.addEventListener('click', function () {

            //for each clicked day, find the corresponding weekday 
            //and the month and display it in day_hold
            const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dayName = clickedDate.toLocaleString('default', { weekday: 'long' });
            day_hold.textContent = `${dayName}, ${clickedDate.getMonth() + 1}/${clickedDate.getDate()}`;

            // Remove clicked_day class from previously selected dayElement
            if (selectedDateElement) {
                selectedDateElement.classList.remove('clicked_day');
            }

            // Add clicked_day class to the newly clicked dayElement
            dayElement.classList.add('clicked_day');
            // Update selectedDateElement to the clicked dayElement
            selectedDateElement = dayElement;

            //display the events of the clicked Date
            displayEvents(clickedDate);
        });

        //set default clicked day = today and update the day_hold as default too
        if (i === currentDate.getDate() && currentDate.getMonth() === currentDate.getMonth()) {
            dayElement.classList.add('clicked_day');
            const dayName = currentDate.toLocaleString('default', { weekday: 'long' });
            day_hold.textContent = `${dayName}, ${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
            selectedDateElement = dayElement;
        }
    }
}



//start of the next function here!
//function for display the events by their date
function displayEvents(date) {
    eventsContainer.innerHTML = '';

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    //find the clicked day using date variable
    const dateString = date.toISOString().split('T')[0];
    const events = selectedDateEvents[dateString] || [];

    //for each event, create a div and update text content for each events
    events.forEach((event, index) => {

        //for each event, update event content
        const eventElement = document.createElement('div');
        eventElement.textContent = `${event.title} (${event.startTime} - ${event.endTime})`;

        // add close button to each event
        const event_close = document.createElement('button')
        event_close.textContent = '\u00D7';
        event_close.classList.add('close_button');
        //change color to white so it is visible
        event_close.style.color = 'white';
        //add click function for  event close button 
        event_close.addEventListener('click', function () {
            //when the event is not null
            if (selectedDateEvents[dateString]) {
                //remove one element at index 'index' from selectedDateEvents[dateString]
                selectedDateEvents[dateString].splice(index, 1);
                //display rest of the events
                displayEvents(date);
            }
        })

        //append button to the event and append event to the outside div
        eventElement.appendChild(event_close);
        eventsContainer.appendChild(eventElement);
    });

    //check when the events for a day is more than 0, add class, else, remove class
    const dayElement = document.querySelector(`.days > div:nth-child(${date.getDate() + firstDay})`);
    if (events.length > 0) {
        dayElement.classList.add('event_day');
    } else {
        dayElement.classList.remove('event_day');
    }

}


//each time click the add event button, display the event form for user input
addEventButton.addEventListener('click', function () {
    eventForm.style.display = 'flex';
});

//click function for save button --used for one event
saveEventButton.addEventListener('click', function () {
    //get all input for one event
    const eventTitle = eventTitleInput.value.trim();
    const eventStartTime = eventStartTimeInput.value.trim();
    const eventEndTime = eventEndTimeInput.value.trim();


    //when all input is completed,start update
    if (eventTitle && eventStartTime && eventEndTime && selectedDateElement) {
        //create clicked Date as date element
        clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(selectedDateElement.textContent));
        // separate date object clicked Date for the date element
        const startDateString = clickedDate.toISOString().split('T')[0];

        //create event
        const newEvent = {
            title: eventTitle,
            startTime: eventStartTime,
            endTime: eventEndTime
        };

        //if events for a day is null, initialize it
        if (!selectedDateEvents[startDateString]) {
            selectedDateEvents[startDateString] = [];
        }
        //add the newEvent to the object selectedDate Events
        selectedDateEvents[startDateString].push(newEvent);


        //clear all value after updating
        eventTitleInput.value = '';
        eventStartTimeInput.value = '';
        eventEndTimeInput.value = '';

        //make it display after update
        eventForm.style.display = 'none';
        //display the events after updating
        displayEvents(clickedDate);
    }
});

// Initial creation of the calendar
createCalendar();

// Event listener for navigating to previous month
document.getElementById('prevMonth').addEventListener('click', function () {
    //make current as month-1
    currentDate.setMonth(currentDate.getMonth() - 1);
    displayEvents(currentDate);
    //create calendar using the new currentDate
    createCalendar();
});

// Event listener for navigating to next month
document.getElementById('nextMonth').addEventListener('click', function () {
    //make current as month+1
    currentDate.setMonth(currentDate.getMonth() + 1);
    displayEvents(currentDate);
    createCalendar();
});
