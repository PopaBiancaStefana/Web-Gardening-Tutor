//-------- SET THE COURSE --------

function setCourse(course, difficulty) {
    window.location.href = 'course_template.html';
    sessionStorage.setItem("course", course);
    sessionStorage.setItem("difficulty", difficulty);

}

