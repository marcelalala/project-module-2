const toggleTextAreaBoxEdit = (idx) => {
	const reviewDiv = document.querySelector('#review' + idx);
	reviewDiv.querySelector(`.textReview`).toggleAttribute('disabled');
	reviewDiv.querySelector(`.ratingReview`).toggleAttribute('disabled');
	reviewDiv.querySelector('.save').toggleAttribute('hidden');
	reviewDiv.querySelector('.edit').toggleAttribute('hidden');
};

const calculateAvgAndShow = () => {
	const ratingsHTML = document.querySelectorAll('.ratingReview');
	let sum = 0;
	for (let i = 0; i < ratingsHTML.length; i++) {
		sum += parseInt(ratingsHTML[i].value);
		console.log(sum);
	}
	const avg = sum / ratingsHTML.length;
	document.querySelector('#avg').innerText = `${avg.toFixed(2)}`;
};
calculateAvgAndShow();

const reviewDivs = document.querySelectorAll('.editable');

for (let i = 0; i < reviewDivs.length; i++) {
	reviewDivs[i].setAttribute('id', 'review' + i);

	//EDIT BUTTON
	reviewDivs[i].querySelector('.edit').onclick = () => {
		toggleTextAreaBoxEdit(i);
	};

	//SAVE BUTTON
	reviewDivs[i].querySelector('.save').onclick = () => {
		const reviewID = document.querySelector(`#review${i}`).querySelector('.reviewID').value;
		const text = document.querySelector(`#review${i}`).querySelector(`.textReview`).value;
		const rating = document.querySelector(`#review${i}`).querySelector(`.ratingReview`).value;
		axios
			.put(`${document.URL}/api/review/${reviewID}`, { text, rating })
			.then((response) => {
				console.log(response.data);
				toggleTextAreaBoxEdit(i);
				calculateAvgAndShow();
			})
			.catch((err) => console.log(err));
	};

	//DELETE BUTTON
	reviewDivs[i].querySelector('.delete').onclick = () => {
		const reviewID = document.querySelector(`#review${i}`).querySelector('.reviewID').value;
		axios
			.delete(`${document.URL}/api/review/${reviewID}`)
			.then((response) => {
				console.log(response.data);
				if (response.data && response.data.courseDeleted) {
					window.location.href = `${window.location.origin}/course/list`;
				}
				document.querySelector('#alreadyReviwedMsg').innerText = '';
				document.querySelector('#addReviewCourseForm').removeAttribute('hidden');
				const div = document.querySelector(`#review${i}`);
				div.parentNode.removeChild(div);
			})
			.catch((err) => console.log(err));
	};
}
