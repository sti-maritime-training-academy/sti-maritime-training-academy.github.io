import Papa from 'https://cdn.jsdelivr.net/npm/papaparse-min/+esm'
import MarkdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it/+esm'

var courses;
let loadedfn = null;

if (!courses) {
	Papa.parse("/courses.csv", {
		download: true,
		header: true,
		skipEmptyLines: "greedy",
		encoding: "UTF-8",
		complete: function(results) {
			courses = results.data;

			if (loadedfn) {
				loadedfn();
			}
		}
	});
}

(function() {
	let code = window.location.search.match(/[\?\&]code=([^\&]*)/);

	if (code) {
		code = decodeURIComponent(code[1]);
	} else {
		window.location.replace("/courses.html");
		return;
	}

	let course;

	loadedfn = function() {
		if (!course) {
			for (let i = 0, len = courses.length; i < len; i++) {
				if (courses[i].Code === code) {
					course = courses[i];
					break;
				}
			}

			if (!course) {
				window.location.replace("/courses.html");
				return;
			}
		}

		let eleCode = document.getElementById("coursecode");
		let eleTitle = document.getElementById("coursetitle");
		let eleType = document.getElementById("coursetype");
		let eleMode = document.getElementById("coursemode");
		let eleThumb = document.getElementById("coursethumb");
		
		let title = course.Title;
		
		document.title = title;
		
		document.getElementById("coursebutton").querySelector("a[href=\"http://m.me/stitrainingacademy\"]").href =
			"http://m.me/stitrainingacademy?text=" + encodeURIComponent(
				"Hello, I'm interested in the course \"" + title + "\""
			);

		eleCode.innerHTML = code;

		eleTitle.innerHTML = title;

		if (course.Type) {
			eleType.innerHTML = course.Type;
		} else {
			eleType.parentElement.remove();
		}

		if (course.Modality) {
			eleMode.innerHTML = course.Modality;
		} else {
			eleMode.parentElement.remove();
		}

		if (course.Thumbnail) {
			eleThumb.style.background = "url(/thumbnails/"
				+ encodeURIComponent(course.Thumbnail)
				+ ") top 50% left 50%/cover repeat";
		}

		let xhr = new XMLHttpRequest();
		xhr.onload = function() {
			if (this.status !== 200) return;

			document.getElementById("coursedesc").innerHTML = MarkdownIt().render(this.responseText);
		}
		xhr.open("GET", "/descriptions/" + code.replace(/<>\:"\/\\|\?\*/g, "_") + ".md", true);
		xhr.send();

		document.getElementById("courseinfosection").style.display = "block";
    };

	if (courses) {
		loadedfn();
	}
})();