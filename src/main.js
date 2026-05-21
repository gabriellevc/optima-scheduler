import './style.css'
import { db } from './firebase'
import {
  collection,
  addDoc
} from 'firebase/firestore'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

document.querySelector('#app').innerHTML = `

<div class="container">

  <h1>Optima Delivery Scheduler</h1>

  <div class="form">

    <select id="company">

  <option value="">Company</option>

  <option value="ABCM Concrete">ABCM Concrete</option>

  <option value="B&B Predalle">B&B Predalle</option>

  <option value="Bonello Concrete">Bonello Concrete</option>

  <option value="KAK Steel">KAK Steel</option>

  <option value="Matsurv">Matsurv</option>

  <option value="Rock Cut Concrete">Rock Cut Concrete</option>

  <option value="ABBS Delivery">ABBS Delivery</option>

  <option value="Secis Pump">Secis Pump</option>

  <option value="Crane">Crane</option>

  <option value="HMS Delivery">HMS Delivery</option>

</select>

    <input type="date" id="dateRequested">

    <input type="text" id="type" placeholder="Type">

    <input type="text" id="qnt" placeholder="Qnt">

    <input type="text" id="remarks" placeholder="Remarks">

    <select id="site">

  <option value="">Select Site</option>

  <option value="Attard New Site Jeff">Attard New Site Jeff</option>

  <option value="Attard New Site Kevin">Attard New Site Kevin</option>

  <option value="Burmarrad">Burmarrad</option>

  <option value="Bidnija 2">Bidnija 2</option>

  <option value="Bidnija Mario">Bidnija Mario</option>

  <option value="Naxxar Road">Naxxar Road</option>

  <option value="Balzan">Balzan</option>

  <option value="Paceville Hotel">Paceville Hotel</option>

  <option value="Bathroom Design">Bathroom Design</option>

  <option value="Zebbug">Zebbug</option>

  <option value="Paola">Paola</option>

  <option value="Bajjada Rabat">Bajjada Rabat</option>

  <option value="Qannic">Qannic</option>

  <option value="Mosta Tonio Sultana">Mosta Tonio Sultana</option>

  <option value="Manikata">Manikata</option>

  <option value="Mosta Marius">Mosta Marius</option>

</select>

    <input type="date" id="bookingDate">

    <input type="time" id="time">

    <button id="addBtn">
      Add
    </button>

    <button id="pdfBtn">
  Generate PDFs
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

document.getElementById('pdfBtn').addEventListener('click', () => {

  const rows = document.querySelectorAll('#tableBody tr')

  const companies = {}

  rows.forEach(row => {

    const cells = row.querySelectorAll('td')

    const company = cells[0].innerText

    if(!companies[company]){
      companies[company] = []
    }

    companies[company].push([
      cells[1].innerText,
      cells[2].innerText,
      cells[3].innerText,
      cells[4].innerText,
      cells[5].innerText,
      cells[6].innerText,
      cells[7].innerText,
      cells[8].innerText
    ])

  })

  Object.keys(companies).forEach(company => {

    const doc = new jsPDF()

    doc.text(`${company} Deliveries`, 14, 15)

    autoTable(doc, {

      startY: 25,

      head: [[
        'Date Requested',
        'Type',
        'Qnt',
        'Remarks',
        'Site',
        'Booking Date',
        'Time',
        'Confirmed'
      ]],

      body: companies[company]

    })

    doc.save(`${company}.pdf`)

  })

})