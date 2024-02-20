const studentArr = [
    { name: 'Humosh', surname: 'Axmedov', lastname: 'Nazarovich', dob: new Date(1993, 8, 25), faculty: "Computer Science", studyStart: 2009 },
    { name: 'Bobur', surname: 'Samiyev', lastname: 'Nazarovich', dob: new Date(1995, 10, 15), faculty: "Computer Science", studyStart: 2009 },
    { name: 'Asad', surname: 'Aralov', lastname: 'Norbekovich', dob: new Date(1998, 2, 22), faculty: "Computer Science", studyStart: 2009 },
]

function formatDate(date) {
    // Получаем компоненты даты
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Добавляем нули для чисел меньше 10
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    // Возвращаем строку в формате "ГГГГ-ММ-ДД"
    return `${day}-${month}-${year}`;
}
function formatDateAndAge(dob) {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return `${dob.toLocaleDateString()} (${age} years old)`;
}
function getLearnPeriod(startYear) {
    const now = new Date();
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    let currentDate = now.getDate()
    const learnYears = 4
    const monthStartLearn = 9 // месяц сентябрь если он прошел то обучение закончено иначе выводится курс

    let course = currentYear - startYear - (0 > (currentMonth - monthStartLearn || currentDate - 1)) //1 октября
    course = ++course > learnYears ? 'закончил' : `${course} курс`
    let period = `${startYear} - ${+startYear + learnYears} (${course})`

    return period
  }




  
// Функция добавления студента в массив
const $addForm = document.getElementById('add-form')
$addForm.addEventListener('submit', function (e) {
    e.preventDefault()
    const nameValue = document.getElementById('nameInput').value
    const surnameValue = document.getElementById('surnameInput').value
    const lastnameValue = document.getElementById('lastnameInput').value
    const birthDayValue = document.getElementById('dobInput').value
    const facultyValue = document.getElementById('facultyInput').value
    const studyStartValue = document.getElementById('startStudyInput').value.trim()

    const newStudentObj = {
        name: nameValue,
        surname: surnameValue,
        lastname: lastnameValue,
        dob: new Date(birthDayValue),
        faculty: facultyValue,
        studyStart: studyStartValue
    }

    studentArr.push(newStudentObj);
    $addForm.reset();
    renderStudents(studentArr)
})


function createNewStudent(studObj) {
    const $tr = document.createElement("tr");
    const $tdFullName = document.createElement('td');
    const $tdDob = document.createElement('td');
    const $tdFaculty = document.createElement('td');
    const $tdStudyStart = document.createElement('td');

    $tdFullName.textContent = `${studObj.name}  ${studObj.surname} ${studObj.lastname}`;
    $tdDob.textContent = `${formatDate(studObj.dob)}`;
    $tdFaculty.textContent = `${studObj.faculty}`;
    $tdStudyStart.textContent = `${getLearnPeriod(studObj.studyStart)}`;
    $tr.append($tdFullName, $tdDob, $tdFaculty, $tdStudyStart)
    return $tr
}

function renderStudents(arr) {
    const $studentsTable = document.getElementById("studentsTable")
    //clear table before rendering new data
    $studentsTable.innerHTML = "";

    for (const studObj of arr) {
        let $row = createNewStudent(studObj);

        $studentsTable.appendChild($row);
    }
}
renderStudents(studentArr)