let events = []
let editingIndex = null;

function updateLocationOptions() {
  const modality = document.getElementById("event_modality").value;

  const locationContainer = document.getElementById("location_container");
  const remoteContainer = document.getElementById("remote_url_container");

  const locationInput = document.getElementById("event_location");
  const remoteInput = document.getElementById("event_remote_url");

  if (modality === "remote") {
    locationContainer.classList.add("d-none");
    remoteContainer.classList.remove("d-none");

    locationInput.required = false;
    locationInput.disabled = true;

    remoteInput.required = true;
    remoteInput.disabled = false;
  } else {
    locationContainer.classList.remove("d-none");
    remoteContainer.classList.add("d-none");

    locationInput.required = true;
    locationInput.disabled = false;

    remoteInput.required = false;
    remoteInput.disabled = true;
  }
}

function saveEvent() {
    const form = document.getElementById("event_form");
    if (!form.reportValidity()) {
        return;
    }
    let loc = null
    let remote = null
    if(document.getElementById("event_modality").value === "remote") {
        remote = document.getElementById("event_remote_url").value
    }
    else {
        loc = document.getElementById("event_location").value
    }
    const eventDetails = {
        id: editingIndex===null ? Date.now() : events[editingIndex].id,
        name: document.getElementById("event_name").value,
        weekday: document.getElementById("event_weekday").value,
        time: document.getElementById("event_time").value,
        modality: document.getElementById("event_modality").value,
        location: loc,
        remote_url: remote,
        attendees: document.getElementById("event_attendees").value,
        category: document.getElementById("event_category").value,
    };

    if (editingIndex===null) {
        events.push(eventDetails);
    }
    else {
        events[editingIndex] = eventDetails;
        editingIndex = null;
    }
    displayAllEvents();

    const modalElement = document.getElementById('event_modal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.hide();
    form.reset();

}

function createEventCard(eventDetails) {
    const eventElement = document.createElement("div");
    eventElement.className = "event row border rounded m-1 py-1";

    const eventContent = document.createElement("div");

    if (eventDetails.category === "Academic") {
        eventElement.classList.add("bg-primary", "text-white");
    }
    else if (eventDetails.category === "Work") {
        eventElement.classList.add("bg-warning", "text-dark");
    }
    else if (eventDetails.category === "Personal") {
        eventElement.classList.add("bg-success", "text-white");
    }
    else if (eventDetails.category === "Social") {
        eventElement.classList.add("bg-info", "text-dark");
    }

    if (eventDetails.modality === "remote") {
        eventContent.innerHTML = `
            <strong>${eventDetails.name}</strong><br>
            Time: ${eventDetails.time}<br>
            Modality: ${eventDetails.modality}<br>
            URL: ${eventDetails.remote_url}<br>
            Attendees: ${eventDetails.attendees}
        `;
    } else {
        eventContent.innerHTML = `
            <strong>${eventDetails.name}</strong><br>
            Time: ${eventDetails.time}<br>
            Modality: ${eventDetails.modality}<br>
            Location: ${eventDetails.location}<br>
            Attendees: ${eventDetails.attendees}
        `;
    }

    eventElement.appendChild(eventContent);
    eventElement.addEventListener("click", function() {
        editEvent(eventDetails.id);
    })
    return eventElement;
}
function addEventToCalendarUI(eventInfo) {
    const eventCard = createEventCard(eventInfo);

    const weekdayColumn = document.getElementById(
        eventInfo.weekday.toLowerCase()
    );
    weekdayColumn.appendChild(eventCard);
}

function editEvent(id) {
    editingIndex = events.findIndex(event => event.id === id);

    const event = events[editingIndex];

    document.getElementById("event_name").value = event.name;
    document.getElementById("event_weekday").value = event.weekday;
    document.getElementById("event_time").value = event.time;
    document.getElementById("event_modality").value = event.modality;
    document.getElementById("event_attendees").value = event.attendees;
    document.getElementById("event_category").value = event.category;

    if (event.modality === "remote") {
        document.getElementById("event_remote_url").value = event.remote_url;
        document.getElementById("event_location").value = "";
    }
    else {
        document.getElementById("event_location").value = event.location;
        document.getElementById("event_remote_url").value = "";
    }

    updateLocationOptions();

    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

function displayAllEvents() {
    document.querySelectorAll(".event").forEach(event => {
        event.remove();
    });

    events.forEach(event => {
        addEventToCalendarUI(event);
    });
}

function prepareNewEvent() {
    editingIndex = null;

    document.getElementById("event_form").reset();

    updateLocationOptions();
}

const eventModal = document.getElementById("event_modal");

eventModal.addEventListener("hide.bs.modal", function () {
    if (eventModal.contains(document.activeElement)) {
        document.activeElement.blur();
    }
});