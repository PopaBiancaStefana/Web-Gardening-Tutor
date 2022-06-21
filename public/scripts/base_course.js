//-------- SET THE COURSE --------

function setCourse(course) {
    window.location.href = 'courses/' + course;
    sessionStorage.setItem("course", course);
}