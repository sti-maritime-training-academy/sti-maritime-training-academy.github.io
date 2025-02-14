import Papa from 'https://cdn.jsdelivr.net/npm/papaparse-min/+esm'

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

let replaceinfoboxhtml = function(infoboxhtml, course) {
	infoboxhtml = infoboxhtml
		.replace("{title}", course.Title)
		.replace("{code}", course.Code)
		.replace("/%7Blink%7D", "/courseinfo.html?code=" + encodeURIComponent(course.Code));

	if (course.Thumbnail) {
		infoboxhtml = infoboxhtml.replace(
			"id=\"coursethumb\"", "style=\"background: url(/thumbnails/"
				+ encodeURIComponent(course.Thumbnail)
				+ ") top 50% left 50%/cover repeat\""
		);
	}

	return infoboxhtml;
};

var infoboxhtml;

let infobox = document.getElementsByClassName("courseinfobox")[0];

let listbox = infobox.parentElement;

if (!infoboxhtml) infoboxhtml = infobox.outerHTML;

loadedfn = function() {
	let innerhtml = [];

	for (let i = courses.length; i--;) {
		if (courses[i].Featured === "TRUE") {
			innerhtml.push(replaceinfoboxhtml(infoboxhtml, courses[i]));
		}
	}

	listbox.innerHTML = innerhtml.join("");
};

if (courses) {
	loadedfn();
}