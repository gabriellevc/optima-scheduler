import './style.css'
import { db } from './firebase'
import {
  collection,
  addDoc
} from 'firebase/firestore'
document.querySelector('#app').innerHTML = `

<div class="container">

  <h1>Optima Delivery Scheduler</h1>

  <div class="form">

    <select id="company">
      <option value="">Company</option>
      <option value="Predalle">Predalle</option>
      <option value="Naxxar DC">Naxxar DC</option>
      <option value="HMS">HMS</option>
      <option value="Attard Concrete">Attard Concrete</option>
    </select>

    <input type="date" id="dateRequested">

    <input type="text" id="type" placeholder="Type">

    <input type="text" id="qnt" placeholder="Qnt">

    <input type="text" id="remarks" placeholder="Remarks">

    <input type="text" id="site" placeholder="Site">

    <input type="date" id="bookingDate">

    <input type="time" id="time">

    <button id="addBtn">
      Add
    </button>

  </div>

  <table>

    <thead>
      <tr>
        <th>Company</th>
        <th>Date Requested</th>
        <th>Type</th>
        <th>Qnt</th>
        <th>Remarks</th>
        <th>Site</th>
        <th>Booking Date</th>
        <th>Time</th>
        <th>Confirmed</th>
      </tr>
    </thead>

    <tbody id="tableBody">

    </tbody>

  </table>

</div>
`

document.getElementById('addBtn').addEventListener('click', async () => {

  const company = document.getElementById('company').value
  const dateRequested = document.getElementById('dateRequested').value
  const type = document.getElementById('type').value
  const qnt = document.getElementById('qnt').value
  const remarks = document.getElementById('remarks').value
  const site = document.getElementById('site').value
  const bookingDate = document.getElementById('bookingDate').value
  const time = document.getElementById('time').value
 
  const table = document.getElementById('tableBody')

  let deliveries = JSON.parse(localStorage.getItem('deliveries')) || []

  const row = `
    <tr>
      <td>${company}</td>
      <td>${dateRequested}</td>
      <td>${type}</td>
      <td>${qnt}</td>
      <td>${remarks}</td>
      <td>${site}</td>
      <td>${bookingDate}</td>
      <td>${time}</td>
<td class="status no-status">
  NO
</td>

<td>
  <button class="confirm-btn">
    Confirm
  </button>
</td>

<td>
  <button class="delete-btn">
    Delete
  </button>
</td>

<td>
  <button class="edit-btn">
    Edit
  </button>
</td>
    </tr>
  `

  table.innerHTML += row

  await addDoc(collection(db, 'deliveries'), {

  company,
  dateRequested,
  type,
  qnt,
  remarks,
  site,
  bookingDate,
  time,
  confirmed: 'NO'

})

  deliveries.push({
  company,
  dateRequested,
  type,
  qnt,
  remarks,
  site,
  bookingDate,
  time,
  confirmed: 'NO'
})

localStorage.setItem(
  'deliveries',
  JSON.stringify(deliveries)
)

  const lastRow = table.lastElementChild

const confirmBtn = lastRow.querySelector('.confirm-btn')
const deleteBtn = lastRow.querySelector('.delete-btn')
const editBtn = lastRow.querySelector('.edit-btn')
const statusCell = lastRow.querySelector('.status')

confirmBtn.addEventListener('click', () => {

  statusCell.innerHTML = 'YES'

  statusCell.classList.remove('no-status')
  statusCell.classList.add('yes-status')

})

deleteBtn.addEventListener('click', () => {

  lastRow.remove()

})

editBtn.addEventListener('click', () => {

  const newQnt = prompt('New Quantity:')
  const newRemarks = prompt('New Remarks:')
  const newBookingDate = prompt('New Booking Date:')
  const newTime = prompt('New Time:')

  if(newQnt){
    lastRow.cells[3].innerHTML = newQnt
  }

  if(newRemarks){
    lastRow.cells[4].innerHTML = newRemarks
  }

  if(newBookingDate){
    lastRow.cells[6].innerHTML = newBookingDate
  }

  if(newTime){
    lastRow.cells[7].innerHTML = newTime
  }

})

})