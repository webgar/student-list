document.addEventListener('DOMContentLoaded', function () {

    const $addForm = document.getElementById('add-form')
    const studentsTable = document.getElementById("studentsTable")
    const thElements = studentsTable.querySelectorAll("th");
    let sortOrder = 1; // Начальное направление сортировки
    const filterForm = document.getElementById('filter-form');

    let studentsData = localStorage.getItem('students')
    let studentArr = JSON.parse(studentsData) || [];


    // Обработчик добавления студента в массив
    $addForm.addEventListener('submit', function (e) {
        e.preventDefault()
        const nameValue = document.getElementById('nameInput').value.trim()
        const surnameValue = document.getElementById('surnameInput').value.trim()
        const lastnameValue = document.getElementById('lastnameInput').value.trim()
        const birthDayValue = document.getElementById('dobInput').value
        const facultyValue = document.getElementById('facultyInput').value.trim()
        const studyStartValue = document.getElementById('startStudyInput').value.trim()

        const validationResult = validateForm($addForm);

        if (validationResult === true) {
            const newStudentObj = {
                name: nameValue,
                surname: surnameValue,
                lastname: lastnameValue,
                dob: new Date(birthDayValue),
                faculty: facultyValue,
                studyStart: studyStartValue
            }

            if (studentArr.some(student =>
                student.name === newStudentObj.name &&
                student.surname === newStudentObj.surname &&
                student.lastname === newStudentObj.lastname &&
                new Date(student.dob).getTime() === newStudentObj.dob.getTime() &&
                student.faculty === newStudentObj.faculty &&
                student.studyStart === newStudentObj.studyStart
            )) {
                alert("Это значение уже используется");
                return false;
            }
            studentArr.push(newStudentObj);
            localStorage.setItem("students", JSON.stringify(studentArr));
            $addForm.reset();
            renderStudents(studentArr)
        }
    })

    // Функция форматирование  даты
    // Принимает параметр - строка с датой в формате "2019-12-31"
    function formatDateAndAge(dob) {
        const today = new Date();
        const dateOfBirth = new Date(dob);
        let diffYears = today.getFullYear() - dateOfBirth.getFullYear();
        let diffMonths = today.getMonth() - dateOfBirth.getMonth();
        let diffDays = today.getDate() - dateOfBirth.getDate();
        if (diffDays < 0 || (diffMonths < 0 && diffDays === 0)) {
            diffMonths++;
        }
        if (diffMonths < 0) {
            diffYears--; diffMonths += 12;
        }
        const age = diffYears;

        return `${dateOfBirth.toLocaleDateString()} (${age} years old)`;
    }

    // Добавляем обработчик события "submit" на форму
    filterForm.addEventListener('submit', function (event) {
        // Отменяем стандартное поведение формы (перезагрузку страницы)
        event.preventDefault();

        // Вызываем функцию applyFilters() для применения фильтров
        applyFilters();
        filterForm.reset();
    })

    //Добавляет функционал сортировки к таблице
    thElements.forEach(th => {
        th.addEventListener('click', () => {
            // Получаем значение атрибута data-sort по которому будем сортировать
            const sortBy = th.dataset.sort;

            // Сортируем студентов по выбранному критерию

            sortOrder *= -1; // Инвертируем направление сортировки
            const sortedStudents = sortStudents(studentArr, sortBy, sortOrder);

            // Обновляем таблицу с отсортированными данными
            renderStudents(sortedStudents);
        });
    });

    //Функция добавления студента в таблицу
    function createNewStudent(studObj) {
        const $tr = document.createElement("tr");
        const $tdFullName = document.createElement('td');
        const $tdDob = document.createElement('td');
        const $tdFaculty = document.createElement('td');
        const $tdStudyStart = document.createElement('td');
        const $btnBox = document.createElement('div');
        const $removeBtn = document.createElement('button');

        $tdFullName.textContent = `${studObj.name}  ${studObj.surname} ${studObj.lastname}`;
        $tdDob.textContent = `${formatDateAndAge(studObj.dob)}`;
        $tdFaculty.textContent = `${studObj.faculty}`;
        $tdStudyStart.textContent = `${getLearnPeriod(studObj.studyStart)}`;
        $removeBtn.type = 'button'
        $removeBtn.classList.add('btn', 'btn-danger');
        $removeBtn.textContent = 'Remove';
        $btnBox.append($removeBtn)
        $tr.append($tdFullName, $tdDob, $tdFaculty, $tdStudyStart, $btnBox)

        $removeBtn.addEventListener('click', () => {
            // Находим индекс объекта, который нужно удалить
            const indexToRemove = studentArr.findIndex(student => student === studObj);
            // Если объект найден, удаляем его из массива
            if (indexToRemove !== -1) {
                studentArr.splice(indexToRemove, 1);
                // Перерисовываем список студентов
                $tr.remove()
                localStorage.setItem('students', JSON.stringify(studentArr));
            }
        });


        return $tr
    }
    renderStudents(studentArr)

    function applyFilters() {
        const nameFilter = document.getElementById("nameFilter").value.trim().toLowerCase();
        const facultyFilter = document.getElementById("facultyFilter").value.trim().toLowerCase();
        const startYearFilter = parseInt(document.getElementById("startYearFilter").value.trim());
        const endYearFilter = parseInt(document.getElementById("endYearFilter").value.trim());

        let filteredStudents = studentArr.filter((student) => {
            if (nameFilter && !(
                student.name.toLowerCase().includes(nameFilter) ||
                student.surname.toLowerCase().includes(nameFilter) ||
                student.lastname.toLowerCase().includes(nameFilter)
            )) {
                return false;
            }
            if (facultyFilter && !student.faculty.toLowerCase().includes(facultyFilter)) {
                return false;
            }

            if (startYearFilter && student.studyStart != startYearFilter) { // Исправление
                return false;
            }

            if (endYearFilter && (student.studyStart + 4) != endYearFilter) {
                return false;
            }

            return true;
        });

        renderStudents(filteredStudents);
    }


    //Функция период учёбы  

    function getLearnPeriod(startYear) {
        const now = new Date();
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()
        let currentDate = now.getDate()
        const learnYears = 4
        const monthStartLearn = 9 // месяц сентябрь если он прошел то обучение закончено иначе выводится курс

        let course = currentYear - startYear - (0 > (currentMonth - monthStartLearn || currentDate - 1)) //1 октября
        course = ++course > learnYears ? 'finished' : `${course} course`
        let period = `${startYear} - ${+startYear + learnYears} (${course})`

        return period
    }

    //Функция валидация форм
    function validateForm(form) {
        let isValid = true;
        const allInputs = form.querySelectorAll('input');

        // Валидация обязательных полей
        for (const input of allInputs) {
            removeError(input);

            if (input.value.trim() === '') { // Use .trim() to handle trailing/leading whitespace
                createError(input, 'This field is required.');
                isValid = false;
            }
        }

        // Валидация даты рождения
        const birthDateInput = form.querySelector('#dobInput'); // Ensure correct ID selection
        if (birthDateInput && birthDateInput.value) {
            const dob = new Date(birthDateInput.value);
            if (dob < new Date('1900-01-01') || dob > new Date()) {
                createError(birthDateInput, 'Invalid date of birth. Must be between 1900-01-01 and today.');
                isValid = false;
            }
        }

        // Валидация года начала обучения
        const startYearInput = form.querySelector('#startStudyInput'); // Ensure correct ID selection
        if (startYearInput && startYearInput.value) {
            const startYear = parseInt(startYearInput.value);
            const currentYear = new Date().getFullYear();
            if (isNaN(startYear) || startYear < 2000 || startYear > currentYear) {
                createError(startYearInput, 'Invalid start year. Must be a number between 2000 and the current year.');
                isValid = false;
            }
        }

        return isValid;
    }
    //Функция  добавления ошибки к инпуту
    function removeError(input) {

        if (input.classList.contains('is-invalid')) {
            input.parentNode.querySelector('.invalid-feedback').remove()
            input.classList.remove('is-invalid')
        }
    }

    //Функция  создания ошибки у инпута
    function createError(input, message) {
        const parent = input.parentNode;
        const errorDiv = document.createElement('div')

        errorDiv.classList.add('invalid-feedback')
        errorDiv.textContent = message

        input.classList.add('is-invalid')

        parent.append(errorDiv)
    }

    //Функция филтирации 



    //Функция сортировки
    function sortStudents(students, sortBy, sortOrder) {
        return students.sort((a, b) => {
            const valueA = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
            const valueB = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];

            // Используем множитель sortOrder для изменения направления сортировки
            const compareResult = (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0)) * sortOrder;

            return compareResult;
        });
    }

    //Функция рендеринга


    function renderStudents(arr) {
        const studentsTableBody = document.getElementById('table-body')

        studentsTableBody.innerHTML = "";

        for (const studObj of arr) {
            let $row = createNewStudent(studObj);

            studentsTableBody.appendChild($row);
        }


    }
})