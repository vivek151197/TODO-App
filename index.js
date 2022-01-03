/*have speific id for each task and keep the elements id as common instead of 'id+elementid'
Ex: taskid = 6544645645 titleid = title. this title is for all tasks. taskid is unique
fix the css of priority border so that it doesn't move the whole task when added.
*/

const inputVal = document.getElementsByClassName('inputVal')[0]
const donetask = document.getElementsByClassName('doneTasks')[0]
const doneTasksDiv = document.getElementById('DoneTasksdiv')

inputVal.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    let taskListObject = {
      id: '',
      title: '',
      notes: '',
      duedate: '',
      priority: '',
      done: false,
      show: false
    }
    if (inputVal.value.trim() != 0) {
      let localItems = JSON.parse(localStorage.getItem('task'))

      if (localItems === null) taskList = []
      else taskList = localItems

      taskListObject.done = false
      taskListObject.id = window.crypto
        .getRandomValues(new Uint32Array(1))[0]
        .toString()
      taskListObject.title = inputVal.value
      taskList.push(taskListObject)
      localStorage.setItem('task', JSON.stringify(taskList))
    }
    showItem(taskList)
    inputVal.value = ''
  }
})

let localItems = JSON.parse(localStorage.getItem('task'))
if (localItems === null) taskList = []
else taskList = localItems

function showItem (listOfTasks) {
  let html = ''
  let itemShow = document.querySelector('.todoLists')
  listOfTasks.forEach((data, index) => {
    html += `
    <div id = '${data.id}' class='task' style='border-left:${priorityborder(
      data.priority
    )}'>
      ${checkboxHTML(data)}
      ${titleHTML(data)}
      <span id = 'date' class = 'date'>${
        data.duedate ? new Date(data.duedate).toLocaleDateString() : ''
      } </span>
      ${showHideHTML(data)}
      <div style='display: none' id='innerContent'>
      <div class = 'innerContent'>
        <div class = 'notesdiv'>
          Notes
          <br/>
          ${NotesHTML(data)}
        </div>
        <div class = 'datepriority'>
          Due Date
          <br />
          ${duedateHTML(data)}
          <br/><br/>
          Priority
          <br />
          ${priorityHTML(data)}
          <br /> <br /> <br />
          <button class='deleteTask' onClick='deleteItem(${
            data.id
          }, ${index})'>Delete</button>
        </div>
      </div>
      </div>
    </div>
    `
  })
  itemShow.innerHTML = html
}
showItem(taskList)

function checkboxHTML (task) {
  return `<input type='checkbox' id = 'checkbox' onChange = checkbox(${
    task.id
  }) ${task.done ? 'checked' : ''}/>`
}

function titleHTML (task) {
  return `<input class = 'title' type = 'text' id = 'pText' value = '${
    task.title
  }' style = 'text-decoration: ${
    task.done ? 'line-through' : 'none'
  }' onChange = updateTitle(${task.id}) />`
}

function showHideHTML (task) {
  return `<button id='details' class='Details' onClick = showHide(${task.id}) >\u25BC</button>`
}

function NotesHTML (task) {
  if (task.notes) {
    return `<textarea type='text' id='notes' class = 'notes' onblur = addnotes(${task.id}) > ${task.notes} </textarea>`
  }
  return `<textarea type='text' id='notes' class = 'notes' onblur = addnotes(${task.id}) > </textarea>`
}

function duedateHTML (task) {
  if (task.duedate) {
    return `<input type='date' id='duedate' class = 'duedate' onChange = addDate(${task.id}) value = '${task.duedate}'/>`
  }
  return `<input type='date' id='duedate' class = 'duedate' onChange = addDate(${task.id}) />`
}

function priorityHTML (task) {
  return `<select id='priority' class = 'priority' onChange = addPriority(${
    task.id
  })>
  <option value=0 ${task.priority === '0' ? 'selected' : ''}>None</option>
  <option value=1 ${task.priority === '1' ? 'selected' : ''}>Low</option>
  <option value=2 ${task.priority === '2' ? 'selected' : ''}>Medium</option>
  <option value=3 ${task.priority === '3' ? 'selected' : ''}>High</option>
  </select>`
}

function priorityborder (priority) {
  return {
    '0': 'solid white 5px',
    '1': 'solid blue 5px',
    '2': 'solid orange 5px',
    '3': 'solid rgb(210, 0, 50) 5px'
  }[priority]
}

function fetchtask (id) {
  return (
    taskList.filter(t => t.id === id.toString())[0] ||
    completedTasksList.filter(t => t.id === id.toString())[0]
  )
}

function updateTitle (id) {
  const title = document.getElementById(`${id}`).querySelector('#pText')
  task = fetchtask(id)
  task.title = title.value
  localStorage.setItem('task', JSON.stringify(taskList))
  localStorage.setItem('completedtasks', JSON.stringify(completedTasksList))
}

function showHide (id) {
  const innerdetails = document
    .getElementById(`${id}`)
    .querySelector(`#innerContent`)
  const details = document.getElementById(`${id}`).querySelector(`#details`)
  task = fetchtask(id)
  if (!task.show) {
    innerdetails.style = 'display: inline-block'
    details.innerText = '\u25B2'
  } else {
    innerdetails.style = 'display: none'
    details.innerText = '\u25BC'
  }
  task.show = !task.show
  localStorage.setItem('task', JSON.stringify(taskList))
}

let completedItems = JSON.parse(localStorage.getItem('completedtasks'))
if (completedItems === null) completedTasksList = []
else completedTasksList = completedItems

function checkbox (id) {
  const check = document.getElementById(`${id}`).querySelector('#checkbox')
  const title = document.getElementById(`${id}`).querySelector('#pText')
  task = fetchtask(id)
  if (check.checked) {
    title.style = 'text-decoration: line-through'
    task.done = true

    completedTasksList.push(task)
    taskList = taskList.filter(t => t.id !== id.toString())

    if (donetask.value === `\u{1F50D} Show Done Tasks`) showItem(taskList)
    else showItem(taskList.concat(completedTasksList))

    doneTasksDiv.style.display = 'inline-block'
  } else {
    title.style = 'text-decoration: none'
    task.done = false
    taskList.push(completedTasksList.filter(t => t.id === id.toString())[0])
    completedTasksList = completedTasksList.filter(t => t.id !== id.toString())
    showItem(taskList.concat(completedTasksList))

    if (completedTasksList.length === 0) {
      doneTasksDiv.style.display = 'none'
      showHideDoneTasks()
      doneTasksClick = !doneTasksClick
    } else doneTasksDiv.style.display = 'inline-block'
  }
  localStorage.setItem('task', JSON.stringify(taskList))
  localStorage.setItem('completedtasks', JSON.stringify(completedTasksList))
}

if (completedTasksList.length === 0) doneTasksDiv.style.display = 'none'
else doneTasksDiv.style.display = 'inline-block'

let doneTasksClick = true
function showHideDoneTasks () {
  if (completedTasksList.length === 0) {
    donetask.value = `\u{1F50D} Show Done Tasks`
    return
  }
  if (doneTasksClick) {
    showItem(taskList.concat(completedTasksList))
    donetask.value = `\u{1F50D} Hide Done Tasks`
  } else {
    showItem(taskList)
    donetask.value = `\u{1F50D} Show Done Tasks`
  }
  doneTasksClick = !doneTasksClick
}

function addPriority (id) {
  const priority = document.getElementById(`${id}`).querySelector(`#priority`)
  task = fetchtask(id)
  task.priority = priority.value
  priority.children[priority.value].selected = true
  localStorage.setItem('task', JSON.stringify(taskList))
  const taskdiv = document.getElementById(`${task.id}`)
  taskdiv.style = `border-left: ${priorityborder(task.priority)}`
}

function addDate (id) {
  const duedate = document.getElementById(`${id}`).querySelector(`#duedate`)
  const date = document.getElementById(`${id}`).querySelector(`#date`)
  date.innerText = new Date(duedate.value).toLocaleDateString()
  task = fetchtask(id)
  task.duedate = duedate.value
  localStorage.setItem('task', JSON.stringify(taskList))
}

function addnotes (id) {
  const notes = document.getElementById(`${id}`).querySelector(`#notes`)
  task = fetchtask(id)
  task.notes = notes.value
  localStorage.setItem('task', JSON.stringify(taskList))
}

function deleteItem (id, index) {
  task = fetchtask(id)
  if (task.done) {
    completedTasksList.splice(index - taskList.length, 1)
    localStorage.setItem('completedtasks', JSON.stringify(completedTasksList))
    showItem(taskList.concat(completedTasksList))
  } else {
    taskList.splice(index, 1)
    localStorage.setItem('task', JSON.stringify(taskList))
    showItem(taskList)
  }
  if (completedTasksList.length === 0) {
    doneTasksDiv.style.display = 'none'
    doneTasksClick = !doneTasksClick
  }
}

function clearTask () {
  localStorage.clear()
  inputVal.value = ''
  taskList = []
  completedTasksList = []
  showItem(taskList)
  doneTasksDiv.style.display = 'none'
}

function clearDoneTask () {
  completedTasksList = []
  localStorage.setItem('completedtasks', JSON.stringify(completedTasksList))
  showItem(taskList)
  if (!doneTasksClick) showHideDoneTasks()
  doneTasksDiv.style.display = 'none'
}
