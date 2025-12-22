const cube = document.getElementById("cube")
const faces = document.querySelectorAll(".face")
const grid = document.querySelector(".grid")
const tabs = document.querySelectorAll(".tabs button")
const sectionTitle = document.getElementById("section-title")

let currentFace = 0
let isRotating = false

/* real cube orientations */
const rotations = [
  { x: 0, y: 0 },      // front
  { x: 0, y: 180 },    // back
  { x: 0, y: -90 },    // right
  { x: 0, y: 90 },     // left
  { x: -90, y: 0 },    // top
  { x: 90, y: 0 }      // bottom
]

const categories = {
  frontend: "Client-side technologies for UI & UX",
  backend: "Server-side technologies & databases"
}

const skillsData = {
  frontend: [
    { title: "HTML", desc: "Structure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { title: "CSS", desc: "Styling", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { title: "JavaScript", desc: "Logic", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { title: "ReactJs", desc: "Functional", icon: "https://cdn.iconscout.com/icon/free/png-256/free-react-icon-svg-download-png-226053.png" }
  ],
  backend: [
    { title: "Node.js", desc: "Runtime", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { title: "MongoDB", desc: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" }
  ]
}

/* rotate cube */
function rotateToFace(i) {
  if (isRotating) return
  isRotating = true

  cube.style.transform =
    `rotateX(${rotations[i].x}deg) rotateY(${rotations[i].y}deg)`

  currentFace = i
  setTimeout(() => isRotating = false, 1100)
}

/* fill face */
function fillFace(i, data) {
  const f = faces[i]
  f.querySelector("img").src = data.icon || ""
  f.querySelector("h3").textContent = data.title
  f.querySelector("p").textContent = data.desc
}

/* category click */
function showCategory(cat) {
  fillFace(0, { title: cat.toUpperCase(), desc: categories[cat] })
  rotateToFace(0)
  renderSkills(cat)
}

/* render skills */
function renderSkills(cat) {
  grid.innerHTML = ""

  skillsData[cat].forEach((skill, idx) => {
    const faceIndex = (idx + 1) % 6
    fillFace(faceIndex, skill)

    const el = document.createElement("div")
    el.className = "skill"
    el.innerHTML = `<img src="${skill.icon}">`

    el.addEventListener("mouseenter", () => rotateToFace(faceIndex))
    el.addEventListener("click", () => rotateToFace(faceIndex))

    grid.appendChild(el)
  })
}

/* tabs */
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"))
    tab.classList.add("active")
    showCategory(tab.dataset.cat)
  })
})

showCategory("frontend")
